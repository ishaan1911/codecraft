from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.database import Base


class ChallengeCategory(str, enum.Enum):
    COMPREHENSION = "comprehension"
    DEBUGGING = "debugging"
    AI_REVIEW = "ai_review"
    DESIGN = "design"
    SECURITY = "security"


class ChallengeDifficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    category = Column(Enum(ChallengeCategory), nullable=False, index=True)
    difficulty = Column(Enum(ChallengeDifficulty), nullable=False, index=True)
    
    description = Column(Text, nullable=False)
    code_snippet = Column(Text)  # For comprehension/review challenges
    language = Column(String(50))
    
    # Test cases for debugging challenges (JSON format)
    test_cases = Column(JSONB)
    
    # Grading criteria (JSON format)
    grading_criteria = Column(JSONB)
    
    time_limit = Column(Integer, nullable=False)  # in minutes
    points = Column(Integer, nullable=False)
    
    created_by = Column(UUID(as_uuid=True))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    is_active = Column(Boolean, default=True)
    
    # Relationships
    submissions = relationship("Submission", back_populates="challenge")
    attempts = relationship("ChallengeAttempt", back_populates="challenge")
    
    def __repr__(self):
        return f"<Challenge {self.title} ({self.difficulty})>"
