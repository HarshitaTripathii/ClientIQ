from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr


class ProjectCreate(BaseModel):
    client_name: str
    industry: str
    business_goal: str
    project_type: str
    user_email: EmailStr | None = None


class ProjectUpdateInsights(BaseModel):
    insights: dict[str, Any]


class ProjectResponse(BaseModel):
    id: int
    client_name: str
    industry: str
    business_goal: str
    project_type: str
    user_email: str | None
    notes_path: str | None
    data_path: str | None
    analysis_json: str | None
    insights_json: str | None
    proposal_path: str | None
    ppt_path: str | None
    automation_status: str | None
    created_at: datetime

    class Config:
        from_attributes = True

