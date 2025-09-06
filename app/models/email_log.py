# Email log model for tracking sent emails
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class EmailLog(Base):
    __tablename__ = "email_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    recipient_email = Column(String(100), nullable=False)
    subject = Column(String(255), nullable=False)
    body = Column(Text)
    letter_id = Column(Integer, ForeignKey("generated_letters.id"))
    status = Column(String(20), default="sent")
    sent_at = Column(DateTime, default=func.now())
    
    # Relationships
    letter = relationship("GeneratedLetter", back_populates="email_logs")
