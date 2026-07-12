from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.session import Base


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title_en = Column(String, nullable=False)
    title_es = Column(String, nullable=False)
    excerpt_en = Column(Text, nullable=False)
    excerpt_es = Column(Text, nullable=False)
    content_en = Column(Text, nullable=False)
    content_es = Column(Text, nullable=False)
    cover_image = Column(String, nullable=True)
    category = Column(String, default="general")
    tags = Column(String, nullable=True)
    author = Column(String, default="CSD Good Services")
    read_time = Column(Integer, default=5)
    is_featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(String, nullable=True)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    published_at = Column(DateTime, nullable=True)
