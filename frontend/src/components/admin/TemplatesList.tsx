import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Edit,
  Delete,
  ArrowBack,
  Visibility,
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: number;
  letter_type: string;
  template_name: string;
  template_path: string;
  created_by: number;
  created_at: string;
}

const TemplatesList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getTemplates();
      setTemplates(response.data);
    } catch (error: any) {
      setError('Failed to load templates');
      console.error('Templates fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      // Note: We need to add a delete endpoint to the backend
      // await adminAPI.deleteTemplate(templateToDelete.id);
      // setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      setError('Delete functionality not yet implemented');
    } catch (error: any) {
      setError('Failed to delete template');
      console.error('Delete template error:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  const getLetterTypeColor = (letterType: string) => {
    switch (letterType.toLowerCase()) {
      case 'offer_letter':
        return 'primary';
      case 'appointment_letter':
        return 'secondary';
      case 'confirmation_letter':
        return 'success';
      case 'relieving_letter':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatLetterType = (letterType: string) => {
    return letterType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/admin/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img 
              src="/IILM_University_Gurgaon_logo.jpg" 
              alt="IILM University Gurgaon" 
              style={{ 
                height: '40px', 
                width: 'auto',
                objectFit: 'contain',
                marginRight: '12px'
              }} 
            />
          </Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IILM University - All Templates
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Total Templates: {templates.length}
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/templates/add')}
                sx={{ mr: 2 }}
              >
                Add Template
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/admin/dashboard')}
              >
                Back to Dashboard
              </Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Template Name</TableCell>
                  <TableCell>Letter Type</TableCell>
                  <TableCell>Template Path</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.id}</TableCell>
                    <TableCell>{template.template_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={formatLetterType(template.letter_type)}
                        color={getLetterTypeColor(template.letter_type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {template.template_path}
                      </Typography>
                    </TableCell>
                    <TableCell>{template.created_by}</TableCell>
                    <TableCell>
                      {new Date(template.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="info"
                        title="View Template"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/templates/${template.id}/edit`)}
                        color="primary"
                        title="Edit Template"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(template)}
                        color="error"
                        title="Delete Template"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {templates.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">
                No templates found
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/admin/templates/add')}
                sx={{ mt: 2 }}
              >
                Add Your First Template
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete template "{templateToDelete?.template_name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplatesList;
