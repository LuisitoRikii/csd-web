from pydantic import BaseModel
from typing import Optional


class DashboardStats(BaseModel):
    total_projects: int
    total_services: int
    total_blog_posts: int
    total_quotes: int
    pending_quotes: int
    total_appointments: int
    pending_appointments: int
    total_messages: int
    unread_messages: int = 0
    total_clients: int
