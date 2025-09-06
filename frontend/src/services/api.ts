// API service for communicating with the backend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  verifyToken: () =>
    api.get('/auth/verify-token'),
};

// Admin API
export const adminAPI = {
  // User management
  getUsers: (skip = 0, limit = 100) =>
    api.get(`/admin/users?skip=${skip}&limit=${limit}`),
  
  createUser: (userData: any) =>
    api.post('/admin/users', userData),
  
  getUser: (userId: number) =>
    api.get(`/admin/users/${userId}`),
  
  updateUser: (userId: number, userData: any) =>
    api.put(`/admin/users/${userId}`, userData),
  
  deleteUser: (userId: number) =>
    api.delete(`/admin/users/${userId}`),
  
  // Letter management
  getLetters: (skip = 0, limit = 100) =>
    api.get(`/admin/letters?skip=${skip}&limit=${limit}`),
  
  generateLetter: (letterData: any) =>
    api.post('/admin/letters/generate', letterData),
  
  // Template management
  getTemplates: () =>
    api.get('/admin/templates'),
  
  createTemplate: (templateData: any) =>
    api.post('/admin/templates', templateData),
  
  // Dashboard stats
  getDashboardStats: () =>
    api.get('/admin/stats'),
};

export default api;
