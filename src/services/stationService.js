import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

class StationService {
  async getAllStations() {
    try {
      const response = await axios.get(`${API_URL}/stations`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Failed to fetch stations';
      throw new Error(message);
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
      const message = error.response?.data?.error || error.message || 'Failed to create trip';
      throw new Error(message);
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
      const message = error.response?.data?.error || error.message || 'Failed to fetch trips';
      throw new Error(message);
    }
  }
}

const stationService = new StationService();
export default stationService;
