from pydantic import BaseModel
from typing import Optional, List


class ProjectImageResponse(BaseModel):
    id: int
    image_url: str
    alt_text: Optional[str] = None
    order: int = 0

    class Config:
        from_attributes = True


class ServiceGalleryProject(BaseModel):
    """Compact project view embedded in service gallery responses."""

    id: int
    slug: str
    title_en: str
    title_es: str
    description_en: str
    description_es: str
    cover_image: Optional[str] = None
    location: Optional[str] = None
    year: Optional[str] = None
    services_used: Optional[str] = None
    order: int = 0
    images: List[ProjectImageResponse] = []

    class Config:
        from_attributes = True


class ServiceBase(BaseModel):
    slug: str
    title_en: str
    title_es: str
    description_en: str
    description_es: str
    long_description_en: Optional[str] = None
    long_description_es: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    long_image_url: Optional[str] = None
    color: Optional[str] = "#0EA5E9"
    order: int = 0
    is_featured: bool = False
    is_active: bool = True


class ServiceCreate(ServiceBase):
    project_ids: List[int] = []


class ServiceUpdate(BaseModel):
    slug: Optional[str] = None
    title_en: Optional[str] = None
    title_es: Optional[str] = None
    description_en: Optional[str] = None
    description_es: Optional[str] = None
    long_description_en: Optional[str] = None
    long_description_es: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    long_image_url: Optional[str] = None
    color: Optional[str] = None
    order: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    project_ids: Optional[List[int]] = None


class ServiceResponse(ServiceBase):
    id: int
    projects: List[ServiceGalleryProject] = []

    class Config:
        from_attributes = True
