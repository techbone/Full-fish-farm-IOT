import React, { useState } from 'react';
import { Shield, Wallet, CheckCircle, AlertTriangle, Hash, Clock } from 'lucide-react';
import { useBlockchain } from '../hooks/useBlockchain';
import { useSensorData } from '../hooks/useSensorData';

/**
 * Blockchain integration panel component
 * Handles wallet connection, device registration, and data integrity verification
 */
const BlockchainPanel: React.FC = () => {
  const { 
    walletInfo, 
    isConnecting, 
    error, 
    registeredDevice,
    connectWallet, 
    disconnectWallet, 
    registerDevice, 
    storeSensorData,
    verifyDataIntegrity,
    isConnected 
  } = useBlockchain();
  
  const { sensorData } = useSensorData();
  
  const [deviceId, setDeviceId] = useState('FISH_FARM_001');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isStoringData, setIsStoringData] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  // Handle device registration
  const handleRegisterDevice = async () => {
    if (!deviceId.trim()) return;
    
    setIsRegistering(true);
    try {
      await registerDevice(deviceId, 'IoT_Fish_Farm_Monitor');
      alert('Device registered successfully on blockchain!');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle sensor data storage
  const handleStoreSensorData = async () => {
    if (!sensorData || !registeredDevice) return;
    
    setIsStoringData(true);
    try {
      await storeSensorData(deviceId, sensorData, 'multi_sensor');
      alert('Sensor data hash stored on blockchain!');
    } catch (err) {
      console.error('Data storage failed:', err);
    } finally {
      setIsStoringData(false);
    }
  };

  // Handle data verification
  const handleVerifyData = async () => {
    if (!sensorData || !registeredDevice) return;
    
    setIsVerifying(true);
    try {
      const result = await verifyDataIntegrity(deviceId, 0, sensorData);
      setVerificationResult(result);
    } catch (err) {
      console.error('Verification failed:', err);
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Shield size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Blockchain Security</h3>
          <p className="text-sm text-gray-600">Ethereum-based data integrity & device authentication</p>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Wallet Connection</h4>
        
        {!isConnected ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Wallet size={16} />
            <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">Wallet Connected</span>
              </div>
              <button
                onClick={disconnectWallet}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Disconnect
              </button>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <div>Address: {walletInfo?.address.slice(0, 6)}...{walletInfo?.address.slice(-4)}</div>
              <div>Balance: {parseFloat(walletInfo?.balance || '0').toFixed(4)} ETH</div>
              <div>Network: {walletInfo?.network}</div>
            </div>
          </div>
        )}
      </div>

      {/* Device Registration */}
      {isConnected && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Device Registration</h4>
          
          {!registeredDevice ? (
            <div className="space-y-3">
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="Enter Device ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleRegisterDevice}
                disabled={isRegistering || !deviceId.trim()}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isRegistering ? 'Registering...' : 'Register Device on Blockchain'}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Device Registered</span>
              </div>
              <div className="text-xs text-blue-600 space-y-1">
                <div>ID: {registeredDevice.deviceId}</div>
                <div>Type: {registeredDevice.deviceType}</div>
                <div>Status: {registeredDevice.isActive ? 'Active' : 'Inactive'}</div>
                <div>Registered: {new Date(registeredDevice.registeredAt * 1000).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Operations */}
      {isConnected && registeredDevice && sensorData && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Data Integrity Operations</h4>
          
          {/* Store Data */}
          <button
            onClick={handleStoreSensorData}
            disabled={isStoringData}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Hash size={16} />
            <span>{isStoringData ? 'Storing...' : 'Store Data Hash on Blockchain'}</span>
          </button>
          
          {/* Verify Data */}
          <button
            onClick={handleVerifyData}
            disabled={isVerifying}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Clock size={16} />
            <span>{isVerifying ? 'Verifying...' : 'Verify Data Integrity'}</span>
          </button>
          
          {/* Verification Result */}
          {verificationResult !== null && (
            <div className={`p-3 rounded-lg border ${
              verificationResult 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {verificationResult ? (
                  <CheckCircle size={16} className="text-green-600" />
                ) : (
                  <AlertTriangle size={16} className="text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  verificationResult ? 'text-green-800' : 'text-red-800'
                }`}>
                  {verificationResult ? 'Data Verified ✓' : 'Data Verification Failed ✗'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>How it works:</strong> Connect your MetaMask wallet, register your IoT device on Ethereum blockchain, 
          store sensor data hashes for tamper-proof verification, and verify data integrity at any time.
        </p>
      </div>
    </div>
  );
};

export default BlockchainPanel;