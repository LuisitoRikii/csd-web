from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class QuoteBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    service_id: Optional[int] = None
    service_name: Optional[str] = None
    description: str
    estimated_date: Optional[datetime] = None
    address: Optional[str] = None
    property_type: Optional[str] = None
    budget: Optional[str] = None
    language: str = "en"


class QuoteCreate(QuoteBase):
    images: Optional[List[str]] = []


class QuoteUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class QuoteImageResponse(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True


class QuoteResponse(QuoteBase):
    id: int
    status: str
    notes: Optional[str] = None
    images: List[QuoteImageResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True
