import { useState, useEffect, useCallback } from 'react';
import { blockchainService, WalletInfo, BlockchainDevice } from '../services/blockchain';
import { SensorData } from '../types/sensor';

/**
 * Custom hook for blockchain integration
 * Manages wallet connection, device registration, and data integrity
 */
export const useBlockchain = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredDevice, setRegisteredDevice] = useState<BlockchainDevice | null>(null);

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const info = await blockchainService.connectWallet();
      setWalletInfo(info);
      
      // Setup event listeners
      blockchainService.setupEventListeners({
        onDeviceRegistered: (deviceId, owner, deviceType) => {
          console.log('Device registered:', { deviceId, owner, deviceType });
        },
        onSensorDataStored: (deviceId, dataHash, timestamp) => {
          console.log('Sensor data stored:', { deviceId, dataHash, timestamp });
        }
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    blockchainService.disconnect();
    blockchainService.removeEventListeners();
    setWalletInfo(null);
    setRegisteredDevice(null);
    setError(null);
  }, []);

  // Register device on blockchain
  const registerDevice = useCallback(async (deviceId: string, deviceType: string) => {
    setError(null);
    
    try {
      const txHash = await blockchainService.registerDevice(deviceId, deviceType);
      console.log('Device registration transaction:', txHash);
      
      // Get device info after registration
      const device = await blockchainService.getDevice(deviceId);
      setRegisteredDevice(device);
      
      return txHash;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Store sensor data on blockchain
  const storeSensorData = useCallback(async (
    deviceId: string, 
    sensorData: SensorData, 
    sensorType: string
  ) => {
    setError(null);
    
    try {
      const txHash = await blockchainService.storeSensorDataHash(deviceId, sensorData, sensorType);
      console.log('Sensor data storage transaction:', txHash);
      return txHash;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Verify data integrity
  const verifyDataIntegrity = useCallback(async (
    deviceId: string, 
    dataIndex: number, 
    sensorData: SensorData
  ) => {
    setError(null);
    
    try {
      const isValid = await blockchainService.verifyDataIntegrity(deviceId, dataIndex, sensorData);
      return isValid;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get device from blockchain
  const getDevice = useCallback(async (deviceId: string) => {
    setError(null);
    
    try {
      const device = await blockchainService.getDevice(deviceId);
      setRegisteredDevice(device);
      return device;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Check connection status on mount
  useEffect(() => {
    const isConnected = blockchainService.getConnectionStatus();
    if (isConnected) {
      // Wallet was previously connected, try to restore connection
      connectWallet();
    }
  }, [connectWallet]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      blockchainService.removeEventListeners();
    };
  }, []);

  return {
    walletInfo,
    isConnecting,
    error,
    registeredDevice,
    connectWallet,
    disconnectWallet,
    registerDevice,
    storeSensorData,
    verifyDataIntegrity,
    getDevice,
    isConnected: !!walletInfo
  };
};