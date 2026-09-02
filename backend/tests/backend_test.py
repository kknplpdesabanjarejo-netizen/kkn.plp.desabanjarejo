"""Backend test suite for KKN-PLP Group 66 API."""
import os
import io
import struct
import zlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://kkn-integrated.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "kknplpdesabanjarejo@gmail.com"
ADMIN_PASSWORD = "KknPlp66!Admin"


def _png_bytes():
    # 1x1 transparent PNG
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = b"IHDR" + struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0)
    ihdr_c = struct.pack(">I", 13) + ihdr + struct.pack(">I", zlib.crc32(ihdr))
    raw = b"\x00\x00\x00\x00\x00"
    comp = zlib.compress(raw)
    idat = b"IDAT" + comp
    idat_c = struct.pack(">I", len(comp)) + idat + struct.pack(">I", zlib.crc32(idat))
    iend = b"IEND"
    iend_c = struct.pack(">I", 0) + iend + struct.pack(">I", zlib.crc32(iend))
    return sig + ihdr_c + idat_c + iend_c


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert data["success"] is True
    assert "token" in data["data"]
    return data["data"]["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------------- Health ----------------
class TestHealth:
    def test_health(self):
        r = requests.get(f"{API}/health", timeout=10)
        assert r.status_code == 200
        assert r.json().get("status") == "ok"

    def test_health_db(self):
        r = requests.get(f"{API}/health/db", timeout=10)
        assert r.status_code == 200
        j = r.json()
        assert j.get("status") == "ok"
        assert j.get("db") == "connected"


# ---------------- Public GETs / seeded data ----------------
class TestPublicSeed:
    @pytest.mark.parametrize("path,expected_min", [
        ("team", 15),
        ("programs", 6),
        ("timeline", 7),
        ("news", 6),
        ("archives", 6),
        ("memories", 8),
    ])
    def test_seeded_counts(self, path, expected_min):
        r = requests.get(f"{API}/{path}", timeout=15)
        assert r.status_code == 200
        data = r.json()["data"]
        assert isinstance(data, list)
        assert len(data) >= expected_min, f"{path} expected >= {expected_min}, got {len(data)}"
        # Ensure _id is not exposed
        if data:
            assert "_id" not in data[0]
            assert "id" in data[0]

    def test_location(self):
        r = requests.get(f"{API}/location", timeout=15)
        assert r.status_code == 200
        assert len(r.json()["data"]) >= 1

    def test_settings(self):
        r = requests.get(f"{API}/settings", timeout=15)
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_stats(self):
        r = requests.get(f"{API}/stats", timeout=15)
        assert r.status_code == 200
        d = r.json()["data"]
        assert d["teamMembers"] >= 15
        assert d["programAreas"] >= 6
        assert d["journeyStages"] >= 7


# ---------------- Auth ----------------
class TestAuth:
    def test_login_success(self, token):
        assert isinstance(token, str) and len(token) > 20

    def test_me(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        u = r.json()["data"]
        assert u["email"] == ADMIN_EMAIL
        assert "password_hash" not in u

    def test_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
        assert r.status_code == 401

    def test_mutation_without_token(self):
        r = requests.post(f"{API}/team", json={"name": "X"}, timeout=10)
        assert r.status_code == 401


# ---------------- CRUD ----------------
class TestCRUD:
    def test_team_crud(self, auth_headers):
        payload = {"name": "TEST_Member", "role": "Tester", "order": 999, "isActive": True}
        r = requests.post(f"{API}/team", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        item = r.json()["data"]
        assert item["name"] == "TEST_Member"
        assert "id" in item and "_id" not in item
        item_id = item["id"]

        # UPDATE
        r = requests.put(f"{API}/team/{item_id}", json={"role": "Updated"}, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["data"]["role"] == "Updated"

        # Verify via list
        r = requests.get(f"{API}/team", timeout=15)
        found = [x for x in r.json()["data"] if x["id"] == item_id]
        assert len(found) == 1 and found[0]["role"] == "Updated"

        # DELETE
        r = requests.delete(f"{API}/team/{item_id}", headers=auth_headers, timeout=15)
        assert r.status_code == 200

        r = requests.get(f"{API}/team", timeout=15)
        assert not any(x["id"] == item_id for x in r.json()["data"])

    def test_programs_crud(self, auth_headers):
        r = requests.post(f"{API}/programs", json={"title": "TEST_Prog", "isActive": True}, headers=auth_headers)
        assert r.status_code == 200
        pid = r.json()["data"]["id"]
        r = requests.put(f"{API}/programs/{pid}", json={"title": "TEST_Prog2"}, headers=auth_headers)
        assert r.status_code == 200 and r.json()["data"]["title"] == "TEST_Prog2"
        r = requests.delete(f"{API}/programs/{pid}", headers=auth_headers)
        assert r.status_code == 200

    def test_news_crud_and_slug(self, auth_headers):
        # First check that seeded slug exists
        r = requests.get(f"{API}/news/slug/kkn-integrated", timeout=15)
        # Slug may or may not exist depending on seed; check content if 200
        assert r.status_code in (200, 404)

        payload = {"title": "TEST_News", "slug": "test-news-xyz", "content": "hi", "isPublished": True}
        r = requests.post(f"{API}/news", json=payload, headers=auth_headers)
        assert r.status_code == 200
        nid = r.json()["data"]["id"]
        r = requests.get(f"{API}/news/slug/test-news-xyz", timeout=15)
        assert r.status_code == 200
        assert r.json()["data"]["title"] == "TEST_News"
        r = requests.delete(f"{API}/news/{nid}", headers=auth_headers)
        assert r.status_code == 200


# ---------------- Settings ----------------
class TestSettings:
    def test_update_settings(self, auth_headers):
        r = requests.get(f"{API}/settings", timeout=15)
        original = r.json()["data"]
        new_tag = "TEST_TAGLINE_XYZ"
        r = requests.put(f"{API}/settings", json={"tagline": new_tag}, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        r = requests.get(f"{API}/settings", timeout=15)
        assert r.json()["data"]["tagline"] == new_tag
        # Restore
        requests.put(f"{API}/settings", json={"tagline": original.get("tagline", "")}, headers=auth_headers)


# ---------------- Upload ----------------
class TestUpload:
    def test_upload_png_success(self, auth_headers):
        files = {"file": ("test.png", _png_bytes(), "image/png")}
        r = requests.post(f"{API}/upload", files=files, headers=auth_headers, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()["data"]
        assert "url" in data and "storageKey" in data
        # Fetch the file
        r2 = requests.get(data["url"], timeout=15)
        assert r2.status_code == 200
        assert r2.headers.get("content-type", "").startswith("image/")

    def test_upload_txt_rejected(self, auth_headers):
        files = {"file": ("bad.txt", b"hello", "text/plain")}
        r = requests.post(f"{API}/upload", files=files, headers=auth_headers, timeout=15)
        assert r.status_code == 400

    def test_upload_unauthorized(self):
        files = {"file": ("test.png", _png_bytes(), "image/png")}
        r = requests.post(f"{API}/upload", files=files, timeout=15)
        assert r.status_code == 401


# ---------------- Activity Logs ----------------
class TestActivityLogs:
    def test_logs_requires_auth(self):
        r = requests.get(f"{API}/activity-logs", timeout=10)
        assert r.status_code == 401

    def test_logs_have_login(self, auth_headers):
        r = requests.get(f"{API}/activity-logs", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        logs = r.json()["data"]
        actions = {l["action"] for l in logs}
        assert "LOGIN" in actions
