import { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { usePond } from '../contexts/PondContext';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const usePondWebSocket = () => {
  const { updatePondData } = usePond();
  const intervalRef = useRef(null);

  // Mock WebSocket simulation
  useEffect(() => {
    if (USE_MOCK_DATA) {
      intervalRef.current = setInterval(() => {
        const pondIds = [1, 2, 3];
        const randomPondId = pondIds[Math.floor(Math.random() * pondIds.length)];
        
        const mockUpdate = {
          pondId: randomPondId,
          temperature: 25 + Math.random() * 2,
          turbidity: 10 + Math.random() * 3,
          ph: 7 + Math.random() * 0.6,
          waterLevel: 1.4 + Math.random() * 0.3,
          timestamp: new Date().toISOString(),
          verified: Math.random() > 0.1,
        };
        
        updatePondData(mockUpdate);
      }, 5000); // Update every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [updatePondData]);

  // Real WebSocket connection
  const { lastMessage, connectionStatus } = useWebSocket(
    USE_MOCK_DATA ? null : WS_URL,
    {
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          updatePondData(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    }
  );

  return {
    connectionStatus: USE_MOCK_DATA ? 'Open' : connectionStatus,
    lastMessage,
    isConnected: USE_MOCK_DATA ? true : connectionStatus === 'Open',
  };
};