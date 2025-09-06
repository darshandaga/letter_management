import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
    FILE_UPLOAD_PATH = os.getenv("FILE_UPLOAD_PATH", "uploads/")
    MAX_FILE_SIZE = os.getenv("MAX_FILE_SIZE", "10MB")
