# Admin routes for user management and letter generation
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.letter import GeneratedLetter
from app.models.template import LetterTemplate
from app.schemas import (
    UserResponse, UserCreate, UserUpdate,
    LetterResponse, LetterCreate,
    TemplateResponse, TemplateCreate
)
from app.auth import get_admin_user, get_password_hash
from app.services.email_service import EmailService
from app.services.letter_generator import LetterGenerator

router = APIRouter()

# User Management Endpoints
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.post("/users", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    send_email: bool = True,
    generate_welcome_letter: Optional[str] = None,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new user (admin only)"""
    # Check if user already exists
    db_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Store plain password for email before hashing
    plain_password = user.password
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name,
        role=user.role,
        employee_id=user.employee_id,
        department=user.department,
        designation=user.designation,
        joining_date=user.joining_date
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Send email with credentials and optional welcome letter
    if send_email:
        email_service = EmailService(db)
        letter_pdf_path = None
        
        # Generate welcome letter if requested
        if generate_welcome_letter:
            try:
                letter_generator = LetterGenerator()
                user_data = {
                    'user_id': db_user.id,
                    'full_name': db_user.full_name,
                    'username': db_user.username,
                    'email': db_user.email,
                    'employee_id': db_user.employee_id,
                    'department': db_user.department,
                    'designation': db_user.designation,
                    'joining_date': db_user.joining_date.strftime("%B %d, %Y") if db_user.joining_date else None
                }
                
                letter_pdf_path = letter_generator.generate_letter(generate_welcome_letter, user_data)
                
                # Create letter record in database
                if letter_pdf_path:
                    db_letter = GeneratedLetter(
                        user_id=db_user.id,
                        letter_type=generate_welcome_letter,
                        letter_data=user_data,
                        generated_by=current_user.id,
                        status="generated",
                        pdf_path=letter_pdf_path
                    )
                    db.add(db_letter)
                    db.commit()
                    
            except Exception as e:
                print(f"Error generating welcome letter: {e}")
        
        # Send credentials email
        try:
            email_success = email_service.send_user_credentials(
                db_user.email,
                db_user.username,
                plain_password,
                db_user.full_name,
                letter_pdf_path
            )
            
            if not email_success:
                print(f"Failed to send credentials email to {db_user.email}")
                
        except Exception as e:
            print(f"Error sending credentials email: {e}")
    
    return db_user

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get user by ID (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Letter Management Endpoints
@router.get("/letters", response_model=List[LetterResponse])
async def get_all_letters(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all generated letters (admin only)"""
    letters = db.query(GeneratedLetter).offset(skip).limit(limit).all()
    return letters

@router.post("/letters/generate", response_model=LetterResponse)
async def generate_letter(
    letter: LetterCreate,
    send_email: bool = True,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Generate a new letter (admin only)"""
    # Check if user exists
    user = db.query(User).filter(User.id == letter.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Generate PDF letter
    letter_pdf_path = None
    try:
        letter_generator = LetterGenerator()
        
        # Prepare user data for letter generation
        user_data = {
            'user_id': user.id,
            'full_name': user.full_name,
            'username': user.username,
            'email': user.email,
            'employee_id': user.employee_id,
            'department': user.department,
            'designation': user.designation,
            'joining_date': user.joining_date.strftime("%B %d, %Y") if user.joining_date else None
        }
        
        # Add any additional data from the request
        if letter.letter_data:
            user_data.update(letter.letter_data)
        
        # Override with specific fields from the request
        if letter.department:
            user_data['department'] = letter.department
        if letter.position:
            user_data['position'] = letter.position
        if letter.salary:
            user_data['salary'] = letter.salary
        if letter.start_date:
            user_data['start_date'] = letter.start_date
        if letter.manager:
            user_data['manager'] = letter.manager
        if letter.end_date:
            user_data['end_date'] = letter.end_date
        if letter.reason:
            user_data['reason'] = letter.reason
        
        # Generate the PDF
        letter_pdf_path = letter_generator.generate_letter(letter.letter_type, user_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating letter PDF: {str(e)}"
        )
    
    # Create letter record
    db_letter = GeneratedLetter(
        user_id=letter.user_id,
        letter_type=letter.letter_type,
        letter_data=letter.letter_data,
        generated_by=current_user.id,
        status="generated",
        pdf_path=letter_pdf_path
    )
    
    db.add(db_letter)
    db.commit()
    db.refresh(db_letter)
    
    # Send email with generated letter
    if send_email and letter_pdf_path:
        try:
            email_service = EmailService(db)
            email_success = email_service.send_letter_notification(
                user.email,
                letter.letter_type,
                letter_pdf_path
            )
            
            if email_success:
                # Update letter status to indicate it was emailed
                db_letter.status = "sent"
                db.commit()
            else:
                print(f"Failed to send letter email to {user.email}")
                
        except Exception as e:
            print(f"Error sending letter email: {e}")
    
    return db_letter

# Template Management Endpoints
@router.get("/templates", response_model=List[TemplateResponse])
async def get_templates(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get all letter templates (admin only)"""
    templates = db.query(LetterTemplate).all()
    return templates

@router.post("/templates", response_model=TemplateResponse)
async def create_template(
    template: TemplateCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new letter template (admin only)"""
    db_template = LetterTemplate(
        letter_type=template.letter_type,
        template_name=template.template_name,
        template_path=template.template_path,
        created_by=current_user.id
    )
    
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    
    return db_template

# Dashboard Statistics
@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics (admin only)"""
    total_users = db.query(User).count()
    total_letters = db.query(GeneratedLetter).count()
    total_templates = db.query(LetterTemplate).count()
    
    # Recent letters
    recent_letters = db.query(GeneratedLetter).order_by(
        GeneratedLetter.generated_at.desc()
    ).limit(5).all()
    
    return {
        "total_users": total_users,
        "total_letters": total_letters,
        "total_templates": total_templates,
        "recent_letters": recent_letters
    }
