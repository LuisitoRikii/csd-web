# CSD Good Services — Frontend

Premium space-transformation studio — React + Vite frontend.

See root `/README.md` for full setup, or:

```bash
npm install --legacy-peer-deps
npm run dev    # http://localhost:5173
```

Build:
```bash
npm run build
```

## Structure

```
src/
├── components/
│   ├── layout/       Header, Footer, FloatingActions
│   ├── sections/     Hero, About, Services, Portfolio, Process, Testimonials, CTA, MapSection, Marquee
│   ├── admin/        AdminShell, Modal, ConfirmModal, ImageUploader, Input
│   └── svg/          PaintElements (BrushDivider, Splash, PaintDrop, ...), CustomCursor, BrushCursor
├── pages/            Public pages + admin pages
├── contexts/         AuthContext, LanguageContext
├── services/         API client (axios)
├── locales/          i18n setup + en.json / es.json
├── routes/           PublicRoute + AdminRoute tree
└── styles/           Tailwind + custom CSS
```

## Environment

Create `.env`:

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_URL=http://localhost:5173
VITE_MEDIA_URL=http://localhost:8000
```
