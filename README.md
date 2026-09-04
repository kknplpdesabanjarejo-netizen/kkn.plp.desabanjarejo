# KKN-PLP Integrated Group 66

Official digital information & documentation platform for **KKN-PLP Integrated Group 66**, UIN K.H. Abdurrahman Wahid Pekalongan (2026).
Tagline: **Be Present. Learn. Serve.**

A production-ready full-stack application: a polished public single-page website driven entirely by an API, plus a secure admin dashboard (CMS) for managing all content.

## Tech Stack
- **Frontend**: React 19, React Router, Tailwind CSS, Framer Motion, Lucide icons, shadcn/ui
- **Backend**: FastAPI (Python), REST API, JWT auth, bcrypt, slowapi rate limiting
- **Database**: MongoDB (Mongo Atlas in production)
- **Storage**: Emergent object storage (swappable with Cloudflare R2)

## Project Structure
```
backend/
  server.py          # FastAPI app: routes, generic CRUD, auth, uploads, seed
  auth.py            # bcrypt hashing + JWT helpers
  storage.py         # object storage service (upload/get)
  seed_data.py       # default seed content (placeholders, no fabricated identities)
  .env.example
frontend/
  src/
    lib/             # api client + data hooks
    context/         # AuthContext
    components/public # public website sections
    pages/           # PublicSite, NewsDetail
    pages/admin/     # login, layout, dashboard, generic ResourceManager, settings, logs
```

## Data Model (MongoDB collections)
`users`, `team_members`, `programs`, `gallery`, `news`, `timeline`, `archives`, `videos`, `memories`, `locations`, `settings`, `activity_logs`, `files`. Every document has `id`, `created_at`, `updated_at`.

## API (all under `/api`)
- Auth: `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- Public GET: `/team`, `/programs`, `/gallery`, `/news`, `/news/slug/:slug`, `/timeline`, `/archives`, `/videos`, `/memories`, `/location`, `/settings`, `/stats`
- Mutations (auth required): `POST/PUT/DELETE` on each resource, `PUT /settings`
- Uploads: `POST /upload` (auth), `GET /files/{path}` (public serve)
- Health: `GET /health`, `GET /health/db`

Response format: `{ "success": true, "data": ... }` or `{ "success": false, "message": ..., "code": ... }`.

## Local Development
Both services run under supervisor. Backend on `:8001`, frontend on `:3000`.
```
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```
Env: backend reads `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `EMERGENT_LLM_KEY`. Frontend reads `REACT_APP_BACKEND_URL`.

The admin user is seeded automatically on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Deployment

### MongoDB Atlas
1. Create a cluster and a database named `kkn_plp_66`.
2. Create a database user; add your backend host to Network Access (IP allowlist).
3. Copy the connection string and set it as `MONGO_URL`.

### Backend → Railway
1. Create a Railway project from the `backend/` service.
2. Set env vars from `.env.example` (`MONGO_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS`, `EMERGENT_LLM_KEY`).
3. Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`.
4. Health check path: `/api/health`.
5. Copy the public URL → use as the frontend `REACT_APP_BACKEND_URL`.

### Frontend → Cloudflare Pages
1. Build command `yarn build`, output dir `build/`.
2. Set `REACT_APP_BACKEND_URL` to the Railway API URL.
3. Configure the custom domain (e.g. `your-domain.com`), point API to `api.your-domain.com`.

### Cloudflare R2 (optional storage swap)
1. Create an R2 bucket and API token (Access Key ID + Secret).
2. Set `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.
3. Replace the body of `storage.py` (`put_object`/`get_object`) with an S3-compatible boto3 client; keep the upload endpoint contract unchanged.

## Security
Helmet-equivalent secure headers, CORS whitelist, bcrypt password hashing, JWT auth on all mutations, rate limiting on login, input validation, centralized error handling (no stack traces to clients), secrets only in env vars.

## Manual Configuration Notes
- Real team names, student IDs, study programs, village info, dates, and external links are intentionally left as placeholders / empty — add them via the admin dashboard. No identities are fabricated.
- File storage currently uses Emergent managed object storage; swap to Cloudflare R2 as described above for a fully self-hosted production setup.
<!--Trigger Cloudflare rebuild -->
