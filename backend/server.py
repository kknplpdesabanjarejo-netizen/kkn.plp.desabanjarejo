from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr

import auth as authmod
import seed_data
import storage

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("kkn")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="KKN-PLP Group 66 API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

api_router = APIRouter(prefix="/api")

BACKEND_URL = os.environ.get("BACKEND_URL", "")
ALLOWED_EXT = set(storage.MIME_TYPES.keys())
MAX_FILE_SIZE = 5 * 1024 * 1024


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def ok(data):
    return {"success": True, "data": data}


def serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    doc.pop("password_hash", None)
    return doc


# ---------------- Auth helpers ----------------
def get_token(request: Request) -> Optional[str]:
    token = request.cookies.get("access_token")
    if not token:
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            token = header[7:]
    return token


async def optional_user(request: Request) -> Optional[dict]:
    token = get_token(request)
    if not token:
        return None
    try:
        payload = authmod.decode_token(token)
        return await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    except Exception:
        return None


async def require_user(request: Request) -> dict:
    user = await optional_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Anda harus masuk terlebih dahulu.")
    return user


async def log_activity(user, action, resource, resource_id, request: Request):
    await db.activity_logs.insert_one({
        "id": str(uuid.uuid4()),
        "userId": user.get("id") if user else None,
        "userName": user.get("name") if user else None,
        "action": action,
        "resource": resource,
        "resourceId": resource_id,
        "ip": get_remote_address(request),
        "userAgent": request.headers.get("user-agent", ""),
        "created_at": now_iso(),
    })


# ---------------- Auth endpoints ----------------
class LoginInput(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
@limiter.limit("10/minute")
async def login(request: Request, response: Response, body: LoginInput):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not authmod.verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email atau kata sandi tidak valid.")
    if not user.get("isActive", True):
        raise HTTPException(status_code=403, detail="Akun tidak aktif.")
    token = authmod.create_access_token(user["id"], user["email"])
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none", max_age=604800, path="/")
    await log_activity(serialize(user), "LOGIN", "auth", user["id"], request)
    return ok({"token": token, "user": serialize(user)})


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response, user=Depends(require_user)):
    response.delete_cookie("access_token", path="/")
    await log_activity(user, "LOGOUT", "auth", user["id"], request)
    return ok({"message": "Berhasil keluar."})


@api_router.get("/auth/me")
async def me(user=Depends(require_user)):
    return ok(user)


# ---------------- Upload ----------------
@api_router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...), user=Depends(require_user)):
    ext = (file.filename.rsplit(".", 1)[-1] if "." in file.filename else "").lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Format file tidak didukung. Gunakan JPEG, PNG, atau WEBP.")
    data = await file.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Ukuran file terlalu besar. Maksimal 5MB.")
    path = f"{storage.APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    content_type = storage.MIME_TYPES[ext]
    try:
        result = storage.put_object(path, data, content_type)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=502, detail="Unggahan gagal. Silakan coba lagi.")
    stored_path = result["path"]
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": stored_path,
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": now_iso(),
    })
    await log_activity(user, "UPLOAD", "files", stored_path, request)
    
    return ok({
    "url": stored_path,
    "storageKey": stored_path
})


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File tidak ditemukan.")
    try:
        data, content_type = storage.get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File tidak ditemukan.")
    return Response(content=data, media_type=record.get("content_type", content_type),
                    headers={"Cache-Control": "public, max-age=31536000"})


