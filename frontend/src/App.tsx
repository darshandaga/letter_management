import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/admin/Dashboard';
import UsersList from './components/admin/UsersList';
import LettersList from './components/admin/LettersList';
import TemplatesList from './components/admin/TemplatesList';
import RecentLettersList from './components/admin/RecentLettersList';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Unauthorized component
const Unauthorized: React.FC = () => (
  <Container>
    <Box sx={{ mt: 8, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <img 
          src="/IILM_University_Gurgaon_logo.jpg" 
          alt="IILM University Gurgaon" 
          style={{ 
            height: '80px', 
            width: 'auto',
            objectFit: 'contain'
          }} 
        />
      </Box>
      <Typography variant="h4" color="error" gutterBottom>
        Access Denied
      </Typography>
      <Typography variant="body1">
        You don't have permission to access this resource.
      </Typography>
    </Box>
  </Container>
);

// Home redirect component
const HomeRedirect: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/user-dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly>
                  <UsersList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/letters" 
              element={
                <ProtectedRoute adminOnly>
                  <LettersList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/templates" 
              element={
                <ProtectedRoute adminOnly>
                  <TemplatesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/recent-letters" 
              element={
                <ProtectedRoute adminOnly>
                  <RecentLettersList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <Container>
                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <img 
                          src="/IILM_University_Gurgaon_logo.jpg" 
                          alt="IILM University Gurgaon" 
                          style={{ 
                            height: '80px', 
                            width: 'auto',
                            objectFit: 'contain'
                          }} 
                        />
                      </Box>
                      <Typography variant="h4" gutterBottom>
                        IILM University Gurgaon
                      </Typography>
                      <Typography variant="h5" gutterBottom>
                        User Dashboard
                      </Typography>
                      <Typography variant="body1">
                        User portal coming soon...
                      </Typography>
                    </Box>
                  </Container>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
