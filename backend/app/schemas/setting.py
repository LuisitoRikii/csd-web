from pydantic import BaseModel
from typing import Optional, Dict, Any, List


class SiteSettingBase(BaseModel):
    key: str
    value: Optional[str] = None
    value_type: str = "string"
    group: str = "general"
    label_en: Optional[str] = None
    label_es: Optional[str] = None


class SiteSettingCreate(SiteSettingBase):
    pass


class SiteSettingUpdate(BaseModel):
    value: Optional[str] = None


class SiteSettingResponse(SiteSettingBase):
    id: int

    class Config:
        from_attributes = True


class SiteSettingsBulkUpdate(BaseModel):
    settings: Dict[str, Any]
