from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class AppointmentBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    appointment_date: datetime
    appointment_time: str
    service_type: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None
    language: str = "en"


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    appointment_date: Optional[datetime] = None
    appointment_time: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
