import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { usePond } from '../contexts/PondContext';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export const usePondWebSocket = () => {
  const { updatePondData, addAlert } = usePond();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(WS_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log(`Connected to WebSocket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    });

    socket.on('sensorData', (data) => {
      updatePondData(data);
      console.log('Received sensor data:', data);
    });

    socket.on('alert', (alert) => {
      addAlert(alert);
      console.log('Received alert:', alert);
    });

    return () => {
      socket.disconnect();
    };
  }, [updatePondData, addAlert]);

  const joinSensorRoom = useCallback((sensorId) => {
    socketRef.current?.emit('joinSensor', sensorId);
  }, []);

  const leaveSensorRoom = useCallback((sensorId) => {
    socketRef.current?.emit('leaveSensor', sensorId);
  }, []);

  return {
    joinSensorRoom,
    leaveSensorRoom,
    isConnected,
    socket: socketRef.current,
  };
};