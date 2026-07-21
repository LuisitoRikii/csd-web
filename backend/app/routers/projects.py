from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.models.project import Project, ProjectImage
from app.models.category import Category
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
def list_projects(
    category: Optional[str] = None,
    category_id: Optional[int] = None,
    featured: Optional[bool] = None,
    home_videos: Optional[bool] = None,
    home_before_after: Optional[bool] = None,
    has_before_after: Optional[bool] = None,
    has_video: Optional[bool] = None,
    published_only: bool = True,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Project)

    if published_only:
        query = query.filter(Project.is_published == True)

    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            query = query.filter(Project.category_id == cat.id)

    if category_id:
        query = query.filter(Project.category_id == category_id)

    if featured is not None:
        query = query.filter(Project.is_featured == featured)

    if home_videos is not None:
        query = query.filter(Project.show_on_home_videos == home_videos)
        if home_videos:
            query = query.filter(Project.video_url.isnot(None), Project.video_url != "")

    if home_before_after is not None:
        query = query.filter(Project.show_on_home_before_after == home_before_after)
        if home_before_after:
            query = query.filter(
                Project.before_image.isnot(None), Project.before_image != "",
                Project.after_image.isnot(None), Project.after_image != "",
            )

    if has_before_after:
        query = query.filter(
            Project.before_image.isnot(None), Project.before_image != "",
            Project.after_image.isnot(None), Project.after_image != "",
        )

    if has_video:
        query = query.filter(Project.video_url.isnot(None), Project.video_url != "")

    order_columns = [Project.order.asc(), Project.created_at.desc()]
    if home_videos:
        order_columns = [Project.home_videos_order.asc(), Project.created_at.desc()]
    elif home_before_after:
        order_columns = [Project.home_before_after_order.asc(), Project.created_at.desc()]

    projects = query.order_by(*order_columns).offset(skip).limit(limit).all()
    return projects


@router.get("/{slug_or_id}", response_model=ProjectResponse)
def get_project(slug_or_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.slug == slug_or_id).first()
    if not project:
        try:
            pid = int(slug_or_id)
            project = db.query(Project).filter(Project.id == pid).first()
        except ValueError:
            pass
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.view_count += 1
    db.commit()
    db.refresh(project)
    return project


@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    data = payload.model_dump()
    images = data.pop("images", []) or []
    project = Project(**data)
    db.add(project)
    db.flush()

    for idx, img_url in enumerate(images):
        img = ProjectImage(project_id=project.id, image_url=img_url, order=idx)
        db.add(img)

    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    data = payload.model_dump(exclude_unset=True)
    images = data.pop("images", None)
    for field, value in data.items():
        setattr(project, field, value)

    if images is not None:
        existing_images = {image.image_url: image for image in project.images}
        retained_urls = set()
        for idx, image_url in enumerate(images):
            retained_urls.add(image_url)
            existing = existing_images.get(image_url)
            if existing:
                existing.order = idx
            else:
                db.add(ProjectImage(project_id=project.id, image_url=image_url, order=idx))
        for image_url, image in existing_images.items():
            if image_url not in retained_urls:
                db.delete(image)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


@router.post("/{project_id}/images", response_model=ProjectResponse)
def add_project_image(
    project_id: int,
    image_url: str,
    alt_text: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    last_order = len(project.images)
    img = ProjectImage(project_id=project.id, image_url=image_url, alt_text=alt_text, order=last_order)
    db.add(img)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}/images/{image_id}", status_code=204)
def remove_project_image(
    project_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    img = db.query(ProjectImage).filter(
        ProjectImage.project_id == project_id,
        ProjectImage.id == image_id,
    ).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(img)
    db.commit()
    return None
