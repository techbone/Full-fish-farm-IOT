import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

interface Alert {
  id: number;
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  message: string;
  time: string;
  status: 'active' | 'resolved' | 'info';
  sensorType?: string;
}

/**
 * Alerts component for displaying system notifications and warnings
 * Manages alert states and provides dismissal functionality
 */
const Alerts: React.FC = () => {
  // Mock alerts data - replace with real API integration
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Water Level Low',
      message: 'Water level has dropped to 82%. Consider refilling the tank.',
      time: '2 minutes ago',
      status: 'active',
      sensorType: 'waterLevel'
    },
    {
      id: 2,
      type: 'critical',
      title: 'pH Level Critical',
      message: 'pH level is at 8.5, which is above the safe range. Immediate action required.',
      time: '5 minutes ago',
      status: 'active',
      sensorType: 'ph'
    },
    {
      id: 3,
      type: 'success',
      title: 'Temperature Normalized',
      message: 'Water temperature has returned to optimal range (24.2°C).',
      time: '15 minutes ago',
      status: 'resolved',
      sensorType: 'temperature'
    },
    {
      id: 4,
      type: 'info',
      title: 'Daily Report Ready',
      message: 'Your daily monitoring report is available for download.',
      time: '1 hour ago',
      status: 'info'
    }
  ]);

  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'critical':
        return <AlertTriangle size={20} className="text-red-600" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <Clock size={20} className="text-blue-600" />;
    }
  };

  // Get alert styling based on type
  const getAlertStyling = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Dismiss alert function
  const dismissAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  // Get active alerts count
  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Alerts & Notifications</h2>
            <p className="text-gray-600">Stay informed about your farm status</p>
          </div>
          {activeAlertsCount > 0 && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {activeAlertsCount} Active Alert{activeAlertsCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">No active alerts at this time.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${getAlertStyling(alert.type)} relative`}
            >
              <div className="flex items-start space-x-4">
                {/* Alert Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                
                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-3">
                        <p className="text-sm text-gray-500">{alert.time}</p>
                        {alert.sensorType && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {alert.sensorType}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Status Badge and Dismiss Button */}
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Dismiss alert"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Settings */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Push Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Critical Alerts Only</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;