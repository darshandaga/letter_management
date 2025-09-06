import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { adminAPI } from '../../services/api';

interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onTemplateAdded: () => void;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({ 
  open, 
  onClose, 
  onTemplateAdded 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    content: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (Array.isArray(error)) {
      return error.map(err => {
        if (typeof err === 'string') return err;
        if (err.msg) return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
        return JSON.stringify(err);
      }).join(', ');
    }
    
    if (error && typeof error === 'object') {
      if (error.msg) return error.msg;
      if (error.message) return error.message;
      return JSON.stringify(error);
    }
    
    return 'An unknown error occurred';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Transform the form data to match backend schema
      const templateData = {
        letter_type: formData.type,
        template_name: formData.name,
        template_path: `templates/${formData.type}.html`, // Generate a template path
      };
      
      await adminAPI.createTemplate(templateData);
      setSuccess('Template created successfully!');
      setFormData({
        name: '',
        type: '',
        content: '',
        description: '',
      });
      onTemplateAdded();
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (error: any) {
      const errorMessage = formatErrorMessage(
        error.response?.data?.detail || error.response?.data || error.message || 'Failed to create template'
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: '',
      content: '',
      description: '',
    });
    setError('');
    setSuccess('');
    onClose();
  };

  const getTemplateExample = (type: string) => {
    switch (type) {
      case 'offer_letter':
        return `Dear {{full_name}},

We are pleased to offer you the position of {{position}} in our {{department}} department.

Your starting salary will be {{salary}} per annum, and your employment will commence on {{start_date}}.

Please confirm your acceptance by signing and returning this letter.

Sincerely,
HR Department`;
      case 'appointment_letter':
        return `Dear {{full_name}},

We are pleased to confirm your appointment as {{position}} in the {{department}} department.

Your appointment will be effective from {{start_date}}.

We look forward to your valuable contribution to our organization.

Best regards,
HR Department`;
      case 'confirmation_letter':
        return `Dear {{full_name}},

We are pleased to confirm your permanent employment as {{position}} in the {{department}} department.

Your probationary period has been successfully completed.

Congratulations on your confirmation.

Best regards,
HR Department`;
      case 'relieving_letter':
        return `Dear {{full_name}},

This is to certify that you have worked with our organization as {{position}} in the {{department}} department.

Your last working day with us was {{end_date}}.

We wish you all the best for your future endeavors.

Sincerely,
HR Department`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Template</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            
            <TextField
              label="Template Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
              placeholder="e.g., Standard Offer Letter"
            />
            
            <FormControl fullWidth required>
              <InputLabel>Template Type</InputLabel>
              <Select
                value={formData.type}
                label="Template Type"
                onChange={(e) => {
                  const type = e.target.value;
                  handleChange('type', type);
                  if (type && !formData.content) {
                    handleChange('content', getTemplateExample(type));
                  }
                }}
              >
                <MenuItem value="offer_letter">Offer Letter</MenuItem>
                <MenuItem value="appointment_letter">Appointment Letter</MenuItem>
                <MenuItem value="confirmation_letter">Confirmation Letter</MenuItem>
                <MenuItem value="relieving_letter">Relieving Letter</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={2}
              fullWidth
              placeholder="Brief description of when to use this template"
            />
            
            <TextField
              label="Template Content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              required
              multiline
              rows={12}
              fullWidth
              placeholder="Enter the template content. Use {{variable_name}} for dynamic values like {{full_name}}, {{position}}, {{department}}, etc."
              helperText="Available variables: {{full_name}}, {{position}}, {{department}}, {{salary}}, {{start_date}}, {{end_date}}, {{reason}}"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating...' : 'Create Template'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTemplateModal;
