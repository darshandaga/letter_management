# User model for authentication and profile
from sqlalchemy import Column, Integer, String, Date, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    employee_id = Column(String(20), unique=True, index=True)
    department = Column(String(50))
    designation = Column(String(50))
    joining_date = Column(Date)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    generated_letters = relationship("GeneratedLetter", foreign_keys="GeneratedLetter.user_id", back_populates="user")
    created_letters = relationship("GeneratedLetter", foreign_keys="GeneratedLetter.generated_by", back_populates="generator")
