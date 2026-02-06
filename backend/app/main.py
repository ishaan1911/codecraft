from fastapi import FastAPI
from app.api import auth, challenges, submissions
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db

# Import routers
from app.api import auth
# from app.api import challenges, submissions, profile

app = FastAPI(
    title="CodeCraft API",
    description="Engineering Skills Verification Platform",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("🚀 CodeCraft API is starting up...")
    print(f"📝 Environment: {settings.ENVIRONMENT}")
    print(f"🔧 Debug mode: {settings.DEBUG}")
    print(f"🌐 CORS Allowed Origins: {settings.allowed_origins_list}")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("👋 CodeCraft API is shutting down...")


@app.get("/")
async def root():
    """API health check"""
    return {
        "message": "CodeCraft API",
        "version": "1.0.0",
        "status": "running",
        "environment": settings.ENVIRONMENT
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "cache": "connected"
    }


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(challenges.router, prefix="/api/challenges", tags=["Challenges"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
app.include_router(challenges.router, prefix="/api/challenges", tags=["Challenges"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
# app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
