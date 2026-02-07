import axios from 'axios';

const API_URL = 'http://localhost:5000';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/api/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  }

  async register(email, password, name) {
    try {
      const response = await axios.post(`${API_URL}/api/register`, { email, password, name });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
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
