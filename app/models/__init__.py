# Import all models to make them available
from .user import User
from .letter import GeneratedLetter
from .template import LetterTemplate
from .email_log import EmailLog

# Import Base for database initialization
from app.database import Base

__all__ = ["User", "GeneratedLetter", "LetterTemplate", "EmailLog", "Base"]
