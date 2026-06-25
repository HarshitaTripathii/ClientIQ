from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from .database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100), nullable=False)
    industry = Column(String(100), nullable=False)
    business_goal = Column(Text, nullable=False)
    project_type = Column(String(100), nullable=False)
    user_email = Column(String(120), nullable=True)

    notes_path = Column(String(255), nullable=True)
    data_path = Column(String(255), nullable=True)

    analysis_json = Column(Text, nullable=True)
    insights_json = Column(Text, nullable=True)

    proposal_path = Column(String(255), nullable=True)
    ppt_path = Column(String(255), nullable=True)
    automation_status = Column(String(100), default="Not triggered")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

