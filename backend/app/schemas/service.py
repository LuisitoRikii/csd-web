from pydantic import BaseModel, Field
from typing import Optional


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
    pass


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


class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True
