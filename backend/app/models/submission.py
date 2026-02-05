from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Solution content
    code = Column(Text)  # For debugging challenges
    explanation = Column(Text)  # For comprehension/review challenges
    video_url = Column(String(500))  # Verification video
    
    # Grading
    score = Column(Numeric(5, 2))
    max_score = Column(Numeric(5, 2))
    is_correct = Column(Boolean, default=False)
    feedback = Column(Text)  # AI-generated feedback
    
    # Detailed results (JSON format)
    test_results = Column(JSONB)  # For debugging challenges
    grading_details = Column(JSONB)  # Detailed scoring breakdown
    
    # Metadata
    time_taken = Column(Integer)  # in seconds
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    challenge = relationship("Challenge", back_populates="submissions")
    user = relationship("User", back_populates="submissions")
    
    def __repr__(self):
        return f"<Submission {self.id} - Score: {self.score}/{self.max_score}>"


class ChallengeAttempt(Base):
    """Tracks active challenge sessions"""
    __tablename__ = "challenge_attempts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    challenge_id = Column(UUID(as_uuid=True), ForeignKey("challenges.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    started_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_completed = Column(Boolean, default=False)
    
    # Relationships
    challenge = relationship("Challenge", back_populates="attempts")
    user = relationship("User", back_populates="challenge_attempts")
    
    def __repr__(self):
        return f"<Attempt {self.id}>"
