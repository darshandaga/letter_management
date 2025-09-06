# This file initializes the FastAPI app and will be used to include routers and services
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.init_db import create_tables, create_directories

def create_app():
    app = FastAPI(
        title="Letter & Document Management System",
        description="A comprehensive system for managing HR letters and documents",
        version="1.0.0"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Configure this properly for production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Initialize database and directories on startup
    @app.on_event("startup")
    async def startup_event():
        create_directories()
        create_tables()
    
    # Include routers
    from .routes import auth, admin
    app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
    
    # Additional routers to be implemented
    # from .routes import user, letters
    # app.include_router(user.router, prefix="/api/user", tags=["user"])
    # app.include_router(letters.router, prefix="/api/letters", tags=["letters"])
    
    @app.get("/")
    async def root():
        return {"message": "Letter & Document Management System API is running"}
    
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "message": "API is operational"}
    
    return app

app = create_app()
