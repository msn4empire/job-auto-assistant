from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import profile, resume

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Search Auto Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume Generation"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "0.1.0"}
