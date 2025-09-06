import os
from weasyprint import HTML, CSS
from jinja2 import Template
from datetime import datetime

class PDFGenerator:
    def __init__(self, output_dir="generated_letters"):
        self.output_dir = output_dir
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
    
    def generate_pdf(self, html_template_path, data, output_filename=None):
        """
        Generate PDF from HTML template and data
        
        Args:
            html_template_path: Path to HTML template file
            data: Dictionary containing data to populate template
            output_filename: Optional custom filename for output PDF
            
        Returns:
            Path to generated PDF file
        """
        try:
            # Read HTML template
            with open(html_template_path, 'r', encoding='utf-8') as file:
                template_content = file.read()
            
            # Create Jinja2 template and render with data
            template = Template(template_content)
            rendered_html = template.render(**data)
            
            # Generate output filename if not provided
            if not output_filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                letter_type = data.get('letter_type', 'letter')
                user_id = data.get('user_id', 'unknown')
                output_filename = f"{letter_type}_{user_id}_{timestamp}.pdf"
            
            # Ensure filename ends with .pdf
            if not output_filename.endswith('.pdf'):
                output_filename += '.pdf'
            
            output_path = os.path.join(self.output_dir, output_filename)
            
            # Add basic CSS for better formatting
            css_style = """
            @page {
                size: A4;
                margin: 0.75in;
            }
            body {
                font-family: Arial, sans-serif;
                font-size: 12pt;
                line-height: 1.4;
                color: #333;
            }
            h1, h2, h3 {
                color: #2c3e50;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .content {
                margin: 20px 0;
            }
            .signature {
                margin-top: 50px;
            }
            """
            
            # Generate PDF using weasyprint
            html_doc = HTML(string=rendered_html)
            css_doc = CSS(string=css_style)
            html_doc.write_pdf(output_path, stylesheets=[css_doc])
            
            return output_path
            
        except Exception as e:
            print(f"Error generating PDF: {e}")
            return None
    
    def generate_letter_pdf(self, letter_type, user_data, template_path=None):
        """
        Generate PDF for specific letter type
        
        Args:
            letter_type: Type of letter (offer_letter, appointment_letter, etc.)
            user_data: User data dictionary
            template_path: Optional custom template path
            
        Returns:
            Path to generated PDF file
        """
        if not template_path:
            template_path = f"app/templates/{letter_type}.html"
        
        # Add current date to user data
        user_data['current_date'] = datetime.now().strftime("%B %d, %Y")
        user_data['letter_type'] = letter_type
        
        return self.generate_pdf(template_path, user_data)
