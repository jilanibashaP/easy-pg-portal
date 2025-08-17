// services/authAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Login API call
  login: async (credentials) => {
    console.log('Logging in with credentials:', credentials);
    const response = await apiClient.post('/login', {
      phoneNumber: credentials.phoneNumber,
      password: credentials.password,
    });

    return response;
  },

  // Signup API call
  signup: async (userData) => {
    const response = await apiClient.post('/signup', {
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      pincode: userData.pincode,
    });
    return response;
  },

  // Logout API call
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiClient.put('/profile', userData);
    return response;
  },
};

export default apiClient;