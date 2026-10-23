from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.candidate import CandidateProfile
from app.services.ai_service import generate_tailored_resume

router = APIRouter()

class JobDescription(BaseModel):
    description: str

@router.post("/generate")
def generate_resume(job: JobDescription, db: Session = Depends(get_db)):
    profile = db.query(CandidateProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please save your master profile first.")
    
    try:
        resume_markdown = generate_tailored_resume(profile, job.description)
        return {"resume": resume_markdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
