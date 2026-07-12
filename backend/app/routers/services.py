from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=list[ServiceResponse])
def list_services(
    active_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(Service)
    if active_only:
        query = query.filter(Service.is_active == True)
    if featured_only:
        query = query.filter(Service.is_featured == True)
    return query.order_by(Service.order.asc(), Service.id.asc()).all()


@router.get("/{slug_or_id}", response_model=ServiceResponse)
def get_service(slug_or_id: str, db: Session = Depends(get_db)):
    service = db.query(Service).filter(Service.slug == slug_or_id).first()
    if not service:
        try:
            service_id = int(slug_or_id)
            service = db.query(Service).filter(Service.id == service_id).first()
        except ValueError:
            pass
    if not service:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.post("", response_model=ServiceResponse, status_code=201)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = Service(**payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Service not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=204)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return None
