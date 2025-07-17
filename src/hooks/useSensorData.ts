import { useState, useEffect, useCallback } from 'react';
import { SensorData } from '../types/sensor';
import { sensorApi } from '../services/api';

/**
 * Custom hook for managing sensor data with real-time updates
 */
export const useSensorData = (refreshInterval: number = 5000) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch sensor data
  const fetchSensorData = useCallback(async () => {
    try {
      setError(null);
      const data = await sensorApi.getCurrentReadings();
      setSensorData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch sensor data');
      console.error('Sensor data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time data fetching
  useEffect(() => {
    // Initial fetch
    fetchSensorData();

    // Set up interval for real-time updates
    const interval = setInterval(fetchSensorData, refreshInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchSensorData, refreshInterval]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true);
    fetchSensorData();
  }, [fetchSensorData]);

  return {
    sensorData,
    loading,
    error,
    lastUpdated,
    refresh,
  };
};

// Export the sensorApi for direct use
export const sensorApi = {
  getCurrentReadings: async (): Promise<SensorData> => {
    // Mock implementation
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
  },
};