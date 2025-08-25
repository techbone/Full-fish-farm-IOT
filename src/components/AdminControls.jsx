import React, { useState } from 'react';
import { Power, Settings, Zap, Droplets, AlertTriangle } from 'lucide-react';
import { usePond } from '../contexts/PondContext';

const AdminControls = ({ pondId }) => {
  const { sendCommand } = usePond();
  const [isLoading, setIsLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);

  const handleCommand = async (command, description) => {
    setIsLoading(true);
    try {
      await sendCommand(pondId, command);
      setLastCommand(description);
      setTimeout(() => setLastCommand(null), 3000);
    } catch (error) {
      console.error('Command failed:', error);
      alert('Failed to send command. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const controls = [
    {
      icon: Power,
      label: 'Toggle Pump',
      description: 'Water Pump',
      color: 'bg-blue-600 hover:bg-blue-700',
      command: { command: 'toggle_pump', params: { pondId } },
    },
    {
      icon: Zap,
      label: 'Aerator On/Off',
      description: 'Aerator System',
      color: 'bg-green-600 hover:bg-green-700',
      command: { command: 'toggle_aerator', params: { pondId } },
    },
    {
      icon: Droplets,
      label: 'Add Chemicals',
      description: 'pH Adjustment',
      color: 'bg-purple-600 hover:bg-purple-700',
      command: { command: 'add_chemicals', params: { pondId, type: 'ph_buffer' } },
    },
    {
      icon: Settings,
      label: 'System Check',
      description: 'Run Diagnostics',
      color: 'bg-orange-600 hover:bg-orange-700',
      command: { command: 'system_check', params: { pondId } },
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Admin Controls</h3>
          <p className="text-sm text-gray-600">Control pond equipment and systems</p>
        </div>
      </div>

      {/* Success Message */}
      {lastCommand && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Command sent: {lastCommand}
          </p>
        </div>
      )}

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {controls.map((control, index) => {
          const Icon = control.icon;
          return (
            <button
              key={index}
              onClick={() => handleCommand(control.command, control.description)}
              disabled={isLoading}
              className={`${control.color} text-white p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3`}
            >
              <Icon size={20} />
              <div className="text-left">
                <p className="font-medium">{control.label}</p>
                <p className="text-xs opacity-90">{control.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Emergency Controls */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Emergency Controls</h4>
        <div className="space-y-2">
          <button
            onClick={() => handleCommand(
              { command: 'emergency_stop', params: { pondId } },
              'Emergency Stop'
            )}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            🚨 Emergency Stop All Systems!
          </button>
          <button
            onClick={() => handleCommand(
              { command: 'emergency_drain', params: { pondId } },
              'Emergency Drain'
            )}
            disabled={isLoading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            ⚠️ Emergency Drain
          </button>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          ⚠️ Use emergency controls only when necessary. All actions are logged and monitored.
        </p>
      </div>
    </div>
  );
};

export default AdminControls;