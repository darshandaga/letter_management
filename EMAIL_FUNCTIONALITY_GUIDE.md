# Email Functionality Guide

This guide explains the email functionality implemented in the letter management system, including sending user credentials and letter attachments.

## Overview

The system now supports:
1. **User Credential Emails**: Automatically send username and password to new users
2. **Letter Attachments**: Include generated PDF letters as email attachments
3. **Email Logging**: Track all sent emails in the database
4. **Error Handling**: Robust error handling for email failures

## Components

### 1. Enhanced Email Service (`send_mail.py`)

The core email functionality with support for PDF attachments:

```python
# Basic email sending
send_email(sender_email, sender_password, recipient_email, subject, body, attachment_path=None)

# User credentials email with optional letter attachment
send_user_credentials_email(sender_email, sender_password, recipient_email, 
                           username, password, full_name, letter_pdf_path=None)
```

**Features:**
- Gmail SMTP support with app passwords
- PDF attachment support
- HTML and plain text email bodies
- Error handling and logging

### 2. Email Service Class (`app/services/email_service.py`)

Database-integrated email service:

```python
class EmailService:
    def send_letter_notification(recipient_email, letter_type, pdf_path=None)
    def send_user_credentials(recipient_email, username, password, full_name, letter_pdf_path=None)
    def log_email(recipient_email, subject, status, letter_id=None)
```

**Features:**
- Database integration for email logging
- Automatic email status tracking
- Letter notification templates

### 3. PDF Generator (`app/utils/pdf_generator.py`)

Generates PDF letters from HTML templates:

```python
class PDFGenerator:
    def generate_pdf(html_template_path, data, output_filename=None)
    def generate_letter_pdf(letter_type, user_data, template_path=None)
```

**Features:**
- HTML to PDF conversion using pdfkit
- Jinja2 template rendering
- Automatic file naming and organization
- A4 page format with proper margins

### 4. Letter Generator (`app/services/letter_generator.py`)

High-level letter generation service:

```python
class LetterGenerator:
    def generate_offer_letter(user_data, template_path=None)
    def generate_appointment_letter(user_data, template_path=None)
    def generate_confirmation_letter(user_data, template_path=None)
    def generate_relieving_letter(user_data, template_path=None)
    def generate_letter(letter_type, user_data, template_path=None)
```

## API Endpoints

### 1. Create User with Email (`POST /admin/users`)

```json
{
  "username": "john.doe",
  "email": "john.doe@company.com",
  "password": "secure123",
  "full_name": "John Doe",
  "role": "employee",
  "employee_id": "EMP001",
  "department": "Engineering",
  "designation": "Software Developer",
  "joining_date": "2024-01-15"
}
```

**Query Parameters:**
- `send_email` (bool, default: true): Whether to send credentials email
- `generate_welcome_letter` (string, optional): Letter type to generate and attach

**Email Behavior:**
- Sends username and password to the user's email
- Optionally generates and attaches a welcome letter (offer_letter, appointment_letter, etc.)
- Logs the email in the database

### 2. Generate Letter with Email (`POST /admin/letters/generate`)

```json
{
  "user_id": 1,
  "letter_type": "offer_letter",
  "letter_data": {
    "salary": "75000",
    "start_date": "2024-02-01"
  }
}
```

**Query Parameters:**
- `send_email` (bool, default: true): Whether to send the letter via email

**Email Behavior:**
- Generates PDF letter from template
- Sends letter as email attachment to the user
- Updates letter status to "sent" if email succeeds

## Configuration

### Environment Variables (`.env`)

```env
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
RECIPIENT_EMAIL=test-recipient@gmail.com
```

**Important Notes:**
- Use Gmail App Passwords, not regular passwords
- Enable 2-factor authentication on Gmail account
- Generate app password from Google Account settings

### Dependencies (`requirements.txt`)

```
pdfkit          # PDF generation
Jinja2          # Template rendering
python-dotenv   # Environment variables
email-validator # Email validation
```

**System Requirements:**
- `wkhtmltopdf` must be installed for pdfkit to work
- Install on macOS: `brew install wkhtmltopdf`
- Install on Ubuntu: `sudo apt-get install wkhtmltopdf`

## Usage Examples

### 1. Create User with Welcome Letter

```bash
curl -X POST "http://localhost:8000/admin/users?send_email=true&generate_welcome_letter=offer_letter" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane.smith",
    "email": "jane.smith@company.com",
    "password": "secure456",
    "full_name": "Jane Smith",
    "role": "employee",
    "employee_id": "EMP002",
    "department": "Marketing",
    "designation": "Marketing Manager",
    "joining_date": "2024-02-01"
  }'
```

### 2. Generate and Email Letter

```bash
curl -X POST "http://localhost:8000/admin/letters/generate?send_email=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "letter_type": "confirmation_letter",
    "letter_data": {
      "confirmation_date": "2024-02-15",
      "probation_end_date": "2024-08-15"
    }
  }'
```

## Email Templates

### User Credentials Email

```
Subject: Welcome to the Organization - Your Account Details

Dear [Full Name],

Welcome to our organization! Your account has been created successfully.

Your login credentials are:
Username: [username]
Password: [password]

Please keep these credentials secure and change your password after your first login.

You can access the system at: [Your System URL]

If you have any questions or need assistance, please don't hesitate to contact the HR department.

Best regards,
HR Team
```

### Letter Notification Email

```
Subject: Your [Letter Type] Letter

Dear User,

Please find attached your [Letter Type] letter.

If you have any questions, please contact the HR department.

Best regards,
HR Team
```

## Testing

### Run Email Tests

```bash
python test_email_functionality.py
```

**Test Coverage:**
- Basic email sending
- User credentials email
- Email with PDF attachment
- Error handling

### Manual Testing

1. **Test Basic Email:**
   ```bash
   python send_mail.py
   ```

2. **Test with API:**
   - Create a new user via admin panel
   - Check email inbox for credentials
   - Generate a letter for the user
   - Check email inbox for letter attachment

## Troubleshooting

### Common Issues

1. **Email Not Sending:**
   - Check Gmail app password is correct
   - Verify 2-factor authentication is enabled
   - Ensure SMTP settings are correct (smtp.gmail.com:587)

2. **PDF Generation Fails:**
   - Install wkhtmltopdf: `brew install wkhtmltopdf` (macOS)
   - Check template file exists and is valid HTML
   - Verify Jinja2 template syntax

3. **Attachment Not Received:**
   - Check PDF file was generated successfully
   - Verify file path is correct
   - Check email client spam/junk folder

4. **Database Errors:**
   - Ensure email_logs table exists
   - Check database connection
   - Verify foreign key relationships

### Debug Mode

Enable debug logging by adding print statements or using Python logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Security Considerations

1. **Email Credentials:**
   - Store in environment variables, never in code
   - Use app passwords, not account passwords
   - Rotate passwords regularly

2. **PDF Files:**
   - Store in secure directory with proper permissions
   - Clean up old files periodically
   - Validate file paths to prevent directory traversal

3. **Email Content:**
   - Sanitize user input in email templates
   - Avoid including sensitive data in email bodies
   - Use secure email protocols (TLS/SSL)

## Future Enhancements

1. **Email Templates:**
   - HTML email templates with company branding
   - Customizable email templates per organization
   - Multi-language support

2. **Advanced Features:**
   - Email scheduling and queuing
   - Bulk email sending
   - Email delivery status tracking
   - Integration with other email providers (Outlook, etc.)

3. **Security:**
   - Email encryption
   - Digital signatures for PDFs
   - Audit logging for email activities
