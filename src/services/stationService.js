import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class StationService {
  async getAllStations() {
    try {
      const response = await axios.get(`${API_URL}/stations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch stations' };
    }
  }

  async createTrip(tripData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/trips`, tripData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create trip' };
    }
  }

  async getUserTrips() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch trips' };
    }
  }
}

export default new StationService();
