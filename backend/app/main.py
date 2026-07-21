import mimetypes
import os
from sqlalchemy import inspect, text
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, StreamingResponse
from app.core.config import settings
from app.database.session import engine, Base
from app.database.base import (
    User, Service, Category, Project, Quote, Appointment,
    BlogPost, ContactMessage, SiteSettings, Testimonial, TeamMember,
)


def create_tables():
    Base.metadata.create_all(bind=engine)


def ensure_project_columns():
    """Add home-section columns to existing projects tables (SQLite has no
    built-in schema migration, so we ALTER TABLE manually before the seed runs)."""
    inspector = inspect(engine)
    if "projects" not in inspector.get_table_names():
        return

    existing = {column["name"] for column in inspector.get_columns("projects")}
    additions = [
        ("show_on_home_videos", "BOOLEAN DEFAULT 0"),
        ("home_videos_order", "INTEGER DEFAULT 0"),
        ("show_on_home_before_after", "BOOLEAN DEFAULT 0"),
        ("home_before_after_order", "INTEGER DEFAULT 0"),
        ("home_before_after_tag", "VARCHAR"),
    ]
    with engine.begin() as connection:
        for name, definition in additions:
            if name not in existing:
                connection.execute(text(f'ALTER TABLE projects ADD COLUMN {name} {definition}'))


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="CSD Good Services - Premium transformation studio API",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS + ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if not os.path.exists(settings.UPLOAD_DIR):
        os.makedirs(settings.UPLOAD_DIR)
        for folder in ["images", "videos", "blog", "quotes"]:
            os.makedirs(os.path.join(settings.UPLOAD_DIR, folder), exist_ok=True)

    @app.get("/uploads/{file_path:path}", include_in_schema=False)
    def serve_upload(file_path: str, request: Request):
        root = os.path.realpath(settings.UPLOAD_DIR)
        full_path = os.path.realpath(os.path.join(root, file_path))
        if not full_path.startswith(root + os.sep) or not os.path.isfile(full_path):
            return Response(status_code=404)

        size = os.path.getsize(full_path)
        media_type = mimetypes.guess_type(full_path)[0] or "application/octet-stream"
        range_header = request.headers.get("range")
        if not range_header or not range_header.startswith("bytes="):
            return FileResponse(full_path, media_type=media_type, headers={"Accept-Ranges": "bytes"})

        try:
            start_value, end_value = range_header.removeprefix("bytes=").split(",", 1)[0].split("-", 1)
            if start_value:
                start = int(start_value)
                end = int(end_value) if end_value else size - 1
            else:
                suffix_length = int(end_value)
                start = max(0, size - suffix_length)
                end = size - 1
            if start < 0 or start >= size or end < start:
                raise ValueError
            end = min(end, size - 1)
        except (TypeError, ValueError):
            return Response(status_code=416, headers={"Content-Range": f"bytes */{size}"})

        length = end - start + 1

        def stream_range():
            with open(full_path, "rb") as uploaded:
                uploaded.seek(start)
                remaining = length
                while remaining > 0:
                    chunk = uploaded.read(min(64 * 1024, remaining))
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    yield chunk

        return StreamingResponse(
            stream_range(),
            status_code=206,
            media_type=media_type,
            headers={
                "Accept-Ranges": "bytes",
                "Content-Range": f"bytes {start}-{end}/{size}",
                "Content-Length": str(length),
            },
        )

    from app.routers import (
        auth, users, services, categories, projects,
        quotes, appointments, blog, contact, uploads,
        settings as settings_router, dashboard, files,
        testimonials, team,
    )

    prefix = settings.API_V1_PREFIX
    app.include_router(auth.router, prefix=prefix)
    app.include_router(users.router, prefix=prefix)
    app.include_router(services.router, prefix=prefix)
    app.include_router(categories.router, prefix=prefix)
    app.include_router(projects.router, prefix=prefix)
    app.include_router(quotes.router, prefix=prefix)
    app.include_router(appointments.router, prefix=prefix)
    app.include_router(blog.router, prefix=prefix)
    app.include_router(contact.router, prefix=prefix)
    app.include_router(uploads.router, prefix=prefix)
    app.include_router(settings_router.router, prefix=prefix)
    app.include_router(dashboard.router, prefix=prefix)
    app.include_router(files.router, prefix=prefix)
    app.include_router(testimonials.router, prefix=prefix)
    app.include_router(team.router, prefix=prefix)

    @app.get("/")
    def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": "1.0.0",
            "docs": "/docs",
            "status": "active",
        }

    @app.get("/health")
    def health():
        return {"status": "healthy"}

    return app


app = create_app()


@app.on_event("startup")
def on_startup():
    create_tables()
    ensure_project_columns()
    from app.core.seed import seed_data
    seed_data()
