import React, { useState } from 'react';
import { Wifi, Database, Bell, Shield, Save, RefreshCw, User as UserIcon } from 'lucide-react';
import BlockchainPanel from './BlockchainPanel';
import UserProfile from './UserProfile';

/**
 * Settings component for configuring the IoT system
 * Includes network, data collection, alerts, device settings, blockchain integration, and user profile
 */
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'account'>('system');
  const [settings, setSettings] = useState({
    network: {
      ssid: 'FarmNetwork_2.4G',
      connected: true,
      signalStrength: 85
    },
    dataCollection: {
      samplingRate: 30,
      dataRetention: 30,
      autoBackup: true
    },
    alertThresholds: {
      temperature: { min: 20, max: 28 },
      ph: { min: 6.5, max: 8.0 },
      waterLevel: { min: 70, max: 100 },
      humidity: { min: 60, max: 80 }
    },
    notifications: {
      email: true,
      push: true,
      criticalOnly: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  // Handle settings update
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message (you can implement toast notifications)
    alert('Settings saved successfully!');
  };

  // Handle input changes
  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  // Handle threshold changes
  const updateThreshold = (sensor: string, type: 'min' | 'max', value: number) => {
    setSettings(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [sensor]: {
          ...prev.alertThresholds[sensor as keyof typeof prev.alertThresholds],
          [type]: value
        }
      }
    }));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure your IoT monitoring system and account</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'system'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield size={16} />
            <span>System Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'account'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon size={16} />
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'account' ? (
        <div className="animate-fade-in">
          <UserProfile />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Blockchain Security Panel */}
          <BlockchainPanel />

          {/* Network Configuration */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wifi size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Network Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WiFi Network</label>
                <input 
                  type="text" 
                  value={settings.network.ssid}
                  onChange={(e) => updateSetting('network', 'ssid', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${settings.network.connected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-600">
                    {settings.network.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Signal: {settings.network.signalStrength}%
                </span>
              </div>
            </div>
          </div>

          {/* Data Collection Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database size={20} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Data Collection</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Sampling Rate (seconds)</span>
                <select 
                  value={settings.dataCollection.samplingRate}
                  onChange={(e) => updateSetting('dataCollection', 'samplingRate', parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Data Retention (days)</span>
                <select 
                  value={settings.dataCollection.dataRetention}
                  onChange={(e) => updateSetting('dataCollection', 'dataRetention', parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Auto Backup</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.dataCollection.autoBackup}
                    onChange={(e) => updateSetting('dataCollection', 'autoBackup', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell size={20} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Alert Thresholds</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={settings.alertThresholds.temperature.min}
                    onChange={(e) => updateThreshold('temperature', 'min', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={settings.alertThresholds.temperature.max}
                    onChange={(e) => updateThreshold('temperature', 'max', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              
              {/* pH Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Min" 
                    value={settings.alertThresholds.ph.min}
                    onChange={(e) => updateThreshold('ph', 'min', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="Max" 
                    value={settings.alertThresholds.ph.max}
                    onChange={(e) => updateThreshold('ph', 'max', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              
              {/* Water Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Level (%)</label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={settings.alertThresholds.waterLevel.min}
                    onChange={(e) => updateThreshold('waterLevel', 'min', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={settings.alertThresholds.waterLevel.max}
                    onChange={(e) => updateThreshold('waterLevel', 'max', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              
              {/* Humidity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={settings.alertThresholds.humidity.min}
                    onChange={(e) => updateThreshold('humidity', 'min', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={settings.alertThresholds.humidity.max}
                    onChange={(e) => updateThreshold('humidity', 'max', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield size={20} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Device Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Arduino Model:</span>
                  <span className="text-gray-900 font-medium">Arduino Uno R3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESP8266 Version:</span>
                  <span className="text-gray-900 font-medium">ESP-12E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Firmware Version:</span>
                  <span className="text-gray-900 font-medium">v2.1.0</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="text-gray-900 font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Device ID:</span>
                  <span className="text-gray-900 font-medium">FF:A2:B3:C4:D5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Usage:</span>
                  <span className="text-gray-900 font-medium">68%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;