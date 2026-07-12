from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from datetime import datetime
from app.database.session import get_db
from app.models.blog import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostUpdate, BlogPostResponse
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/blog", tags=["Blog"])


@router.get("", response_model=list[BlogPostResponse])
def list_posts(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    published_only: bool = True,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(BlogPost)
    if published_only:
        query = query.filter(BlogPost.is_published == True)
    if category:
        query = query.filter(BlogPost.category == category)
    if featured is not None:
        query = query.filter(BlogPost.is_featured == featured)
    if search:
        query = query.filter(
            or_(
                BlogPost.title_en.ilike(f"%{search}%"),
                BlogPost.title_es.ilike(f"%{search}%"),
                BlogPost.excerpt_en.ilike(f"%{search}%"),
            )
        )
    return query.order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{slug_or_id}", response_model=BlogPostResponse)
def get_post(slug_or_id: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug_or_id).first()
    if not post:
        try:
            pid = int(slug_or_id)
            post = db.query(BlogPost).filter(BlogPost.id == pid).first()
        except ValueError:
            pass
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.view_count += 1
    db.commit()
    db.refresh(post)
    return post


@router.post("", response_model=BlogPostResponse, status_code=201)
def create_post(
    payload: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    data = payload.model_dump()
    if data.get("is_published") and not data.get("published_at"):
        data["published_at"] = datetime.utcnow()
    post = BlogPost(**data)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=BlogPostResponse)
def update_post(
    post_id: int,
    payload: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    data = payload.model_dump(exclude_unset=True)
    if data.get("is_published") and not post.published_at:
        post.published_at = datetime.utcnow()

    for field, value in data.items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(post)
    db.commit()
    return None
