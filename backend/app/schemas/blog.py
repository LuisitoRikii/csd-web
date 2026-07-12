from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BlogPostBase(BaseModel):
    slug: str
    title_en: str
    title_es: str
    excerpt_en: str
    excerpt_es: str
    content_en: str
    content_es: str
    cover_image: Optional[str] = None
    category: str = "general"
    tags: Optional[str] = None
    author: str = "CSD Good Services"
    read_time: int = 5
    is_featured: bool = False
    is_published: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title_en: Optional[str] = None
    title_es: Optional[str] = None
    excerpt_en: Optional[str] = None
    excerpt_es: Optional[str] = None
    content_en: Optional[str] = None
    content_es: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None


class BlogPostResponse(BlogPostBase):
    id: int
    view_count: int
    created_at: datetime
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True
