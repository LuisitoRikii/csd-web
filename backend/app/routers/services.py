from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import Optional
from app.database.session import get_db
from app.models.service import Service, ServiceProject
from app.models.project import Project, ProjectImage
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
    ServiceGalleryProject,
    ProjectImageResponse,
)
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/services", tags=["Services"])


def _build_response(service: Service) -> ServiceResponse:
    projects = [link.project for link in sorted(service.project_links, key=lambda l: (l.order, l.id))]
    gallery = [
        ServiceGalleryProject(
            id=p.id,
            slug=p.slug,
            title_en=p.title_en,
            title_es=p.title_es,
            description_en=p.description_en,
            description_es=p.description_es,
            cover_image=p.cover_image,
            location=p.location,
            year=p.year,
            services_used=p.services_used,
            order=0,
            images=[
                ProjectImageResponse.model_validate(img)
                for img in sorted(p.images, key=lambda i: (i.order, i.id))
            ],
        )
        for p in projects
    ]
    return ServiceResponse.model_validate(
        {**{c.name: getattr(service, c.name) for c in service.__table__.columns}, "projects": gallery}
    )


@router.get("", response_model=list[ServiceResponse])
def list_services(
    active_only: bool = False,
    featured_only: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(Service).options(
        selectinload(Service.project_links).selectinload(ServiceProject.project).selectinload(Project.images)
    )
    if active_only:
        query = query.filter(Service.is_active == True)
    if featured_only:
        query = query.filter(Service.is_featured == True)
    services = query.order_by(Service.order.asc(), Service.id.asc()).all()
    return [_build_response(s) for s in services]


@router.get("/{slug_or_id}", response_model=ServiceResponse)
def get_service(slug_or_id: str, db: Session = Depends(get_db)):
    query = db.query(Service).options(
        selectinload(Service.project_links).selectinload(ServiceProject.project).selectinload(Project.images)
    )
    service = query.filter(Service.slug == slug_or_id).first()
    if not service:
        try:
            sid = int(slug_or_id)
            service = query.filter(Service.id == sid).first()
        except ValueError:
            pass
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return _build_response(service)


@router.post("", response_model=ServiceResponse, status_code=201)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    data = payload.model_dump(exclude={"project_ids"})
    service = Service(**data)
    db.add(service)
    db.flush()

    for idx, project_id in enumerate(payload.project_ids or []):
        db.add(ServiceProject(service_id=service.id, project_id=project_id, order=idx))

    db.commit()
    db.refresh(service)
    return _build_response(service)


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    data = payload.model_dump(exclude_unset=True)
    project_ids = data.pop("project_ids", None)

    for field, value in data.items():
        setattr(service, field, value)

    if project_ids is not None:
        db.query(ServiceProject).filter(ServiceProject.service_id == service.id).delete()
        for idx, project_id in enumerate(project_ids):
            db.add(ServiceProject(service_id=service.id, project_id=project_id, order=idx))

    db.commit()
    db.refresh(service)
    return _build_response(service)


@router.delete("/{service_id}", status_code=204)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return None


@router.put("/{service_id}/projects", response_model=ServiceResponse)
def set_service_projects(
    service_id: int,
    project_ids: list[int],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Replace the gallery of a service with the given project ids (ordered)."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    db.query(ServiceProject).filter(ServiceProject.service_id == service.id).delete()
    for idx, project_id in enumerate(project_ids):
        exists = db.query(Project).filter(Project.id == project_id).first()
        if exists:
            db.add(ServiceProject(service_id=service.id, project_id=project_id, order=idx))

    db.commit()
    db.refresh(service)
    return _build_response(service)
