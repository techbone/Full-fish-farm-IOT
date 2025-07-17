import React from 'react';
import { Thermometer, Droplets, Activity, Waves, Wifi, WifiOff } from 'lucide-react';
import { useSensorData } from '../hooks/useSensorData';
import SensorCard from './SensorCard';

/**
 * Main dashboard component displaying all sensor readings
 * Shows real-time data with status indicators
 */
const Dashboard: React.FC = () => {
  const { sensorData, loading, error, lastUpdated, refresh } = useSensorData();

  // Show loading state
  if (loading && !sensorData) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !sensorData) {
    return (
      <div className="animate-fade-in">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <WifiOff size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Farm</h2>
        <p className="text-gray-600">Monitor your fish farm conditions in real-time</p>
      </div>

      {/* Sensor Cards Grid */}
      {sensorData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SensorCard
            title="Water Temperature"
            reading={sensorData.temperature}
            icon={Thermometer}
            color="bg-gradient-to-br from-red-500 to-orange-500"
          />
          
          <SensorCard
            title="pH Level"
            reading={sensorData.ph}
            icon={Activity}
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          
          <SensorCard
            title="Water Level"
            reading={sensorData.waterLevel}
            icon={Waves}
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          
          <SensorCard
            title="Humidity"
            reading={sensorData.humidity}
            icon={Droplets}
            color="bg-gradient-to-br from-purple-500 to-indigo-500"
          />
        </div>
      )}

      {/* System Status Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        
        <div className="space-y-3">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wifi size={20} className="text-green-600" />
              <span className="text-gray-700">Device Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>

          {/* Last Update */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="text-gray-900 font-medium">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </span>
          </div>

          {/* Data Quality */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Data Quality</span>
            <span className="text-green-600 font-medium">Excellent</span>
          </div>
        </div>

        {/* Manual Refresh Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={refresh}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;