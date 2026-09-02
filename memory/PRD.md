# PRD — KKN-PLP Integrated Group 66

## Original Problem Statement
Build a production-ready full-stack website for **KKN-PLP Integrated Group 66** (UIN K.H. Abdurrahman Wahid Pekalongan, 2026), tagline "Be Present. Learn. Serve." Public documentation platform + admin CMS. Prepared for Cloudflare (frontend) / Railway (backend) / MongoDB Atlas / Cloudflare R2. Real functional full-stack app, not a mockup.

## Architecture
- Frontend: React 19 (CRA/craco), Tailwind, Framer Motion, shadcn/ui, React Router.
- Backend: FastAPI, generic CRUD registration, JWT (bcrypt), slowapi rate limiting, centralized error handling.
- DB: MongoDB (collections: users, team_members, programs, gallery, news, timeline, archives, videos, memories, locations, settings, activity_logs, files). Docs use uuid `id`, `created_at`, `updated_at`.
- Storage: Emergent object storage via storage.py (upload/get, /api/files serve). Swappable to Cloudflare R2.

## User Personas
- Public visitor: browses group profile, team, programs, gallery, news, timeline, archives, videos, memories, location.
- Admin (Group 66 coordinator): manages all content via /admin dashboard.

## Core Requirements (static)
- API-driven public single page (15 sections). Team layout 2/4/4/5 for 15 members.
- Secure admin CRUD for all 10 content resources + settings + activity logs.
- JWT auth, bcrypt, protected mutations, image uploads (JPEG/PNG/WEBP, 5MB), placeholders (no fabricated identities), SEO, responsive, accessible, empty/loading/error states.

## Implemented (2026-06)
- Full backend: auth (login/logout/me), generic CRUD for team/programs/gallery/news/timeline/archives/videos/memories/location, settings singleton, /stats, /activity-logs, /upload + /files serve, /health + /health/db, seed on startup (admin + default content).
- Full frontend public site: Navbar, Hero, About, animated Statistics, Quick Access, Team (2/4/4/5 + modal), Programs, Timeline, Gallery (filters+search+lightbox), News (+ /news/:slug detail), Archives, Videos, Memories, Location (maps embed), Contact, Footer.
- Admin: login, sidebar layout, dashboard (stats + recent activity), generic ResourceManager (table/search/dialog form/image upload/delete confirm/toasts), Settings page, Activity Logs page.
- SEO (title/OG/Twitter/canonical), robots.txt, sitemap.xml. README + .env.example (backend/frontend).
- Tested: backend 24/24, frontend flows 100%. Fixed upload public-URL bug (PUBLIC_BASE_URL env).

## Admin credentials
kknplpdesabanjarejo@gmail.com / KknPlp66!Admin (see /app/memory/test_credentials.md)

## Backlog (P1/P2)
- P1: Cloudflare R2 storage swap in storage.py (boto3 S3 client).
- P1: Bulk gallery upload + drag reorder.
- P2: Swagger/OpenAPI docs page, pagination for large lists, dark-mode toggle on public site.
- P2: Add real team/village/link data through admin.

## Next Tasks
- Populate real content via admin dashboard.
- Wire R2 credentials for production storage before go-live.
