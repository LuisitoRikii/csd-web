from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from app.database.session import get_db
from app.models.quote import Quote, QuoteImage
from app.schemas.quote import QuoteCreate, QuoteUpdate, QuoteResponse
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/quotes", tags=["Quotes"])


@router.post("", response_model=QuoteResponse, status_code=201)
def create_quote(payload: QuoteCreate, db: Session = Depends(get_db)):
    data = payload.model_dump()
    images = data.pop("images", []) or []
    quote = Quote(**data)
    db.add(quote)
    db.flush()

    for img_url in images:
        qimg = QuoteImage(quote_id=quote.id, image_url=img_url)
        db.add(qimg)

    db.commit()
    db.refresh(quote)
    return quote


@router.get("", response_model=list[QuoteResponse])
def list_quotes(
    status: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(Quote)
    if status:
        query = query.filter(Quote.status == status)
    if search:
        query = query.filter(
            or_(
                Quote.first_name.ilike(f"%{search}%"),
                Quote.last_name.ilike(f"%{search}%"),
                Quote.email.ilike(f"%{search}%"),
            )
        )
    return query.order_by(Quote.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{quote_id}", response_model=QuoteResponse)
def get_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote


@router.put("/{quote_id}", response_model=QuoteResponse)
def update_quote(
    quote_id: int,
    payload: QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Quote not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(quote, field, value)

    db.commit()
    db.refresh(quote)
    return quote


@router.delete("/{quote_id}", status_code=204)
def delete_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Quote not found")
    db.delete(quote)
    db.commit()
    return None
