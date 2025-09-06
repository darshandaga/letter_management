import React, { useState, useEffect } from 'react';
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
  Autocomplete,
} from '@mui/material';
import { adminAPI } from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

interface Template {
  id: number;
  name: string;
  type: string;
}

interface GenerateLetterModalProps {
  open: boolean;
  onClose: () => void;
  onLetterGenerated: () => void;
}

const GenerateLetterModal: React.FC<GenerateLetterModalProps> = ({ 
  open, 
  onClose, 
  onLetterGenerated 
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [letterData, setLetterData] = useState({
    position: '',
    department: '',
    salary: '',
    start_date: '',
    end_date: '',
    reason: '',
    manager: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchTemplates();
    }
  }, [open]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await adminAPI.getTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleLetterDataChange = (field: string, value: string) => {
    setLetterData(prev => ({
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
    if (!selectedUser || !selectedTemplate) {
      setError('Please select both user and template');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        user_id: selectedUser.id,
        letter_type: selectedTemplate,
        ...letterData,
      };

      await adminAPI.generateLetter(payload);
      setSuccess('Letter generated and sent successfully!');
      resetForm();
      onLetterGenerated();
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (error: any) {
      const errorMessage = formatErrorMessage(
        error.response?.data?.detail || error.response?.data || error.message || 'Failed to generate letter'
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setSelectedTemplate('');
    setLetterData({
      position: '',
      department: '',
      salary: '',
      start_date: '',
      end_date: '',
      reason: '',
      manager: '',
    });
  };

  const handleClose = () => {
    resetForm();
    setError('');
    setSuccess('');
    onClose();
  };

  const getRequiredFields = () => {
    switch (selectedTemplate) {
      case 'offer_letter':
        return ['position', 'department', 'salary', 'start_date', 'manager'];
      case 'appointment_letter':
        return ['position', 'department', 'start_date', 'manager'];
      case 'confirmation_letter':
        return ['position', 'department'];
      case 'relieving_letter':
        return ['position', 'department', 'end_date'];
      default:
        return [];
    }
  };

  const requiredFields = getRequiredFields();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Generate Letter</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            
            <Autocomplete
              options={users}
              getOptionLabel={(option) => `${option.full_name} (${option.username})`}
              value={selectedUser}
              onChange={(_, newValue) => setSelectedUser(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select User" required />
              )}
            />
            
            <FormControl fullWidth required>
              <InputLabel>Letter Template</InputLabel>
              <Select
                value={selectedTemplate}
                label="Letter Template"
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <MenuItem value="offer_letter">Offer Letter</MenuItem>
                <MenuItem value="appointment_letter">Appointment Letter</MenuItem>
                <MenuItem value="confirmation_letter">Confirmation Letter</MenuItem>
                <MenuItem value="relieving_letter">Relieving Letter</MenuItem>
              </Select>
            </FormControl>

            {selectedTemplate && (
              <>
                {requiredFields.includes('position') && (
                  <TextField
                    label="Position"
                    value={letterData.position}
                    onChange={(e) => handleLetterDataChange('position', e.target.value)}
                    required
                    fullWidth
                  />
                )}
                
                {requiredFields.includes('department') && (
                  <TextField
                    label="Department"
                    value={letterData.department}
                    onChange={(e) => handleLetterDataChange('department', e.target.value)}
                    required
                    fullWidth
                  />
                )}
                
                {requiredFields.includes('salary') && (
                  <TextField
                    label="Salary"
                    value={letterData.salary}
                    onChange={(e) => handleLetterDataChange('salary', e.target.value)}
                    required
                    fullWidth
                  />
                )}
                
                {requiredFields.includes('manager') && (
                  <TextField
                    label="Manager"
                    value={letterData.manager}
                    onChange={(e) => handleLetterDataChange('manager', e.target.value)}
                    required
                    fullWidth
                  />
                )}
                
                {requiredFields.includes('start_date') && (
                  <TextField
                    label="Start Date"
                    type="date"
                    value={letterData.start_date}
                    onChange={(e) => handleLetterDataChange('start_date', e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                
                {requiredFields.includes('end_date') && (
                  <TextField
                    label="End Date"
                    type="date"
                    value={letterData.end_date}
                    onChange={(e) => handleLetterDataChange('end_date', e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                
                {selectedTemplate === 'relieving_letter' && (
                  <TextField
                    label="Reason for Leaving"
                    value={letterData.reason}
                    onChange={(e) => handleLetterDataChange('reason', e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !selectedUser || !selectedTemplate}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Generating...' : 'Generate & Send Letter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GenerateLetterModal;
