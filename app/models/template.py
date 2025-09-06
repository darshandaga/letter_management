# Template model for letter templates
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class LetterTemplate(Base):
    __tablename__ = "letter_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    letter_type = Column(String(50), nullable=False)
    template_name = Column(String(100), nullable=False)
    template_path = Column(String(255), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    creator = relationship("User")
