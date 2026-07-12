from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.session import Base


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)
    value_type = Column(String, default="string")
    group = Column(String, default="general")
    label_en = Column(String, nullable=True)
    label_es = Column(String, nullable=True)
    updated_at = Column(DateTime, onupdate=func.now())
