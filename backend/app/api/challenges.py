from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models.challenge import Challenge, ChallengeCategory, ChallengeDifficulty
from app.schemas.challenge import (
    ChallengeResponse,
    ChallengeListItem,
    ChallengeCreate
)
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[ChallengeListItem])
async def list_challenges(
    category: Optional[ChallengeCategory] = None,
    difficulty: Optional[ChallengeDifficulty] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Get list of challenges with optional filters
    """
    query = db.query(Challenge).filter(Challenge.is_active == True)
    
    if category:
        query = query.filter(Challenge.category == category)
    
    if difficulty:
        query = query.filter(Challenge.difficulty == difficulty)
    
    challenges = query.offset(skip).limit(limit).all()
    return challenges


@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(
    challenge_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific challenge by ID
    """
    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id,
        Challenge.is_active == True
    ).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    return challenge


@router.post("/", response_model=ChallengeResponse)
async def create_challenge(
    challenge_data: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new challenge (for now, any authenticated user can create)
    In production, you'd restrict this to admins
    """
    challenge = Challenge(
        **challenge_data.dict(),
        created_by=current_user.id
    )
    
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    
    return challenge