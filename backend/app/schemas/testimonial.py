from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TestimonialBase(BaseModel):
    author: str
    role: Optional[str] = None
    body: str
    rating: int = Field(default=5, ge=1, le=5)
    is_active: bool = True
    order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    author: Optional[str] = None
    role: Optional[str] = None
    body: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    is_active: Optional[bool] = None
    order: Optional[int] = None


class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True