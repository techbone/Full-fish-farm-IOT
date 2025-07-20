import React, { useState } from 'react';
import { Thermometer, Droplets, Activity, Waves, CheckCircle, AlertTriangle } from 'lucide-react';

const PondCard = ({ pond, onClick }) => {
  const [showSalinity, setShowSalinity] = useState(false);
  const getSensorStatus = (value, type) => {
    switch (type) {
      case 'temperature':
        return value < 20 || value > 30 ? 'critical' : value < 22 || value > 28 ? 'warning' : 'good';
      case 'ph':
        return value < 6.5 || value > 8.5 ? 'critical' : value < 7 || value > 8 ? 'warning' : 'good';
      case 'turbidity':
        return value > 20 ? 'critical' : value > 15 ? 'warning' : 'good';
      case 'waterLevel':
        return value < 1.0 ? 'critical' : value < 1.2 ? 'warning' : 'good';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const sensors = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: pond.temperature,
      unit: '°C',
      status: getSensorStatus(pond.temperature, 'temperature'),
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Activity,
      label: 'pH Level',
      value: pond.ph !== undefined ? pond.ph : pond.pH,
      unit: 'pH',
      status: getSensorStatus(pond.ph !== undefined ? pond.ph : pond.pH, 'ph'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Droplets,
      label: 'Turbidity',
      value: pond.turbidity,
      unit: 'NTU',
      status: getSensorStatus(pond.turbidity, 'turbidity'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Waves,
      label: 'Water Level',
      value: pond.waterLevel,
      unit: 'm',
      status: getSensorStatus(pond.waterLevel, 'waterLevel'),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Droplets,
      label: 'Salinity',
      value: pond.salinity,
      unit: 'ppm',
      status: 'good',
      color: 'from-cyan-500 to-blue-400'
    }
  ];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{pond.name}</h3>
        <div className="flex items-center space-x-2">
          {pond.verified ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertTriangle size={20} className="text-yellow-600" />
          )}
          <span className="text-xs text-gray-500">
            {pond.verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-4">
        {sensors.map((sensor, index) => {
          const Icon = sensor.icon;
          return (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${sensor.color} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-xs text-gray-600 mb-1">{sensor.label}</p>
              <p className={`text-lg font-bold ${getStatusColor(sensor.status)}`}>
                {typeof sensor.value === 'number' && !isNaN(sensor.value) ? sensor.value : '--'}{sensor.unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Last updated: {pond.lastUpdated ? new Date(pond.lastUpdated).toLocaleTimeString() : 'Never'}
        </p>
      </div>
    </div>
  );
};

export default PondCard;