from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from app.models.challenge import ChallengeCategory, ChallengeDifficulty


class ChallengeBase(BaseModel):
    """Base challenge schema"""
    title: str = Field(..., min_length=5, max_length=255)
    category: ChallengeCategory
    difficulty: ChallengeDifficulty
    description: str
    code_snippet: Optional[str] = None
    language: Optional[str] = None
    time_limit: int = Field(..., gt=0, description="Time limit in minutes")
    points: int = Field(..., gt=0)


class ChallengeCreate(ChallengeBase):
    """Schema for creating a challenge"""
    test_cases: Optional[Dict[str, Any]] = None
    grading_criteria: Optional[Dict[str, Any]] = None


class ChallengeUpdate(BaseModel):
    """Schema for updating a challenge"""
    title: Optional[str] = None
    description: Optional[str] = None
    code_snippet: Optional[str] = None
    is_active: Optional[bool] = None


class ChallengeResponse(ChallengeBase):
    """Schema for challenge response"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


class ChallengeListItem(BaseModel):
    """Lightweight challenge for list view"""
    id: UUID
    title: str
    category: ChallengeCategory
    difficulty: ChallengeDifficulty
    time_limit: int
    points: int
    
    class Config:
        from_attributes = True


class ChallengeWithStats(ChallengeResponse):
    """Challenge with completion statistics"""
    total_attempts: int = 0
    success_rate: float = 0.0
    average_score: float = 0.0


class TestCase(BaseModel):
    """Test case for debugging challenges"""
    input: Any
    expected_output: Any
    description: Optional[str] = None


class ChallengeAttemptCreate(BaseModel):
    """Schema for starting a challenge attempt"""
    challenge_id: UUID


class ChallengeAttemptResponse(BaseModel):
    """Response when starting a challenge attempt"""
    id: UUID
    challenge_id: UUID
    started_at: datetime
    expires_at: datetime
    remaining_time_seconds: int
    
    class Config:
        from_attributes = True
