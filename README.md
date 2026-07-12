# CSD Good Services

Premium space-transformation studio — full-stack web application.

A complete editorial-grade web platform for a creative studio that transforms spaces through painting, murals, epoxy and remodels.

## Stack

**Frontend** · React 19 · Vite · TailwindCSS · Framer Motion · React Router · i18next · TanStack Query · Swiper · Lightbox

**Backend** · FastAPI · SQLAlchemy · SQLite · Pydantic · JWT · Alembic-compatible schema · Uploads

## Project Structure

```
csd-good-services/
├── backend/                # FastAPI + SQLAlchemy API
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── models/         # SQLAlchemy ORM
│   │   ├── schemas/        # Pydantic validation
│   │   ├── core/           # config, security, seed
│   │   ├── database/       # session, base
│   │   └── utils/          # file helpers
│   └── uploads/            # media storage
└── frontend/               # React + Vite SPA
    └── src/
        ├── components/     # UI + sections
        ├── pages/          # Public + Admin
        ├── contexts/       # Auth, Language
        ├── services/       # API client
        ├── locales/        # EN/ES translations
        └── routes/         # React Router
```

## Quick start

### Backend

```bash
cd backend
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API → http://localhost:8000
Swagger → http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Site → http://localhost:5173

### Default Admin

- URL: `/admin/login`
- Email: `admin@csdgoodservices.com`
- Password: `Admin123!`

## Features

- 🖼 **Hero** fullscreen video with parallax fall-back image
- 🎨 **SVG paint-themed interactive elements** — brushes, rollers, splashes, drip fills
- 🪟 **Custom cursor** that morphs on interactive elements
- 🏛 **Editorial typography** with Fraunces + Inter
- 🌐 **Bilingual EN / ES** via i18next
- 🧱 **Masonry portfolio** with lightbox & filters
- 🛠 **Admin panel** full CRUD for services / projects / categories / blog / quotes / appointments / messages / settings / users
- 📤 **Image uploads** with auto-optimisation
- 🧾 **JWT auth** with refresh tokens
- 🗺 **Schema.org / OpenGraph / Twitter** meta per page
- 🌗 **Light, premium palette** — cyan + violet + magenta triad over a warm canvas
- 📱 Mobile-first responsive down to 320px and up to 4K

## Design System

| Token        | Value     | Use                    |
| ------------ | --------- | ---------------------- |
| `canvas`     | `#FAFAF7` | Default bg             |
| `cream`      | `#F5F3EE` | Section bg             |
| `ink`        | `#0B0B12` | Text, dark sections    |
| `cyan`       | `#06B6D4` | Primary accent         |
| `violet`     | `#8B5CF6` | Secondary accent       |
| `magenta`    | `#D946EF` | Tertiary accent        |

Typography: Fraunces (display serif) + Inter (UI sans).

## License

For demo purposes. © 2026 CSD Good Services.
