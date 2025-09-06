# Database initialization script
from app.database import engine
from app.models import Base
import os

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def create_directories():
    """Create necessary directories for file storage"""
    directories = [
        "uploads",
        "generated_letters",
        "app/templates"
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

if __name__ == "__main__":
    create_directories()
    create_tables()
