from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter()


@router.get("/")
async def get_leaderboard(
    db: AsyncSession = Depends(get_db)
):
    """Get global leaderboard"""
    
    # Placeholder - will implement materialized view query later
    return {
        "leaderboard": [],
        "message": "Leaderboard coming soon"
    }
