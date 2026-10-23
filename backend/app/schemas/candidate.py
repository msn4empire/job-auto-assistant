from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class CandidateProfileBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    location: str
    skills: List[str] = []
    target_roles: List[str] = []
    github_username: Optional[str] = None
    github_data: Optional[Dict[str, Any]] = {}

class CandidateProfileCreate(CandidateProfileBase):
    pass

class CandidateProfileResponse(CandidateProfileBase):
    id: int

    class Config:
        from_attributes = True
