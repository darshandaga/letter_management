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

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'user',
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
      await adminAPI.createUser(formData);
      setSuccess('User created successfully!');
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'user',
      });
      onUserAdded();
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (error: any) {
      const errorMessage = formatErrorMessage(
        error.response?.data?.detail || error.response?.data || error.message || 'Failed to create user'
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      full_name: '',
      password: '',
      role: 'user',
    });
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
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
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
