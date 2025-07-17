import { Pond, PondCommand } from '../types/pond';
import { PondSensorHistoryData, SensorData } from '../types/sensor';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// Mock data
const mockPonds: Pond[] = [
  {
    id: 1,
    name: 'Pond 1',
    temperature: 25.5,
    turbidity: 10,
    ph: 7.2,
    waterLevel: 1.5,
    lastUpdated: new Date().toISOString(),
    verified: true,
  },
  {
    id: 2,
    name: 'Pond 2',
    temperature: 26.0,
    turbidity: 12,
    ph: 7.0,
    waterLevel: 1.4,
    lastUpdated: new Date().toISOString(),
    verified: true,
  },
  {
    id: 3,
    name: 'Pond 3',
    temperature: 24.8,
    turbidity: 11,
    ph: 7.3,
    waterLevel: 1.6,
    lastUpdated: new Date().toISOString(),
    verified: false,
  },
];

const generateMockHistoricalData = (hours: number = 24): PondSensorHistoryData[] => {
  const data: PondSensorHistoryData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: 25 + Math.random() * 2,
      turbidity: 10 + Math.random() * 3,
      ph: 7 + Math.random() * 0.6,
      waterLevel: 1.4 + Math.random() * 0.3,
      verified: Math.random() > 0.1,
    });
  }
  
  return data;
};

const generateMockCurrentReadings = (): SensorData => {
  const now = new Date().toISOString();
  return {
    temperature: {
      value: 25.5 + Math.random() * 2,
      unit: '°C',
      timestamp: now,
      status: 'good',
      verified: true,
    },
    turbidity: {
      value: 10 + Math.random() * 3,
      unit: 'NTU',
      timestamp: now,
      status: 'good',
      verified: true,
    },
    ph: {
      value: 7 + Math.random() * 0.6,
      unit: 'pH',
      timestamp: now,
      status: 'good',
      verified: true,
    },
    waterLevel: {
      value: 1.4 + Math.random() * 0.3,
      unit: 'm',
      timestamp: now,
      status: 'good',
      verified: true,
    },
    lastUpdated: now,
  };
};

// API functions
export const login = async (email: string, password: string) => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock admin/viewer logic
    const role = email.includes('admin') ? 'admin' : 'viewer';
    return { token: 'mock-jwt-token', role };
  }

  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const register = async (email: string, password: string, name?: string) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Registration successful' };
  }

  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
};

export const getPonds = async (token: string): Promise<Pond[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPonds;
  }

  const response = await fetch(`${API_BASE_URL}/ponds`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ponds');
  }

  return response.json();
};

export const getCurrentReadings = async (token: string): Promise<SensorData> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockCurrentReadings();
  }

  const response = await fetch(`${API_BASE_URL}/sensors/current`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current readings');
  }

  return response.json();
};

export const getPondHistory = async (
  pondId: number,
  token: string,
  timeRange: string = '24h'
): Promise<PondSensorHistoryData[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const hours = timeRange === '1h' ? 1 : timeRange === '7d' ? 168 : 24;
    return generateMockHistoricalData(hours);
  }

  const response = await fetch(`${API_BASE_URL}/ponds/${pondId}/history?range=${timeRange}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pond history');
  }

  return response.json();
};

export const sendCommand = async (
  pondId: number,
  command: PondCommand,
  token: string
) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Mock command sent to pond ${pondId}:`, command);
    return { message: 'Command sent successfully' };
  }

  const response = await fetch(`${API_BASE_URL}/ponds/${pondId}/command`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error('Failed to send command');
  }

  return response.json();
};