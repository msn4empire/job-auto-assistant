from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.candidate import CandidateProfile
from app.services.ai_service import generate_tailored_resume
import pdfplumber
import io

router = APIRouter()

@router.post("/generate")
async def generate_resume(
    description: str = Form(...),
    base_resume: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    profile = db.query(CandidateProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please save your master profile first.")
    
    base_resume_text = ""
    if base_resume and base_resume.filename.endswith('.pdf'):
        try:
            content = await base_resume.read()
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                base_resume_text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
        except Exception as e:
            print(f"Error reading PDF: {e}")
    
    try:
        resume_markdown = generate_tailored_resume(profile, description, base_resume_text)
        return {"resume": resume_markdown}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
