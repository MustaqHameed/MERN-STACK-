import axios from 'axios';

// API base URL, using the environment variable set in the .env file
const API_URL = process.env.REACT_APP_API_BASE_URL;

// Register user (Signup)
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Signup failed');
    } else {
      throw new Error('Network error');
    }
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    
    // Store token and user details in session storage
    const { token, user } = response.data;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('user', JSON.stringify(user));  // Store user details in JSON format
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Network error');
    }
  }
};

// Get user data from session storage
export const getUserData = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null; // Return parsed user data or null if not found
};

// Get auth token from session storage
export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

// Logout user
export const logoutUser = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};
