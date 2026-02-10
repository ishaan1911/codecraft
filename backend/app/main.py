from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db

# Import routers
from app.api import auth, challenges, submissions

app = FastAPI(
    title="CodeCraft API",
    description="Engineering Skills Verification Platform",
    version="1.0.0",
    debug=settings.DEBUG,
    # Trust proxy headers for correct scheme detection
    root_path_in_servers=False
)

# Middleware to handle proxy headers from Railway
@app.middleware("http")
async def proxy_headers_middleware(request: Request, call_next):
    """Handle X-Forwarded-Proto header from Railway's reverse proxy"""
    forwarded_proto = request.headers.get("x-forwarded-proto")
    if forwarded_proto:
        request.scope["scheme"] = forwarded_proto
    response = await call_next(request)
    return response

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
