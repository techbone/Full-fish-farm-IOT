import { ethers } from 'ethers';
import { SensorData } from '../types/sensor';

/**
 * Blockchain service for Ethereum integration
 * Handles Web3 wallet connection, smart contract interaction, and data integrity
 */

// Contract configuration
const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A'; // Replace with deployed contract
const CONTRACT_ABI = [
  "function registerDevice(string deviceId, string deviceType) external",
  "function storeSensorData(string deviceId, string dataHash, string sensorType) external",
  "function updateDeviceStatus(string deviceId, bool isActive) external",
  "function getDevice(string deviceId) external view returns (tuple(address owner, string deviceId, string deviceType, bool isActive, uint256 registeredAt, uint256 lastUpdate))",
  "function getDeviceSensorData(string deviceId) external view returns (tuple(string deviceId, string dataHash, uint256 timestamp, string sensorType, bool verified)[])",
  "function verifyDataIntegrity(string deviceId, uint256 dataIndex, string expectedHash) external view returns (bool)",
  "event DeviceRegistered(string indexed deviceId, address indexed owner, string deviceType)",
  "event SensorDataStored(string indexed deviceId, string dataHash, uint256 timestamp)"
];

export interface BlockchainDevice {
  owner: string;
  deviceId: string;
  deviceType: string;
  isActive: boolean;
  registeredAt: number;
  lastUpdate: number;
}

export interface BlockchainSensorData {
  deviceId: string;
  dataHash: string;
  timestamp: number;
  sensorType: string;
  verified: boolean;
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<WalletInfo> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask to use blockchain features.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Initialize contract
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      
      // Get wallet info
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();
      
      this.isConnected = true;

      return {
        address,
        balance: ethers.formatEther(balance),
        network: network.name
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.isConnected = false;
  }

  /**
   * Check if wallet is connected
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Register IoT device on blockchain
   */
  async registerDevice(deviceId: string, deviceType: string): Promise<string> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.registerDevice(deviceId, deviceType);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  /**
   * Store sensor data hash on blockchain for integrity verification
   */
  async storeSensorDataHash(
    deviceId: string, 
    sensorData: SensorData, 
    sensorType: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      // Create hash of sensor data
      const dataString = JSON.stringify({
        value: sensorData.temperature.value,
        timestamp: sensorData.temperature.timestamp,
        ph: sensorData.ph.value,
        waterLevel: sensorData.waterLevel.value,
        humidity: sensorData.humidity.value
      });
      
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

      const tx = await this.contract.storeSensorData(deviceId, dataHash, sensorType);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to store sensor data:', error);
      throw error;
    }
  }

  /**
   * Get device information from blockchain
   */
  async getDevice(deviceId: string): Promise<BlockchainDevice> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const device = await this.contract.getDevice(deviceId);
      return {
        owner: device.owner,
        deviceId: device.deviceId,
        deviceType: device.deviceType,
        isActive: device.isActive,
        registeredAt: Number(device.registeredAt),
        lastUpdate: Number(device.lastUpdate)
      };
    } catch (error) {
      console.error('Failed to get device:', error);
      throw error;
    }
  }

  /**
   * Get all sensor data for a device
   */
  async getDeviceSensorData(deviceId: string): Promise<BlockchainSensorData[]> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const data = await this.contract.getDeviceSensorData(deviceId);
      return data.map((item: any) => ({
        deviceId: item.deviceId,
        dataHash: item.dataHash,
        timestamp: Number(item.timestamp),
        sensorType: item.sensorType,
        verified: item.verified
      }));
    } catch (error) {
      console.error('Failed to get sensor data:', error);
      throw error;
    }
  }

  /**
   * Verify data integrity
   */
  async verifyDataIntegrity(
    deviceId: string, 
    dataIndex: number, 
    sensorData: SensorData
  ): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const dataString = JSON.stringify({
        value: sensorData.temperature.value,
        timestamp: sensorData.temperature.timestamp,
        ph: sensorData.ph.value,
        waterLevel: sensorData.waterLevel.value,
        humidity: sensorData.humidity.value
      });
      
      const expectedHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
      
      return await this.contract.verifyDataIntegrity(deviceId, dataIndex, expectedHash);
    } catch (error) {
      console.error('Failed to verify data integrity:', error);
      throw error;
    }
  }

  /**
   * Update device status
   */
  async updateDeviceStatus(deviceId: string, isActive: boolean): Promise<string> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.updateDeviceStatus(deviceId, isActive);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Failed to update device status:', error);
      throw error;
    }
  }

  /**
   * Listen to blockchain events
   */
  setupEventListeners(callbacks: {
    onDeviceRegistered?: (deviceId: string, owner: string, deviceType: string) => void;
    onSensorDataStored?: (deviceId: string, dataHash: string, timestamp: number) => void;
  }): void {
    if (!this.contract) return;

    if (callbacks.onDeviceRegistered) {
      this.contract.on('DeviceRegistered', callbacks.onDeviceRegistered);
    }

    if (callbacks.onSensorDataStored) {
      this.contract.on('SensorDataStored', callbacks.onSensorDataStored);
    }
  }

  /**
   * Remove event listeners
   */
  removeEventListeners(): void {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}