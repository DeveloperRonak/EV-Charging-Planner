import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class AuthService {
  async login(email, password) {
    try {
      console.log(`Attempting login to: ${API_URL}/api/login`);
      const response = await axios.post(`${API_URL}/api/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Login Error:", error);
      let message = 'Login failed';
      if (error.response) {
        message = error.response.data?.error || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        message = 'Network Error: No response from server. Please check if backend is running.';
      } else {
        message = error.message;
      }
      throw new Error(message);
    }
  }

  async register(email, password, name) {
    try {
      console.log(`Attempting registration to: ${API_URL}/api/register`);
      const response = await axios.post(`${API_URL}/api/register`, { email, password, name });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Registration Error:", error);
      let message = 'Registration failed';
      if (error.response) {
        message = error.response.data?.error || `Server Error: ${error.response.status}`;
      } else if (error.request) {
        message = 'Network Error: No response from server. Please check if backend is running.';
      } else {
        message = error.message;
      }
      throw new Error(message);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

const authService = new AuthService();
export default authService;
