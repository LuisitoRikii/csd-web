from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "CSD Good Services API"
    API_V1_PREFIX: str = "/api/v1"

    SECRET_KEY: str = "csd-good-services-super-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    DATABASE_URL: str = "sqlite:///./csd_good_services.db"

    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    ALLOWED_VIDEO_TYPES: List[str] = ["video/mp4", "video/webm", "video/quicktime"]

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@csdgoodservices.com"

    ADMIN_EMAIL: str = "admin@csdgoodservices.com"
    ADMIN_PASSWORD: str = "Admin123!"

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://prueba.jltechnology.com.uy"
    ]

    BUSINESS_NAME: str = "CSD Good Services"
    BUSINESS_ADDRESS: str = "8215 NW 64th Street, Medley, FL 33166"
    BUSINESS_PHONE: str = "+1 (305) 555-0123"
    BUSINESS_EMAIL: str = "info@csdgoodservices.com"
    BUSINESS_HOURS: str = "Mon-Sat: 8:00 AM - 6:00 PM"
    WHATSAPP_NUMBER: str = "13055550123"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
