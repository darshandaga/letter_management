#!/usr/bin/env python3
"""
Test script for PDF generation functionality
Tests generating PDFs from HTML templates using weasyprint
"""

import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.utils.pdf_generator import PDFGenerator
from app.services.letter_generator import LetterGenerator

def test_pdf_generator():
    """Test basic PDF generation"""
    print("Testing PDF generation with weasyprint...")
    
    try:
        pdf_gen = PDFGenerator()
        
        # Test data
        test_data = {
            'user_id': 1,
            'full_name': 'John Doe',
            'username': 'john.doe',
            'email': 'john.doe@company.com',
            'employee_id': 'EMP001',
            'department': 'Engineering',
            'designation': 'Software Developer',
            'joining_date': 'January 15, 2024',
            'current_date': datetime.now().strftime("%B %d, %Y"),
            'letter_type': 'offer_letter'
        }
        
        # Check if offer letter template exists
        template_path = "app/templates/offer_letter.html"
        if not os.path.exists(template_path):
            print(f"❌ Template not found: {template_path}")
            return False
        
        # Generate PDF
        pdf_path = pdf_gen.generate_pdf(template_path, test_data)
        
        if pdf_path and os.path.exists(pdf_path):
            print(f"✅ PDF generated successfully: {pdf_path}")
            return True
        else:
            print("❌ PDF generation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error during PDF generation: {e}")
        return False

def test_letter_generator():
    """Test letter generator service"""
    print("Testing letter generator service...")
    
    try:
        letter_gen = LetterGenerator()
        
        # Test data
        user_data = {
            'user_id': 2,
            'full_name': 'Jane Smith',
            'username': 'jane.smith',
            'email': 'jane.smith@company.com',
            'employee_id': 'EMP002',
            'department': 'Marketing',
            'designation': 'Marketing Manager',
            'joining_date': 'February 01, 2024'
        }
        
        # Generate offer letter
        pdf_path = letter_gen.generate_offer_letter(user_data)
        
        if pdf_path and os.path.exists(pdf_path):
            print(f"✅ Letter generated successfully: {pdf_path}")
            return True
        else:
            print("❌ Letter generation failed")
            return False
            
    except Exception as e:
        print(f"❌ Error during letter generation: {e}")
        return False

def main():
    """Run all PDF generation tests"""
    print("🧪 Starting PDF Generation Tests")
    print("=" * 50)
    
    tests = [
        ("PDF Generator", test_pdf_generator),
        ("Letter Generator", test_letter_generator)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📄 Running {test_name} test...")
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
        print("🎉 All PDF generation tests passed!")
        
        # List generated PDFs
        if os.path.exists("generated_letters"):
            pdf_files = [f for f in os.listdir("generated_letters") if f.endswith('.pdf')]
            if pdf_files:
                print(f"\n📁 Generated PDF files:")
                for pdf_file in pdf_files:
                    print(f"  - {pdf_file}")
        
        return True
    else:
        print("⚠️  Some tests failed. Please check the configuration and try again.")
        return False

if __name__ == "__main__":
    main()
