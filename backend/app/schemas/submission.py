from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class SubmissionBase(BaseModel):
    """Base submission schema"""
    challenge_id: UUID
    code: Optional[str] = None
    explanation: Optional[str] = None


class SubmissionCreate(SubmissionBase):
    """Schema for creating a submission"""
    pass


class SubmissionResponse(BaseModel):
    """Schema for submission response"""
    id: UUID
    challenge_id: UUID
    user_id: UUID
    code: Optional[str] = None
    explanation: Optional[str] = None
    video_url: Optional[str] = None
    score: Optional[Decimal] = None
    max_score: Optional[Decimal] = None
    is_correct: bool
    feedback: Optional[str] = None
    test_results: Optional[Dict[str, Any]] = None
    grading_details: Optional[Dict[str, Any]] = None
    time_taken: Optional[int] = None
    submitted_at: datetime
    
    class Config:
        from_attributes = True


class SubmissionListItem(BaseModel):
    """Lightweight submission for list view"""
    id: UUID
    challenge_id: UUID
    score: Optional[Decimal] = None
    max_score: Optional[Decimal] = None
    is_correct: bool
    submitted_at: datetime
    
    class Config:
        from_attributes = True


class GradingResult(BaseModel):
    """Result of grading a submission"""
    score: Decimal = Field(..., ge=0, le=100)
    max_score: Decimal = 100
    is_correct: bool
    feedback: str
    grading_details: Optional[Dict[str, Any]] = None


class TestResult(BaseModel):
    """Result of a single test case"""
    test_case_id: int
    passed: bool
    expected_output: Any
    actual_output: Any
    error_message: Optional[str] = None


class CodeExecutionRequest(BaseModel):
    """Request for code execution"""
    code: str
    language: str
    test_cases: list


class CodeExecutionResult(BaseModel):
    """Result of code execution"""
    success: bool
    output: Optional[str] = None
    error: Optional[str] = None
    test_results: Optional[list[TestResult]] = None
    execution_time_ms: Optional[int] = None
