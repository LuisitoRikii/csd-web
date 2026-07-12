import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.database.session import engine, Base
from app.database.base import (
    User, Service, Category, Project, Quote, Appointment,
    BlogPost, ContactMessage, SiteSettings,
)


def create_tables():
    Base.metadata.create_all(bind=engine)


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

    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

    from app.routers import (
        auth, users, services, categories, projects,
        quotes, appointments, blog, contact, uploads,
        settings as settings_router, dashboard,
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
    from app.core.seed import seed_data
    seed_data()
