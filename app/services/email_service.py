import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from send_mail import send_email, send_user_credentials_email
from app.models.email_log import EmailLog

load_dotenv()

class EmailService:
    def __init__(self, db: Session = None):
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_password = os.getenv("SENDER_PASSWORD")
        self.db = db
    
    def send_letter_notification(self, recipient_email, letter_type, pdf_path=None):
        """Send email notification with letter PDF attachment"""
        subject = f"Your {letter_type.replace('_', ' ').title()} Letter"
        body = f"""Dear User,

Please find attached your {letter_type.replace('_', ' ').title()} letter.

If you have any questions, please contact the HR department.

Best regards,
HR Team"""
        
        success = send_email(
            self.sender_email, 
            self.sender_password, 
            recipient_email, 
            subject, 
            body, 
            pdf_path
        )
        
        if self.db:
            self.log_email(recipient_email, subject, "sent" if success else "failed")
        
        return success
    
    def send_user_credentials(self, recipient_email, username, password, full_name, letter_pdf_path=None):
        """Send user credentials and welcome letter via email"""
        success = send_user_credentials_email(
            self.sender_email,
            self.sender_password,
            recipient_email,
            username,
            password,
            full_name,
            letter_pdf_path
        )
        
        if self.db:
            subject = "Welcome to the Organization - Your Account Details"
            self.log_email(recipient_email, subject, "sent" if success else "failed")
        
        return success
    
    def log_email(self, recipient_email, subject, status, letter_id=None):
        """Log email in database"""
        if not self.db:
            return
            
        email_log = EmailLog(
            recipient_email=recipient_email,
            subject=subject,
            status=status,
            letter_id=letter_id
        )
        
        self.db.add(email_log)
        self.db.commit()
        self.db.refresh(email_log)
        
        return email_log
