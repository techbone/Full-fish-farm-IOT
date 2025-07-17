import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react';
import { usePond } from '../contexts/PondContext';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import SensorChart from '../components/SensorChart';
import AdminControls from '../components/AdminControls';

const PondDetail = ({ pondId, onBack }) => {
  const { selectedPond } = usePond();
  const { user } = useAuth();
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(false);

  const fetchHistoricalData = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const data = await api.getPondHistory(pondId, user.token, timeRange);
      setHistoricalData(data);
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [pondId, timeRange, user?.token]);

  if (!selectedPond) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pond not found</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const timeRangeOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {selectedPond.name} Details
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Real-time monitoring and historical data
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchHistoricalData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 py-6 md:py-8">
        {/* Current Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Temperature</p>
              <p className="text-2xl font-bold text-red-600">{selectedPond.temperature.toFixed(1)}°C</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">pH Level</p>
              <p className="text-2xl font-bold text-green-600">{selectedPond.ph.toFixed(1)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Turbidity</p>
              <p className="text-2xl font-bold text-blue-600">{selectedPond.turbidity.toFixed(1)} NTU</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Water Level</p>
              <p className="text-2xl font-bold text-purple-600">{selectedPond.waterLevel.toFixed(1)} m</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                Last updated: {selectedPond.lastUpdated ? new Date(selectedPond.lastUpdated).toLocaleString() : 'Never'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${selectedPond.verified ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-sm text-gray-600">
                {selectedPond.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <div className="flex space-x-1">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    timeRange === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sensorConfigs.map((config) => (
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

        {/* Admin Controls */}
        {user?.role === 'admin' && (
          <AdminControls pondId={pondId} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading historical data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && historicalData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No historical data available for the selected time range.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PondDetail;