from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from app.database.session import get_db
from app.models.project import Project
from app.models.service import Service, ServiceProject
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
        unread_messages=db.query(func.count(ContactMessage.id)).filter(ContactMessage.is_read == False).scalar() or 0,
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
        "quotes": [{"id": q.id, "name": f"{q.first_name} {q.last_name}", "email": q.email, "service_name": q.service_name, "status": q.status, "created_at": q.created_at.isoformat()} for q in recent_quotes],
        "appointments": [{"id": a.id, "name": f"{a.first_name} {a.last_name}", "date": a.appointment_date.isoformat() if a.appointment_date else None, "time": a.appointment_time, "status": a.status} for a in recent_appts],
        "messages": [{"id": m.id, "name": m.name, "subject": m.subject, "is_read": m.is_read, "created_at": m.created_at.isoformat()} for m in recent_msgs],
    }


@router.get("/charts")
def get_charts(
    days: int = Query(30, ge=7, le=365, description="Time window in days"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Time-series for the dashboard. Returns daily counts of quotes,
    appointments and messages for the last `days` days. Plus the most
    requested services (by quote count) for the same window."""
    cutoff = datetime.utcnow() - timedelta(days=days)

    def daily_buckets(model, ts_col):
        rows = (
            db.query(func.date(ts_col).label("d"), func.count(model.id))
            .filter(ts_col >= cutoff)
            .group_by("d")
            .order_by("d")
            .all()
        )
        return [{"date": str(d), "count": int(c)} for d, c in rows]

    quotes_by_day = daily_buckets(Quote, Quote.created_at)
    msgs_by_day = daily_buckets(ContactMessage, ContactMessage.created_at)
    appts_by_day = daily_buckets(Appointment, Appointment.created_at)

    # Top services by quote count in the window
    top_services_rows = (
        db.query(Quote.service_name, func.count(Quote.id).label("c"))
        .filter(Quote.created_at >= cutoff, Quote.service_name.isnot(None))
        .group_by(Quote.service_name)
        .order_by(func.count(Quote.id).desc())
        .limit(5)
        .all()
    )
    top_services = [{"name": n, "count": int(c)} for n, c in top_services_rows if n]

    # Status distribution
    quote_status_rows = (
        db.query(Quote.status, func.count(Quote.id))
        .group_by(Quote.status)
        .all()
    )
    quote_status = [{"status": s or "unknown", "count": int(c)} for s, c in quote_status_rows]

    return {
        "days": days,
        "quotes_by_day": quotes_by_day,
        "messages_by_day": msgs_by_day,
        "appointments_by_day": appts_by_day,
        "top_services": top_services,
        "quote_status": quote_status,
    }
