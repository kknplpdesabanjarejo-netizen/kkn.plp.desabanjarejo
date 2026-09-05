import os
import io

import cloudinary
import cloudinary.uploader
import requests


APP_NAME = "kkn-plp-66"

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
    secure=True,
)

MIME_TYPES = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
}


def put_object(path: str, data: bytes, content_type: str) -> dict:
    folder = os.path.dirname(path)
    filename = os.path.basename(path)
    public_id = os.path.splitext(filename)[0]

    result = cloudinary.uploader.upload(
        io.BytesIO(data),
        folder=folder or APP_NAME,
        public_id=public_id,
        resource_type="image",
        overwrite=True,
    )

    return {
        "path": result["secure_url"],
        "url": result["secure_url"],
        "secure_url": result["secure_url"],
        "public_id": result["public_id"],
    }


def get_object(path: str):
    url = path

    if not path.startswith("http://") and not path.startswith("https://"):
        cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
        url = f"https://res.cloudinary.com/{cloud_name}/image/upload/{path}"

    resp = requests.get(url, timeout=60)
    resp.raise_for_status()

    return resp.content, resp.headers.get(
        "Content-Type",
        "application/octet-stream",
    )
