from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CategoryBase(BaseModel):
    slug: str
    name_en: str
    name_es: str
    description_en: Optional[str] = None
    description_es: Optional[str] = None
    icon: Optional[str] = None
    color: str = "#0EA5E9"
    order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name_en: Optional[str] = None
    name_es: Optional[str] = None
    description_en: Optional[str] = None
    description_es: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True


class ProjectImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    order: int = 0


class ProjectImageResponse(ProjectImageBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    slug: str
    title_en: str
    title_es: str
    description_en: str
    description_es: str
    long_description_en: Optional[str] = None
    long_description_es: Optional[str] = None
    category_id: Optional[int] = None
    location: Optional[str] = None
    client: Optional[str] = None
    cover_image: Optional[str] = None
    video_url: Optional[str] = None
    before_image: Optional[str] = None
    after_image: Optional[str] = None
    services_used: Optional[str] = None
    duration: Optional[str] = None
    year: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True
    order: int = 0


class ProjectCreate(ProjectBase):
    images: List[str] = Field(default_factory=list)


class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title_en: Optional[str] = None
    title_es: Optional[str] = None
    description_en: Optional[str] = None
    description_es: Optional[str] = None
    long_description_en: Optional[str] = None
    long_description_es: Optional[str] = None
    category_id: Optional[int] = None
    location: Optional[str] = None
    client: Optional[str] = None
    cover_image: Optional[str] = None
    video_url: Optional[str] = None
    before_image: Optional[str] = None
    after_image: Optional[str] = None
    services_used: Optional[str] = None
    duration: Optional[str] = None
    year: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    order: Optional[int] = None
    images: Optional[List[str]] = None


class ProjectResponse(ProjectBase):
    id: int
    view_count: int
    created_at: datetime
    images: List[ProjectImageResponse] = Field(default_factory=list)
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
