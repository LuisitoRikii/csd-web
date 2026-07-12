from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.session import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name_en = Column(String, nullable=False)
    name_es = Column(String, nullable=False)
    description_en = Column(String, nullable=True)
    description_es = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    color = Column(String, default="#0EA5E9")
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
