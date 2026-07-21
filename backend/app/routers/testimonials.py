from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialUpdate,
    TestimonialResponse,
)
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


@router.get("", response_model=list[TestimonialResponse])
def list_testimonials(
    active_only: bool = False,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(Testimonial)
    if active_only:
        query = query.filter(Testimonial.is_active == True)
    return query.order_by(Testimonial.order.asc(), Testimonial.created_at.desc()).limit(limit).all()


@router.post("", response_model=TestimonialResponse, status_code=201)
def create_testimonial(
    payload: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    testimonial = Testimonial(**payload.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: int,
    payload: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/{testimonial_id}", status_code=204)
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(testimonial)
    db.commit()
    return None