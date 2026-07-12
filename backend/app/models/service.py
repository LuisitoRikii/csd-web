from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.session import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title_en = Column(String, nullable=False)
    title_es = Column(String, nullable=False)
    description_en = Column(Text, nullable=False)
    description_es = Column(Text, nullable=False)
    long_description_en = Column(Text, nullable=True)
    long_description_es = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    long_image_url = Column(String, nullable=True)
    color = Column(String, default="#0EA5E9")
    order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
