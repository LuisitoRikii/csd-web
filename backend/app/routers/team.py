from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.team import TeamMember
from app.schemas.team import (
    TeamMemberCreate,
    TeamMemberUpdate,
    TeamMemberResponse,
)
from app.middlewares.deps import require_admin
from app.models.user import User

router = APIRouter(prefix="/team", tags=["Team"])


@router.get("", response_model=list[TeamMemberResponse])
def list_team_members(
    active_only: bool = False,
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(TeamMember)
    if active_only:
        query = query.filter(TeamMember.is_active == True)
    return query.order_by(TeamMember.order.asc(), TeamMember.id.asc()).limit(limit).all()


@router.post("", response_model=TeamMemberResponse, status_code=201)
def create_team_member(
    payload: TeamMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    member = TeamMember(**payload.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.put("/{member_id}", response_model=TeamMemberResponse)
def update_team_member(
    member_id: int,
    payload: TeamMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}", status_code=204)
def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(member)
    db.commit()
    return None