# ---------------- Generic CRUD registration ----------------
def register_crud(path: str, collection: str, hide_field: Optional[str] = None):
    async def list_items(request: Request):
        user = await optional_user(request)
        query = {}
        if user is None and hide_field:
            query[hide_field] = {"$ne": False}
        docs = await db[collection].find(query).sort([("order", 1), ("created_at", 1)]).to_list(2000)
        return ok([serialize(d) for d in docs])

    async def create_item(request: Request, user=Depends(require_user)):
        body = await request.json()
        body.pop("_id", None)
        body.pop("id", None)
        doc = {**body, "id": str(uuid.uuid4()), "created_at": now_iso(), "updated_at": now_iso()}
        await db[collection].insert_one(doc)
        await log_activity(user, "CREATE", collection, doc["id"], request)
        return ok(serialize(doc))

    async def update_item(item_id: str, request: Request, user=Depends(require_user)):
        body = await request.json()
        body.pop("_id", None)
        body.pop("id", None)
        body["updated_at"] = now_iso()
        res = await db[collection].update_one({"id": item_id}, {"$set": body})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan.")
        doc = await db[collection].find_one({"id": item_id})
        await log_activity(user, "UPDATE", collection, item_id, request)
        return ok(serialize(doc))

    async def delete_item(item_id: str, request: Request, user=Depends(require_user)):
        res = await db[collection].delete_one({"id": item_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan.")
        await log_activity(user, "DELETE", collection, item_id, request)
        return ok({"id": item_id})

    api_router.add_api_route(f"/{path}", list_items, methods=["GET"], name=f"list_{collection}")
    api_router.add_api_route(f"/{path}", create_item, methods=["POST"], name=f"create_{collection}")
    api_router.add_api_route(f"/{path}/{{item_id}}", update_item, methods=["PUT"], name=f"update_{collection}")
    api_router.add_api_route(f"/{path}/{{item_id}}", delete_item, methods=["DELETE"], name=f"delete_{collection}")


register_crud("team", "team_members", hide_field="isActive")
register_crud("programs", "programs", hide_field="isActive")
register_crud("gallery", "gallery", hide_field="isPublished")
register_crud("timeline", "timeline", hide_field="isActive")
register_crud("archives", "archives", hide_field="isActive")
register_crud("videos", "videos", hide_field="isPublished")
register_crud("memories", "memories", hide_field="isActive")
register_crud("location", "locations", hide_field="isActive")


# ---------------- News (with slug) ----------------
register_crud("news", "news", hide_field="isPublished")


@api_router.get("/news/slug/{slug}")
async def news_by_slug(slug: str):
    doc = await db.news.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan.")
    return ok(serialize(doc))


# ---------------- Settings (single doc) ----------------
@api_router.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({})
    if not doc:
        doc = {**seed_data.settings(), "id": str(uuid.uuid4()), "created_at": now_iso(), "updated_at": now_iso()}
        await db.settings.insert_one(dict(doc))
    return ok(serialize(doc))


@api_router.put("/settings")
async def update_settings(request: Request, user=Depends(require_user)):
    body = await request.json()
    body.pop("_id", None)
    body["updated_at"] = now_iso()
    existing = await db.settings.find_one({})
    if existing:
        await db.settings.update_one({"id": existing["id"]}, {"$set": body})
        doc = await db.settings.find_one({"id": existing["id"]})
    else:
        doc = {**body, "id": str(uuid.uuid4()), "created_at": now_iso()}
        await db.settings.insert_one(dict(doc))
    await log_activity(user, "UPDATE", "settings", doc["id"], request)
    return ok(serialize(doc))


# ---------------- Stats & Activity logs ----------------
@api_router.get("/stats")
async def stats():
    team = await db.team_members.count_documents({"isActive": {"$ne": False}})
    progs = await db.programs.count_documents({"isActive": {"$ne": False}})
    gallery_c = await db.gallery.count_documents({})
    videos_c = await db.videos.count_documents({})
    docs = gallery_c + videos_c + await db.archives.count_documents({})
    tl = await db.timeline.count_documents({"isActive": {"$ne": False}})
    news_c = await db.news.count_documents({})
    archives_c = await db.archives.count_documents({})
    memories_c = await db.memories.count_documents({})
    return ok({
        "teamMembers": team,
        "programAreas": progs,
        "documentationItems": docs,
        "journeyStages": tl,
        "news": news_c,
        "gallery": gallery_c,
        "videos": videos_c,
        "archives": archives_c,
        "memories": memories_c,
    })


@api_router.get("/activity-logs")
async def activity_logs(user=Depends(require_user)):
    docs = await db.activity_logs.find({}).sort("created_at", -1).to_list(200)
    return ok([serialize(d) for d in docs])


@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.get("/health/db")
async def health_db():
    try:
        await db.command("ping")
        return {"status": "ok", "db": "connected"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database unavailable")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {exc}")
    return JSONResponse(status_code=500, content={"success": False, "message": "Terjadi kesalahan. Silakan coba lagi.", "code": "INTERNAL_ERROR"})


async def seed():
    await db.users.create_index("email", unique=True)
    await db.activity_logs.create_index("created_at")
    await db.news.create_index("slug")

    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "name": "Administrator KKN-PLP Kelompok 66",
            "email": admin_email,
            "password_hash": authmod.hash_password(admin_password),
            "role": "admin",
            "isActive": True,
            "created_at": now_iso(),
            "updated_at": now_iso(),
        })
        logger.info("Admin user seeded")
    elif not authmod.verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": authmod.hash_password(admin_password)}})

    for collection, fn in seed_data.SEED_MAP.items():
        if await db[collection].count_documents({}) == 0:
            items = fn()
            if items:
                docs = [{**it, "id": str(uuid.uuid4()), "created_at": now_iso(), "updated_at": now_iso()} for it in items]
                await db[collection].insert_many(docs)
                logger.info(f"Seeded {len(docs)} into {collection}")

    if await db.settings.count_documents({}) == 0:
        await db.settings.insert_one({**seed_data.settings(), "id": str(uuid.uuid4()), "created_at": now_iso(), "updated_at": now_iso()})


@app.on_event("startup")
async def on_startup():
    try:
        await seed()
    except Exception as e:
        logger.error(f"Seed error: {e}")
    try:
        storage.init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
