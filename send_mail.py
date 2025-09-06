import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os
from dotenv import load_dotenv

def send_email(sender_email, sender_password, recipient_email, subject, body, attachment_path=None):
    """
    Send email with optional PDF attachment
    
    Args:
        sender_email: Sender's email address
        sender_password: Sender's email password (app password for Gmail)
        recipient_email: Recipient's email address
        subject: Email subject
        body: Email body text
        attachment_path: Optional path to PDF file to attach
    """
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Add PDF attachment if provided
    if attachment_path and os.path.exists(attachment_path):
        with open(attachment_path, 'rb') as file:
            attach = MIMEApplication(file.read(), _subtype='pdf')
            attach.add_header('Content-Disposition', 'attachment', 
                            filename=os.path.basename(attachment_path))
            msg.attach(attach)

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
        print('Email sent successfully!')
        return True
    except Exception as e:
        print(f'Failed to send email: {e}')
        return False

def send_user_credentials_email(sender_email, sender_password, recipient_email, 
                               username, password, full_name, letter_pdf_path=None):
    """
    Send user credentials and welcome letter via email
    
    Args:
        sender_email: Admin's email address
        sender_password: Admin's email password
        recipient_email: New user's email address
        username: New user's username
        password: New user's password (plain text)
        full_name: New user's full name
        letter_pdf_path: Optional path to generated letter PDF
    """
    subject = "Welcome to the Organization - Your Account Details"
    
    body = f"""Dear {full_name},

Welcome to our organization! Your account has been created successfully.

Your login credentials are:
Username: {username}
Password: {password}

Please keep these credentials secure and change your password after your first login.

You can access the system at: [Your System URL]

If you have any questions or need assistance, please don't hesitate to contact the HR department.

Best regards,
HR Team"""

    return send_email(sender_email, sender_password, recipient_email, subject, body, letter_pdf_path)

if __name__ == "__main__":
    load_dotenv()
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = os.getenv("RECIPIENT_EMAIL")
    subject = "Test Email"
    body = "This is a test email sent from Python."
    send_email(sender_email, sender_password, recipient_email, subject, body)
