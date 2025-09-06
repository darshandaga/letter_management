# Letter model for generated letters
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class GeneratedLetter(Base):
    __tablename__ = "generated_letters"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    letter_type = Column(String(50), nullable=False)
    letter_data = Column(Text)  # JSON data as text
    pdf_path = Column(String(255))
    status = Column(String(20), default="generated")
    generated_by = Column(Integer, ForeignKey("users.id"))
    generated_at = Column(DateTime, default=func.now())
    signed_document_path = Column(String(255))
    uploaded_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="generated_letters")
    generator = relationship("User", foreign_keys=[generated_by], back_populates="created_letters")
    email_logs = relationship("EmailLog", back_populates="letter")
