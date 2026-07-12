from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.project import Project
from app.models.service import Service
from app.models.blog import BlogPost
from app.models.quote import Quote
from app.models.appointment import Appointment
from app.models.contact import ContactMessage
from app.models.user import User
from app.schemas.dashboard import DashboardStats
from app.middlewares.deps import require_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return DashboardStats(
        total_projects=db.query(func.count(Project.id)).scalar() or 0,
        total_services=db.query(func.count(Service.id)).scalar() or 0,
        total_blog_posts=db.query(func.count(BlogPost.id)).scalar() or 0,
        total_quotes=db.query(func.count(Quote.id)).scalar() or 0,
        pending_quotes=db.query(func.count(Quote.id)).filter(Quote.status == "pending").scalar() or 0,
        total_appointments=db.query(func.count(Appointment.id)).scalar() or 0,
        pending_appointments=db.query(func.count(Appointment.id)).filter(Appointment.status == "pending").scalar() or 0,
        total_messages=db.query(func.count(ContactMessage.id)).scalar() or 0,
        total_clients=db.query(func.count(User.id)).scalar() or 0,
    )


@router.get("/recent")
def get_recent_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    recent_quotes = db.query(Quote).order_by(Quote.created_at.desc()).limit(5).all()
    recent_appts = db.query(Appointment).order_by(Appointment.created_at.desc()).limit(5).all()
    recent_msgs = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(5).all()

    return {
        "quotes": [{"id": q.id, "name": f"{q.first_name} {q.last_name}", "status": q.status, "created_at": q.created_at.isoformat()} for q in recent_quotes],
        "appointments": [{"id": a.id, "name": f"{a.first_name} {a.last_name}", "date": a.appointment_date.isoformat(), "time": a.appointment_time, "status": a.status} for a in recent_appts],
        "messages": [{"id": m.id, "name": m.name, "subject": m.subject, "is_read": m.is_read, "created_at": m.created_at.isoformat()} for m in recent_msgs],
    }
