import React from 'react';
import { TrendingUp, Calendar, Clock, BarChart } from 'lucide-react';

/**
 * Analytics component for displaying historical data and trends
 * TODO: Integrate with backend API for real historical data
 */
const Analytics: React.FC = () => {
  // Mock analytics data - replace with real API calls
  const analyticsData = {
    dailyAverage: {
      temperature: 24.2,
      ph: 7.1,
      waterLevel: 87,
      humidity: 68
    },
    weeklyTrend: {
      temperature: '+1.2%',
      ph: '+2.1%',
      waterLevel: '-3.5%',
      humidity: '+0.8%'
    },
    systemUptime: 99.8
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Historical data and performance trends</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Daily Averages */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Daily Averages</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Temperature:</span>
              <span className="text-sm font-medium">{analyticsData.dailyAverage.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">pH Level:</span>
              <span className="text-sm font-medium">{analyticsData.dailyAverage.ph}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Water Level:</span>
              <span className="text-sm font-medium">{analyticsData.dailyAverage.waterLevel}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Humidity:</span>
              <span className="text-sm font-medium">{analyticsData.dailyAverage.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Weekly Trends</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Temperature:</span>
              <span className="text-sm font-medium text-green-600">{analyticsData.weeklyTrend.temperature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">pH Stability:</span>
              <span className="text-sm font-medium text-green-600">{analyticsData.weeklyTrend.ph}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Water Level:</span>
              <span className="text-sm font-medium text-red-600">{analyticsData.weeklyTrend.waterLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Humidity:</span>
              <span className="text-sm font-medium text-green-600">{analyticsData.weeklyTrend.humidity}</span>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={20} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">System Performance</h3>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">{analyticsData.systemUptime}%</p>
            <p className="text-sm text-gray-500">Uptime (30 days)</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Data Points:</span>
              <span className="font-medium">2,847</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Alerts:</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Historical Trends</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">24H</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">7D</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">30D</button>
          </div>
        </div>
        
        {/* Chart placeholder - integrate with charting library */}
        <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center">
            <BarChart size={48} className="text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Chart Visualization</p>
            <p className="text-sm text-gray-500 mt-1">
              Integrate with Chart.js or similar library
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;