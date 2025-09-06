# Pydantic schemas for request/response validation
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    role: str = "user"
    employee_id: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    employee_id: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Letter schemas
class LetterBase(BaseModel):
    letter_type: str
    letter_data: Optional[dict] = None

class LetterCreate(LetterBase):
    user_id: int
    # Additional fields for letter generation
    position: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    manager: Optional[str] = None
    reason: Optional[str] = None

class LetterResponse(LetterBase):
    id: int
    user_id: int
    pdf_path: Optional[str] = None
    status: str
    generated_by: Optional[int] = None
    generated_at: datetime
    signed_document_path: Optional[str] = None
    uploaded_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Template schemas
class TemplateBase(BaseModel):
    letter_type: str
    template_name: str
    template_path: str

class TemplateCreate(TemplateBase):
    pass

class TemplateResponse(TemplateBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Email log schemas
class EmailLogBase(BaseModel):
    recipient_email: EmailStr
    subject: str
    body: Optional[str] = None

class EmailLogCreate(EmailLogBase):
    letter_id: Optional[int] = None

class EmailLogResponse(EmailLogBase):
    id: int
    letter_id: Optional[int] = None
    status: str
    sent_at: datetime
    
    class Config:
        from_attributes = True
