// Admin dashboard component
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Description,
  Article,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import AddUserModal from './AddUserModal';
import GenerateLetterModal from './GenerateLetterModal';
import AddTemplateModal from './AddTemplateModal';

interface DashboardStats {
  total_users: number;
  total_letters: number;
  total_templates: number;
  recent_letters: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Modal states
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [generateLetterModalOpen, setGenerateLetterModalOpen] = useState(false);
  const [addTemplateModalOpen, setAddTemplateModalOpen] = useState(false);
  
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    } else {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error: any) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
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
            IILM University - Letter Management System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/admin/users')}>
            Users
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/letters')}>
            Letters
          </Button>
          <Button color="inherit" onClick={() => navigate('/admin/templates')}>
            Templates
          </Button>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Typography>{user?.full_name}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Dashboard Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/users')}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <People color="primary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">
                      {stats?.total_users || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/letters')}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Description color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Letters
                    </Typography>
                    <Typography variant="h4">
                      {stats?.total_letters || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/templates')}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Article color="success" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Templates
                    </Typography>
                    <Typography variant="h4">
                      {stats?.total_templates || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate('/admin/recent-letters')}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Description color="warning" sx={{ mr: 2, fontSize: 40 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Recent Letters
                    </Typography>
                    <Typography variant="h4">
                      {stats?.recent_letters?.length || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Recent Letters */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Letters
            </Typography>
            {stats?.recent_letters && stats.recent_letters.length > 0 ? (
              <Box>
                {stats.recent_letters.map((letter: any, index: number) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>{letter.letter_type}</strong> - User ID: {letter.user_id} - 
                      Status: {letter.status} - Generated: {new Date(letter.generated_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">
                No recent letters found
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={() => setAddUserModalOpen(true)}
              >
                Add New User
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => setGenerateLetterModalOpen(true)}
              >
                Generate Letter
              </Button>
              <Button 
                variant="outlined"
                onClick={() => setAddTemplateModalOpen(true)}
              >
                Add Template
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Modals */}
      <AddUserModal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        onUserAdded={fetchDashboardStats}
      />
      
      <GenerateLetterModal
        open={generateLetterModalOpen}
        onClose={() => setGenerateLetterModalOpen(false)}
        onLetterGenerated={fetchDashboardStats}
      />
      
      <AddTemplateModal
        open={addTemplateModalOpen}
        onClose={() => setAddTemplateModalOpen(false)}
        onTemplateAdded={fetchDashboardStats}
      />
    </Box>
  );
};

export default Dashboard;
