# AGENTS.md — CSD Good Services

Two-package monorepo. `viejo/` (snapshot, gitignored) and `liposincirugia/` (nested git repo, unrelated project) sit at the root — ignore them.

```
backend/   FastAPI + SQLAlchemy + SQLite (Python 3.13, venv)
frontend/  React 19 + Vite + Tailwind + i18next (Node)
start.sh   Bootstraps venv + node_modules and runs both
```

## Run it

```bash
./start.sh                                                              # one-shot
# or manually:
(cd backend  && python3.13 -m venv venv && source venv/bin/activate \
              && pip install -r requirements.txt \
              && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) &
(cd frontend && npm install --legacy-peer-deps && npm run dev) &
```

- Backend  → http://localhost:8000  ·  Swagger at `/docs`
- Frontend → http://localhost:5173
- Admin    → `/admin/login`  ·  `admin@csdgoodservices.com` / `Admin123!`

## Backend quirks

- Entry: `app/main.py:create_app()`. Every router is mounted under `settings.API_V1_PREFIX` = `/api/v1`.
- **No Alembic.** `app/main.py:on_startup` does `create_tables()` + `ensure_project_columns()` (manual SQLite `ALTER TABLE` for new `projects` columns). If you add a column to `projects`, append it to `ensure_project_columns()`. For other tables, write an equivalent ALTER block in `on_startup` or existing DBs will hit `no such column`.
- `seed_data()` (`app/core/seed.py`) runs on every backend start and is idempotent (checks by `slug` / email). Edits to `seed.py` apply next restart. Don't run it manually in production.
- New model gotcha: SQLAlchemy `relationship("OtherModel")` is string-resolved at mapping time. Every model must be imported in `app/database/base.py` (mirror the `seed.py` comment) or you get `InvalidRequestError: Mapper 'X' has no property 'Y'`.
- Config in `app/core/config.py` reads `backend/.env`. Defaults point CORS at `https://prueba.jltechnology.com.uy` and `SECRET_KEY` to a placeholder — override both for any non-local use.
- Uploads: `POST /api/v1/upload/image` (single, admin-only, 50 MB max) and `/upload/images` (batch ≤20 files, 200 MB total). Stored under `backend/uploads/{images,videos,blog,quotes}/` and served at `/uploads/{path:path}` with HTTP Range support for video streaming (`serve_upload` in `main.py`).
- Auth: JWT HS256, 7-day expiry (`ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*7`). Token via `Authorization: Bearer …`. Changing `bcrypt<4.1` or `python-jose[cryptography]==3.3.0` breaks login — keep both pins.
- Two DB files exist on disk: `backend/csd.db` (empty, stale) and `backend/csd_good_services.db` (the live one from `DATABASE_URL`). Both gitignored. Don't commit populated DBs.
- Standalone upsert: `backend/seed_services.py` (`python seed_services.py` from `backend/` after activating venv) — service rows only.

## Frontend quirks

- **`npm install --legacy-peer-deps` is required.** React 19 + react-i18next/router peer-dep mismatches break a clean install.
- Scripts: `dev` / `build` / `preview` / `lint` (ESLint flat config via `package.json`).
- Env (`frontend/.env`):
  ```
  VITE_API_URL=http://localhost:8000/api/v1
  VITE_APP_URL=http://localhost:5173
  VITE_MEDIA_URL=http://localhost:8000
  VITE_WHATSAPP=13055550123
  ```
  If `VITE_API_URL` is unset, `src/config/index.js` defaults to `https://apiprueba.jltechnology.com.uy/api/v1` — the app will silently hit production.
- Vite dev server proxies `/uploads/*` → `http://localhost:8000` (`vite.config.js`), so uploaded media works without CORS changes.
- Path alias `@` → `src` (set in `vite.config.js`). Prefer it over deep relative imports.
- `localStorage` keys (don't rename casually — `api.js` and contexts read them):
  - `csd_token` — JWT
  - `csd_user` — JSON user blob (AuthContext)
  - `csd_lang` — i18n language (Locales i18n.js)
- Axios: `src/services/api.js` attaches the bearer token on every request. A 401 on `/admin/*` (excluding `/admin/login`) clears the token and bounces to login.
- Routing is one big manual `<Routes>` tree in `src/routes/index.jsx` — public wrapped in `PublicLayout`, admin in `AdminLayout` + `<ProtectedRoute>`. Add new admin pages by editing that file.
- i18n: `src/locales/en.json` + `es.json`. Edit the JSON directly; no external translation service.
- Design tokens (palette, type, spacing) live in `frontend/tailwind.config.js` — `mint`, `violet`, `magenta` accents over `canvas`/`ink` neutrals. Use these tokens; avoid ad-hoc hex.
- Reusable guidance for agents: `frontend/.agents/skills/` contains react-best-practices, tailwind-css-patterns, seo, react-hook-form, vite, accessibility, frontend-design, etc. Load via the `skill` tool when relevant.

## Verification

No test suite is wired up. Verification = manual `npm run dev` + `/docs`. Frontend lint: `cd frontend && npm run lint`. Backend has no formatter/typecheck step — keep imports clean and avoid circular model imports.
