from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.user import User
from app.models.challenge import Challenge
from app.models.submission import Submission
from app.schemas.submission import (
    SubmissionCreate,
    SubmissionResponse
)
from app.utils.security import get_current_user
from app.services.grading_service import grading_service

router = APIRouter()


@router.post("/", response_model=SubmissionResponse)
async def create_submission(
    submission_data: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit a solution to a challenge
    """
    # Get the challenge
    challenge = db.query(Challenge).filter(
        Challenge.id == submission_data.challenge_id,
        Challenge.is_active == True
    ).first()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Check if user already submitted
    existing = db.query(Submission).filter(
        Submission.challenge_id == submission_data.challenge_id,
        Submission.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="You have already submitted this challenge. Each challenge can only be attempted once."
        )
    
    # Grade the submission based on challenge type
    grading_result = None
    
    if challenge.category == "comprehension":
        if not submission_data.explanation:
            raise HTTPException(status_code=400, detail="Explanation is required for comprehension challenges")
        grading_result = await grading_service.grade_comprehension(
            challenge, 
            submission_data.explanation
        )
    
    elif challenge.category == "debugging":
        if not submission_data.code:
            raise HTTPException(status_code=400, detail="Code is required for debugging challenges")
        # For now, simple grading - in production you'd run test cases
        grading_result = {
            "score": 75,
            "max_score": 100,
            "is_correct": True,
            "feedback": "Code submitted successfully! Automated testing will be added in a future update.",
            "grading_details": {}
        }
    
    elif challenge.category == "security" or challenge.category == "ai_review":
        if not submission_data.explanation:
            raise HTTPException(status_code=400, detail="Review is required for this challenge type")
        grading_result = await grading_service.grade_ai_review(
            challenge,
            submission_data.explanation
        )
    
    else:
        grading_result = {
            "score": 50,
            "max_score": 100,
            "is_correct": False,
            "feedback": "Submission received. Manual grading required.",
            "grading_details": {}
        }
    
    # Create submission record
    submission = Submission(
        challenge_id=submission_data.challenge_id,
        user_id=current_user.id,
        code=submission_data.code,
        explanation=submission_data.explanation,
        score=grading_result["score"],
        max_score=grading_result["max_score"],
        is_correct=grading_result["is_correct"],
        feedback=grading_result["feedback"],
        grading_details=grading_result.get("grading_details")
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return submission


@router.get("/", response_model=List[SubmissionResponse])
async def list_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all submissions for the current user
    """
    submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).order_by(Submission.submitted_at.desc()).all()
    
    return submissions


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific submission
    """
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return submission