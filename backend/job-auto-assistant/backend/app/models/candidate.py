from sqlalchemy import Column, Integer, String, JSON
from app.core.database import Base

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    location = Column(String)
    skills = Column(JSON, default=list)
    target_roles = Column(JSON, default=list)
    github_username = Column(String, nullable=True)
    github_data = Column(JSON, default=dict)
