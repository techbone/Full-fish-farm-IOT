import React, { useState, useEffect } from 'react';
import SensorChart from './SensorChart';
import * as api from '../services/api';

const sensorConfigs = [
  {
    type: 'temperature',
    title: 'Water Temperature',
    color: '#ef4444',
    unit: '°C',
  },
  {
    type: 'ph',
    title: 'pH Level',
    color: '#10b981',
    unit: 'pH',
  },
  {
    type: 'turbidity',
    title: 'Turbidity',
    color: '#3b82f6',
    unit: 'NTU',
  },
  {
    type: 'waterLevel',
    title: 'Water Level',
    color: '#8b5cf6',
    unit: 'm',
  },
  {
    type: 'salinity',
    title: 'Salinity',
    color: '#06b6d4',
    unit: 'ppm',
  },
];

const timeRangeOptions = [
  { value: 5, label: 'Last 5' },
  { value: 10, label: 'Last 10' },
  { value: 15, label: 'Last 15' },
];

const HistoricalDataPanel = ({ sensorId }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const data = await api.getSensorData(sensorId, limit);
      setHistoricalData(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
    // eslint-disable-next-line
  }, [sensorId, limit]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historical Data</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Show:</span>
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setLimit(option.value)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                limit === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading historical data...</p>
        </div>
      ) : historicalData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No historical data available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sensorConfigs.map(config => (
            <SensorChart
              key={config.type}
              data={historicalData}
              sensorType={config.type}
              title={config.title}
              color={config.color}
              unit={config.unit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricalDataPanel; 