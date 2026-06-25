from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Project
from .schemas import ProjectCreate, ProjectResponse, ProjectUpdateInsights
from .services.ai_service import generate_ai_insights
from .services.analysis_service import analyze_data_file, from_json, to_json
from .services.automation_service import trigger_n8n
from .services.document_service import create_powerpoint_deck, create_word_proposal
from .services.file_service import save_uploaded_file

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ClientIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_project_or_404(project_id: int, db: Session) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.get("/")
def health_check():
    return {"message": "ClientIQ backend is running"}


@app.post("/projects", response_model=ProjectResponse)
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**project_data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects", response_model=list[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.created_at.desc()).all()


@app.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    return get_project_or_404(project_id, db)


@app.post("/projects/{project_id}/upload-notes", response_model=ProjectResponse)
def upload_notes(project_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    project.notes_path = save_uploaded_file(project.id, file, "notes")
    db.commit()
    db.refresh(project)
    return project


@app.post("/projects/{project_id}/upload-data", response_model=ProjectResponse)
def upload_data(project_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    project.data_path = save_uploaded_file(project.id, file, "data")
    db.commit()
    db.refresh(project)
    return project


@app.post("/projects/{project_id}/analyze")
def analyze_project(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    analysis = analyze_data_file(project.data_path)
    insights = generate_ai_insights(project, analysis)

    project.analysis_json = to_json(analysis)
    project.insights_json = to_json(insights)
    db.commit()

    return {"analysis": analysis, "insights": insights}


@app.put("/projects/{project_id}/insights", response_model=ProjectResponse)
def update_insights(project_id: int, data: ProjectUpdateInsights, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    project.insights_json = to_json(data.insights)
    db.commit()
    db.refresh(project)
    return project


@app.post("/projects/{project_id}/generate-proposal", response_model=ProjectResponse)
def generate_proposal(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    if not project.insights_json:
        raise HTTPException(status_code=400, detail="Analyze the project before generating documents")

    project.proposal_path = create_word_proposal(project)
    db.commit()
    db.refresh(project)
    return project


@app.post("/projects/{project_id}/generate-ppt", response_model=ProjectResponse)
def generate_ppt(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    if not project.insights_json:
        raise HTTPException(status_code=400, detail="Analyze the project before generating documents")

    project.ppt_path = create_powerpoint_deck(project)
    db.commit()
    db.refresh(project)
    return project


@app.post("/projects/{project_id}/trigger-automation", response_model=ProjectResponse)
def trigger_automation(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    project.automation_status = trigger_n8n(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects/{project_id}/download/{file_type}")
def download_file(project_id: int, file_type: str, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)

    if file_type == "proposal":
        file_path = project.proposal_path
    elif file_type == "ppt":
        file_path = project.ppt_path
    else:
        raise HTTPException(status_code=400, detail="file_type must be proposal or ppt")

    if not file_path:
        raise HTTPException(status_code=404, detail="File has not been generated")

    return FileResponse(file_path, filename=file_path.split("\\")[-1].split("/")[-1])


@app.get("/projects/{project_id}/parsed")
def get_project_parsed(project_id: int, db: Session = Depends(get_db)):
    project = get_project_or_404(project_id, db)
    return {
        "project": ProjectResponse.model_validate(project),
        "analysis": from_json(project.analysis_json),
        "insights": from_json(project.insights_json),
    }

