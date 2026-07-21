from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TeamMemberBase(BaseModel):
    name: str
    role_en: Optional[str] = None
    role_es: Optional[str] = None
    bio_en: Optional[str] = None
    bio_es: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: bool = True
    order: int = 0


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role_en: Optional[str] = None
    role_es: Optional[str] = None
    bio_en: Optional[str] = None
    bio_es: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None


class TeamMemberResponse(TeamMemberBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True