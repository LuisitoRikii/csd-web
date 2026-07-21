from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title_en = Column(String, nullable=False)
    title_es = Column(String, nullable=False)
    description_en = Column(Text, nullable=False)
    description_es = Column(Text, nullable=False)
    long_description_en = Column(Text, nullable=True)
    long_description_es = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    location = Column(String, nullable=True)
    client = Column(String, nullable=True)
    cover_image = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    before_image = Column(String, nullable=True)
    after_image = Column(String, nullable=True)
    services_used = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    year = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    order = Column(Integer, default=0)
    show_on_home_videos = Column(Boolean, default=False)
    home_videos_order = Column(Integer, default=0)
    show_on_home_before_after = Column(Boolean, default=False)
    home_before_after_order = Column(Integer, default=0)
    home_before_after_tag = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan", order_by="ProjectImage.order")
    category = relationship("Category")


class ProjectImage(Base):
    __tablename__ = "project_images"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    alt_text = Column(String, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    project = relationship("Project", back_populates="images")


class ProjectVideo(Base):
    __tablename__ = "project_videos"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    video_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    title = Column(String, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
