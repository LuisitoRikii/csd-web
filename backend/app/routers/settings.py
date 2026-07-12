from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.setting import SiteSettings
from app.schemas.setting import SiteSettingCreate, SiteSettingUpdate, SiteSettingResponse, SiteSettingsBulkUpdate
from app.middlewares.deps import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/public", response_model=dict)
def get_public_settings(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).all()
    return {s.key: s.value for s in settings}


@router.get("/grouped", response_model=dict)
def get_grouped(db: Session = Depends(get_db)):
    settings = db.query(SiteSettings).all()
    result = {}
    for s in settings:
        g = s.group or "general"
        if g not in result:
            result[g] = []
        result[g].append({
            "id": s.id,
            "key": s.key,
            "value": s.value,
            "value_type": s.value_type,
            "label_en": s.label_en,
            "label_es": s.label_es,
            "group": s.group,
        })
    return result


@router.get("", response_model=List[SiteSettingResponse])
def list_settings(
    group: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(SiteSettings)
    if group:
        query = query.filter(SiteSettings.group == group)
    return query.order_by(SiteSettings.group.asc(), SiteSettings.id.asc()).all()


@router.post("", response_model=SiteSettingResponse, status_code=201)
def create_setting(
    payload: SiteSettingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    existing = db.query(SiteSettings).filter(SiteSettings.key == payload.key).first()
    if existing:
        raise HTTPException(status_code=400, detail="Key already exists")
    setting = SiteSettings(**payload.model_dump())
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


@router.put("/bulk")
def bulk_update(
    payload: SiteSettingsBulkUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    for key, value in payload.settings.items():
        s = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if s:
            s.value = str(value) if value is not None else None
    db.commit()
    return {"success": True}


@router.put("/{setting_id}", response_model=SiteSettingResponse)
def update_setting(
    setting_id: int,
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    setting = db.query(SiteSettings).filter(SiteSettings.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(setting, field, value)

    db.commit()
    db.refresh(setting)
    return setting


@router.delete("/{setting_id}", status_code=204)
def delete_setting(
    setting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    setting = db.query(SiteSettings).filter(SiteSettings.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    db.delete(setting)
    db.commit()
    return None
