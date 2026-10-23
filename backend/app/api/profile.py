from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.candidate import CandidateProfile
from app.schemas.candidate import CandidateProfileCreate, CandidateProfileResponse
from app.services.github_service import fetch_github_profile

router = APIRouter()

@router.post("/", response_model=CandidateProfileResponse)
def create_or_update_profile(profile: CandidateProfileCreate, db: Session = Depends(get_db)):
    db_profile = db.query(CandidateProfile).first()
    if db_profile:
        for key, value in profile.model_dump().items():
            setattr(db_profile, key, value)
    else:
        db_profile = CandidateProfile(**profile.model_dump())
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/", response_model=CandidateProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    db_profile = db.query(CandidateProfile).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return db_profile

@router.post("/github/sync", response_model=CandidateProfileResponse)
async def sync_github_data(db: Session = Depends(get_db)):
    db_profile = db.query(CandidateProfile).first()
    if not db_profile or not db_profile.github_username:
        raise HTTPException(status_code=400, detail="Profile or GitHub username missing.")
    
    github_stats = await fetch_github_profile(db_profile.github_username)
    db_profile.github_data = github_stats
    db.commit()
    db.refresh(db_profile)
    return db_profile
