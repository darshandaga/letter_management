# Email Functionality Testing Guide

## ✅ Prerequisites Completed
- ✅ Email functionality implemented
- ✅ PDF generation working with weasyprint
- ✅ Backend server running on http://localhost:8000
- ✅ All tests passing (email + PDF generation)

## 🚀 Next Steps to Test Full Workflow

### 1. Start the Frontend
Open a new terminal and run:
```bash
cd frontend
npm start
```
This will start the React frontend on http://localhost:3000

### 2. Test Through Admin Dashboard

#### Step A: Login as Admin
1. Go to http://localhost:3000
2. Login with admin credentials:
   - Username: `admin`
   - Password: `admin123`

#### Step B: Create a User with Email
1. Click "Add User" in the admin dashboard
2. Fill in the form with a **real email address you can check**:
   ```
   Username: testuser1
   Email: your-real-email@gmail.com  # Use your actual email
   Password: testpass123
   Full Name: Test User One
   Role: employee
   Employee ID: EMP001
   Department: Engineering
   Designation: Software Developer
   Joining Date: 2024-01-15
   ```
3. **Important**: Make sure "Send Email" is checked
4. **Optional**: Select "Generate Welcome Letter" dropdown and choose "offer_letter"
5. Click "Create User"

#### Expected Results:
- ✅ User created in database
- ✅ Email sent to the user with credentials
- ✅ If welcome letter selected, PDF attached to email
- ✅ Email logged in database

#### Step C: Generate Letter for Existing User
1. Click "Generate Letter" in the admin dashboard
2. Select the user you just created
3. Choose letter type (e.g., "confirmation_letter")
4. Add any additional data if needed
5. **Important**: Make sure "Send Email" is checked
6. Click "Generate Letter"

#### Expected Results:
- ✅ PDF letter generated
- ✅ Email sent to user with PDF attachment
- ✅ Letter status updated to "sent"
- ✅ Email logged in database

### 3. Verify Email Delivery

Check your email inbox for:

#### User Credentials Email:
```
Subject: Welcome to the Organization - Your Account Details

Dear Test User One,

Welcome to our organization! Your account has been created successfully.

Your login credentials are:
Username: testuser1
Password: testpass123

Please keep these credentials secure and change your password after your first login.

You can access the system at: [Your System URL]

If you have any questions or need assistance, please don't hesitate to contact the HR department.

Best regards,
HR Team
```

#### Letter Notification Email:
```
Subject: Your Confirmation Letter Letter

Dear User,

Please find attached your Confirmation Letter letter.

If you have any questions, please contact the HR department.

Best regards,
HR Team
```

### 4. API Testing (Alternative Method)

If you prefer to test via API directly, use these curl commands:

#### Create User with Welcome Letter:
```bash
# First, get admin token
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"

# Use the returned access_token in the next request
curl -X POST "http://localhost:8000/admin/users?send_email=true&generate_welcome_letter=offer_letter" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apiuser1",
    "email": "your-email@gmail.com",
    "password": "apipass123",
    "full_name": "API Test User",
    "role": "employee",
    "employee_id": "EMP002",
    "department": "Marketing",
    "designation": "Marketing Manager",
    "joining_date": "2024-02-01"
  }'
```

#### Generate Letter:
```bash
curl -X POST "http://localhost:8000/admin/letters/generate?send_email=true" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "letter_type": "confirmation_letter",
    "letter_data": {
      "confirmation_date": "2024-02-15"
    }
  }'
```

### 5. Verify Generated Files

Check the `generated_letters/` directory for PDF files:
```bash
ls -la generated_letters/
```

You should see files like:
- `offer_letter_1_20250906_105914.pdf`
- `confirmation_letter_1_20250906_110015.pdf`

### 6. Check Database Logs

You can verify email logs in the database by checking the admin dashboard or using the API:
```bash
curl -X GET "http://localhost:8000/admin/stats" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔍 Troubleshooting

### Email Not Received:
1. Check spam/junk folder
2. Verify email address is correct
3. Check backend console for error messages
4. Verify Gmail app password in `.env` file

### PDF Not Generated:
1. Check `generated_letters/` directory exists
2. Verify weasyprint dependencies installed
3. Check HTML templates exist in `app/templates/`

### Server Errors:
1. Check backend console for detailed error messages
2. Verify database connection
3. Check all dependencies installed

## 📊 Success Criteria

The email functionality is working correctly if:

✅ **User Creation Email:**
- User receives email with username/password
- Optional welcome letter PDF attached
- Email logged in database

✅ **Letter Generation Email:**
- PDF letter generated successfully
- User receives email with PDF attachment
- Letter status updated to "sent"
- Email logged in database

✅ **Database Integration:**
- All emails logged with status
- Letter records created with PDF paths
- User data properly stored

✅ **Error Handling:**
- Graceful handling of email failures
- Proper error messages in console
- System continues working if email fails

## 🎯 Test Scenarios

### Scenario 1: New Employee Onboarding
1. Create user with offer letter
2. User receives credentials + offer letter
3. Generate appointment letter
4. User receives appointment letter
5. Generate confirmation letter after probation

### Scenario 2: Bulk Operations
1. Create multiple users
2. Generate letters for multiple users
3. Verify all emails sent correctly

### Scenario 3: Error Handling
1. Try with invalid email address
2. Try without internet connection
3. Verify system handles errors gracefully

## 📝 Notes

- Use real email addresses for testing
- Check both inbox and spam folders
- PDF attachments should be properly formatted
- All operations should be logged in database
- System should work even if email fails

This completes the comprehensive email functionality testing guide!
