from fastapi import FastAPI
from app.core.database import engine, Base
from app.api import profile

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Search Auto Assistant API")

app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "0.1.0"}
