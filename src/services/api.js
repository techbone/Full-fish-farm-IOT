import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api';

// Token management
export const getToken = () => localStorage.getItem('jwt_token');
export const setToken = (token) => localStorage.setItem('jwt_token', token);
export const removeToken = () => localStorage.removeItem('jwt_token');

// Login (POST /api/auth/login)
export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
  if (response.data && response.data.token) {
    setToken(response.data.token);
  }
  return response.data;
};

// Register (POST /api/auth/register)
export const register = async (email, password, name) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password, name });
  return response.data;
};

// Get Current Readings (GET /api/sensors/current)
export const getCurrentReadings = async () => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/api/sensors/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get Pond History (GET /api/ponds/:pondId/history?range=)
export const getPondHistory = async (pondId, timeRange = '24h') => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/api/ponds/${pondId}/history`, {
    params: { range: timeRange },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Send Command (POST /api/ponds/:pondId/command)
export const sendCommand = async (pondId, command) => {
  const token = getToken();
  const response = await axios.post(`${API_BASE_URL}/api/ponds/${pondId}/command`, command, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get Sensor Data (GET /api/sensors/:sensorId/data?limit=)
export const getSensorData = async (sensorId, limit = 100) => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/api/sensors/${sensorId}/data`, {
    params: { limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get Sensor Thresholds (GET /api/sensors/:sensorId/thresholds)
export const getSensorThresholds = async (sensorId) => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/api/sensors/${sensorId}/thresholds`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update/Create Sensor Thresholds (POST /api/sensors/:sensorId/thresholds)
export const setSensorThresholds = async (sensorId, thresholds) => {
  const token = getToken();
  const response = await axios.post(`${API_BASE_URL}/api/sensors/${sensorId}/thresholds`, thresholds, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Subscribe to Push Notifications (POST /api/subscribe)
export const subscribeToPush = async (subscription) => {
  const token = getToken();
  const response = await axios.post(`${API_BASE_URL}/api/subscribe`, subscription, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};