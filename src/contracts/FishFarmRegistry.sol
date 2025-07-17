// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * Fish Farm Registry Smart Contract
 * Manages device registration, data integrity, and access control
 */
contract FishFarmRegistry {
    struct Device {
        address owner;
        string deviceId;
        string deviceType;
        bool isActive;
        uint256 registeredAt;
        uint256 lastUpdate;
    }
    
    struct SensorData {
        string deviceId;
        string dataHash;
        uint256 timestamp;
        string sensorType;
        bool verified;
    }
    
    // State variables
    mapping(string => Device) public devices;
    mapping(string => SensorData[]) public deviceSensorData;
    mapping(address => string[]) public ownerDevices;
    
    string[] public allDeviceIds;
    
    // Events
    event DeviceRegistered(string indexed deviceId, address indexed owner, string deviceType);
    event SensorDataStored(string indexed deviceId, string dataHash, uint256 timestamp);
    event DeviceStatusChanged(string indexed deviceId, bool isActive);
    
    // Modifiers
    modifier onlyDeviceOwner(string memory deviceId) {
        require(devices[deviceId].owner == msg.sender, "Not device owner");
        _;
    }
    
    modifier deviceExists(string memory deviceId) {
        require(devices[deviceId].owner != address(0), "Device not registered");
        _;
    }
    
    /**
     * Register a new IoT device
     */
    function registerDevice(
        string memory deviceId,
        string memory deviceType
    ) external {
        require(devices[deviceId].owner == address(0), "Device already registered");
        require(bytes(deviceId).length > 0, "Device ID cannot be empty");
        
        devices[deviceId] = Device({
            owner: msg.sender,
            deviceId: deviceId,
            deviceType: deviceType,
            isActive: true,
            registeredAt: block.timestamp,
            lastUpdate: block.timestamp
        });
        
        ownerDevices[msg.sender].push(deviceId);
        allDeviceIds.push(deviceId);
        
        emit DeviceRegistered(deviceId, msg.sender, deviceType);
    }
    
    /**
     * Store sensor data hash for integrity verification
     */
    function storeSensorData(
        string memory deviceId,
        string memory dataHash,
        string memory sensorType
    ) external onlyDeviceOwner(deviceId) deviceExists(deviceId) {
        require(bytes(dataHash).length > 0, "Data hash cannot be empty");
        
        SensorData memory newData = SensorData({
            deviceId: deviceId,
            dataHash: dataHash,
            timestamp: block.timestamp,
            sensorType: sensorType,
            verified: true
        });
        
        deviceSensorData[deviceId].push(newData);
        devices[deviceId].lastUpdate = block.timestamp;
        
        emit SensorDataStored(deviceId, dataHash, block.timestamp);
    }
    
    /**
     * Update device status (active/inactive)
     */
    function updateDeviceStatus(
        string memory deviceId,
        bool isActive
    ) external onlyDeviceOwner(deviceId) deviceExists(deviceId) {
        devices[deviceId].isActive = isActive;
        devices[deviceId].lastUpdate = block.timestamp;
        
        emit DeviceStatusChanged(deviceId, isActive);
    }
    
    /**
     * Get device information
     */
    function getDevice(string memory deviceId) external view returns (Device memory) {
        return devices[deviceId];
    }
    
    /**
     * Get all sensor data for a device
     */
    function getDeviceSensorData(string memory deviceId) external view returns (SensorData[] memory) {
        return deviceSensorData[deviceId];
    }
    
    /**
     * Get devices owned by an address
     */
    function getOwnerDevices(address owner) external view returns (string[] memory) {
        return ownerDevices[owner];
    }
    
    /**
     * Get total number of registered devices
     */
    function getTotalDevices() external view returns (uint256) {
        return allDeviceIds.length;
    }
    
    /**
     * Verify data integrity by checking hash
     */
    function verifyDataIntegrity(
        string memory deviceId,
        uint256 dataIndex,
        string memory expectedHash
    ) external view returns (bool) {
        require(dataIndex < deviceSensorData[deviceId].length, "Invalid data index");
        
        return keccak256(abi.encodePacked(deviceSensorData[deviceId][dataIndex].dataHash)) == 
               keccak256(abi.encodePacked(expectedHash));
    }
}