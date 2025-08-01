import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return api.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  register: (userData) => {
    return api.post('/users/', userData);
  },
  
  getCurrentUser: (token) => {
    // This would be a custom endpoint to get current user info
    // For simplicity, we'll decode the token
    return new Promise((resolve, reject) => {
      try {
        // In a real app, you'd have a /users/me endpoint
        // For now, we'll just return a placeholder
        resolve({ username: "user" });
      } catch (error) {
        reject(error);
      }
    });
  }
};

export default api;