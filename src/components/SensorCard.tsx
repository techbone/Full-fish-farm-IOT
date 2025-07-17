import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { SensorReading } from '../types/sensor';

interface SensorCardProps {
  title: string;
  reading: SensorReading;
  icon: LucideIcon;
  color: string;
}

/**
 * Sensor card component displaying individual sensor readings
 * Shows value, unit, status, and timestamp
 */
const SensorCard: React.FC<SensorCardProps> = ({ 
  title, 
  reading, 
  icon: Icon, 
  color 
}) => {
  // Get status styling based on sensor status
  const getStatusStyling = () => {
    switch (reading.status) {
      case 'good':
        return {
          dotColor: 'bg-green-400',
          badgeColor: 'text-green-700 bg-green-100',
          text: 'NORMAL'
        };
      case 'warning':
        return {
          dotColor: 'bg-yellow-400',
          badgeColor: 'text-yellow-700 bg-yellow-100',
          text: 'WARNING'
        };
      case 'critical':
        return {
          dotColor: 'bg-red-400',
          badgeColor: 'text-red-700 bg-red-100',
          text: 'CRITICAL'
        };
      default:
        return {
          dotColor: 'bg-gray-400',
          badgeColor: 'text-gray-700 bg-gray-100',
          text: 'UNKNOWN'
        };
    }
  };

  const statusStyling = getStatusStyling();

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with icon and status */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusStyling.dotColor} animate-pulse`} />
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyling.badgeColor}`}>
            {statusStyling.text}
          </span>
        </div>
      </div>
      
      {/* Sensor title */}
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      
      {/* Value and unit */}
      <div className="flex items-baseline space-x-1 mb-2">
        <span className="text-3xl font-bold text-gray-900">
          {typeof reading.value === 'number' ? reading.value.toFixed(1) : reading.value}
        </span>
        <span className="text-gray-500 text-sm">{reading.unit}</span>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-gray-400">
        Last updated: {formatTimestamp(reading.timestamp)}
      </p>
    </div>
  );
};

export default SensorCard;