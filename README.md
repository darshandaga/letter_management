# Letter Management System

A comprehensive full-stack web application for managing and generating professional letters including offer letters, appointment letters, confirmation letters, and relieving letters. Built with FastAPI backend and React frontend.

## 🚀 Features

- **User Authentication & Authorization**: Secure JWT-based authentication system
- **Letter Generation**: Generate professional letters from customizable templates
- **Template Management**: Create, edit, and manage letter templates
- **User Management**: Admin dashboard for managing users and permissions
- **Email Integration**: Send generated letters via email automatically
- **PDF Generation**: Convert letters to PDF format for download and sharing
- **File Upload**: Support for uploading and managing documents
- **Responsive Design**: Modern UI built with Material-UI components
- **Real-time Updates**: Live updates for letter generation status

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping
- **SQLite**: Lightweight database for development
- **JWT**: JSON Web Tokens for authentication
- **Jinja2**: Template engine for letter generation
- **ReportLab & WeasyPrint**: PDF generation libraries
- **Python-dotenv**: Environment variable management

### Frontend
- **React 19**: Modern JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript development
- **Material-UI (MUI)**: React component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Context API**: State management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Python 3.8+**
- **Node.js 16+** and **npm**
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/darshandaga/letter_management.git
cd letter_management
```

### 2. Backend Setup

#### Create and Activate Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

#### Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create or update the `.env` file in the root directory:

```env
# Email Configuration
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-specific-password
RECIPIENT_EMAIL=recipient@gmail.com

# Database Configuration (optional)
DATABASE_URL=sqlite:///./app.db

# JWT Configuration (optional)
JWT_SECRET_KEY=your-secret-key

# SMTP Configuration (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

**Note**: For Gmail, you'll need to generate an App Password instead of using your regular password.

#### Initialize Database

```bash
python app/init_db.py
```

#### Start Backend Server

```bash
python run.py
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Navigate to Frontend Directory

```bash
cd frontend
```

#### Install Node.js Dependencies

```bash
npm install
```

#### Start Frontend Development Server

```bash
npm start
```

The frontend application will be available at `http://localhost:3000`

## 🌐 Access the Application

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8000/redoc (ReDoc)

## 📁 Project Structure

```
letter_management/
├── app/                          # Backend application
│   ├── __init__.py
│   ├── auth.py                   # Authentication utilities
│   ├── database.py               # Database configuration
│   ├── init_db.py               # Database initialization
│   ├── schemas.py               # Pydantic schemas
│   ├── models/                  # SQLAlchemy models
│   │   ├── user.py
│   │   ├── letter.py
│   │   ├── template.py
│   │   └── email_log.py
│   ├── routes/                  # API routes
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── letters.py
│   │   └── user.py
│   ├── services/                # Business logic
│   │   ├── email_service.py
│   │   ├── file_handler.py
│   │   └── letter_generator.py
│   ├── templates/               # Letter templates
│   │   ├── offer_letter.html
│   │   ├── appointment_letter.html
│   │   ├── confirmation_letter.html
│   │   └── relieving_letter.html
│   └── utils/                   # Utility functions
│       ├── pdf_generator.py
│       └── validators.py
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin dashboard components
│   │   │   └── auth/           # Authentication components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services
│   │   └── App.tsx
│   └── package.json
├── generated_letters/           # Generated PDF letters
├── uploads/                     # Uploaded files
├── logo/                       # Application logos
├── config.py                   # Application configuration
├── requirements.txt            # Python dependencies
├── run.py                      # Application entry point
└── README.md
```

## 🔧 Configuration

### Email Setup

To enable email functionality:

1. Use Gmail with App Passwords (recommended)
2. Enable 2-Factor Authentication on your Gmail account
3. Generate an App Password for the application
4. Update the `.env` file with your credentials

### Database Configuration

The application uses SQLite by default. To use a different database:

1. Update the `DATABASE_URL` in your `.env` file
2. Install the appropriate database driver
3. Run the database initialization script

## 🧪 Testing

The project includes several test files:

```bash
# Test authentication
python test_auth.py

# Test user login
python test_user_login.py

# Test email functionality
python test_email_functionality.py

# Test PDF generation
python test_pdf_generation.py
```

## 📚 API Documentation

Once the backend is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

- `POST /auth/login` - User authentication
- `GET /admin/users` - Get all users (admin only)
- `POST /letters/generate` - Generate a new letter
- `GET /letters/` - Get user's letters
- `POST /templates/` - Create new template (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**: Verify your Gmail App Password and SMTP settings
2. **Database errors**: Run `python app/init_db.py` to reinitialize the database
3. **Frontend not loading**: Ensure both backend and frontend servers are running
4. **PDF generation issues**: Check if all required directories exist

### Getting Help

- Check the [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing instructions
- Review the [EMAIL_FUNCTIONALITY_GUIDE.md](EMAIL_FUNCTIONALITY_GUIDE.md) for email setup
- Open an issue on GitHub for bug reports or feature requests

## 🚀 Deployment

For production deployment:

1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables for production
3. Build the frontend: `npm run build`
4. Use a production WSGI server like Gunicorn
5. Set up reverse proxy with Nginx
6. Configure SSL certificates

---
