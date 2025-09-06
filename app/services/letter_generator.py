from app.utils.pdf_generator import PDFGenerator

class LetterGenerator:
    def __init__(self):
        self.pdf_generator = PDFGenerator()
    
    def generate_offer_letter(self, user_data, template_path=None):
        """Generate offer letter PDF"""
        if not template_path:
            template_path = "app/templates/offer_letter.html"
        return self.pdf_generator.generate_letter_pdf("offer_letter", user_data, template_path)
    
    def generate_appointment_letter(self, user_data, template_path=None):
        """Generate appointment letter PDF"""
        if not template_path:
            template_path = "app/templates/appointment_letter.html"
        return self.pdf_generator.generate_letter_pdf("appointment_letter", user_data, template_path)
    
    def generate_confirmation_letter(self, user_data, template_path=None):
        """Generate confirmation letter PDF"""
        if not template_path:
            template_path = "app/templates/confirmation_letter.html"
        return self.pdf_generator.generate_letter_pdf("confirmation_letter", user_data, template_path)
    
    def generate_relieving_letter(self, user_data, template_path=None):
        """Generate relieving letter PDF"""
        if not template_path:
            template_path = "app/templates/relieving_letter.html"
        return self.pdf_generator.generate_letter_pdf("relieving_letter", user_data, template_path)
    
    def generate_letter(self, letter_type, user_data, template_path=None):
        """Generate letter based on type"""
        letter_generators = {
            "offer_letter": self.generate_offer_letter,
            "appointment_letter": self.generate_appointment_letter,
            "confirmation_letter": self.generate_confirmation_letter,
            "relieving_letter": self.generate_relieving_letter
        }
        
        generator = letter_generators.get(letter_type)
        if generator:
            return generator(user_data, template_path)
        else:
            raise ValueError(f"Unsupported letter type: {letter_type}")
