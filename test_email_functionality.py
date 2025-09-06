#!/usr/bin/env python3
"""
Test script for email functionality
Tests sending user credentials and letter attachments
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from send_mail import send_email, send_user_credentials_email

def test_basic_email():
    """Test basic email sending without attachment"""
    load_dotenv()
    
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = os.getenv("RECIPIENT_EMAIL")
    
    if not all([sender_email, sender_password, recipient_email]):
        print("Error: Missing email configuration in .env file")
        return False
    
    print("Testing basic email sending...")
    
    subject = "Test Email - Basic Functionality"
    body = """This is a test email to verify basic email functionality.

If you receive this email, the basic email sending is working correctly.

Best regards,
Test System"""
    
    success = send_email(sender_email, sender_password, recipient_email, subject, body)
    
    if success:
        print("✅ Basic email test passed!")
        return True
    else:
        print("❌ Basic email test failed!")
        return False

def test_credentials_email():
    """Test sending user credentials email"""
    load_dotenv()
    
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = os.getenv("RECIPIENT_EMAIL")
    
    if not all([sender_email, sender_password, recipient_email]):
        print("Error: Missing email configuration in .env file")
        return False
    
    print("Testing user credentials email...")
    
    # Test data
    username = "testuser123"
    password = "testpass456"
    full_name = "Test User"
    
    success = send_user_credentials_email(
        sender_email,
        sender_password,
        recipient_email,
        username,
        password,
        full_name
    )
    
    if success:
        print("✅ User credentials email test passed!")
        return True
    else:
        print("❌ User credentials email test failed!")
        return False

def test_email_with_attachment():
    """Test sending email with PDF attachment (if PDF exists)"""
    load_dotenv()
    
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    recipient_email = os.getenv("RECIPIENT_EMAIL")
    
    if not all([sender_email, sender_password, recipient_email]):
        print("Error: Missing email configuration in .env file")
        return False
    
    # Check if there are any PDFs in generated_letters directory
    pdf_path = None
    if os.path.exists("generated_letters"):
        for file in os.listdir("generated_letters"):
            if file.endswith(".pdf"):
                pdf_path = os.path.join("generated_letters", file)
                break
    
    if not pdf_path:
        print("⚠️  No PDF files found in generated_letters directory. Skipping attachment test.")
        return True
    
    print(f"Testing email with PDF attachment: {pdf_path}")
    
    subject = "Test Email - With PDF Attachment"
    body = """This is a test email with a PDF attachment.

If you receive this email with a PDF attachment, the email attachment functionality is working correctly.

Best regards,
Test System"""
    
    success = send_email(sender_email, sender_password, recipient_email, subject, body, pdf_path)
    
    if success:
        print("✅ Email with attachment test passed!")
        return True
    else:
        print("❌ Email with attachment test failed!")
        return False

def main():
    """Run all email tests"""
    print("🧪 Starting Email Functionality Tests")
    print("=" * 50)
    
    tests = [
        ("Basic Email", test_basic_email),
        ("User Credentials Email", test_credentials_email),
        ("Email with Attachment", test_email_with_attachment)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📧 Running {test_name} test...")
        try:
            if test_func():
                passed += 1
            else:
                print(f"Test {test_name} failed!")
        except Exception as e:
            print(f"❌ Test {test_name} failed with error: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All email functionality tests passed!")
        return True
    else:
        print("⚠️  Some tests failed. Please check the configuration and try again.")
        return False

if __name__ == "__main__":
    main()
