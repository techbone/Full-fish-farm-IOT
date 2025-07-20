import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const PondContext = createContext(undefined);

const SENSOR_IDS = ['fish_tank_1', 'fish_tank_2'];

const pondReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, ponds: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SELECT_POND':
      return { ...state, selectedPond: action.payload };
    case 'UPDATE_POND': {
      const updatedPonds = state.ponds.map(pond =>
        pond.sensorId === action.payload.sensorId
          ? { ...pond, ...action.payload }
          : pond
      );
      return {
        ...state,
        ponds: updatedPonds,
        selectedPond: state.selectedPond?.sensorId === action.payload.sensorId
          ? updatedPonds.find(p => p.sensorId === action.payload.sensorId) || state.selectedPond
          : state.selectedPond,
      };
    }
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...(state.alerts || [])] };
    default:
      return state;
  }
};

const initialState = {
  ponds: JSON.parse(localStorage.getItem('ponds') || '[]'),
  selectedPond: null,
  loading: false,
  error: null,
  alerts: [],
};

export const PondProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pondReducer, initialState);
  const { user } = useAuth();

  // Save ponds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ponds', JSON.stringify(state.ponds));
  }, [state.ponds]);

  const fetchAllSensorData = async () => {
    if (!user?.token) return;
    dispatch({ type: 'FETCH_START' });
    try {
      const pondData = await Promise.all(
        SENSOR_IDS.map(async (sensorId) => {
          const data = await api.getSensorData(sensorId);
          // Use the latest data point (last in array)
          return Array.isArray(data) && data.length > 0
            ? { ...data[data.length - 1], sensorId }
            : { ...data, sensorId };
        })
      );
      dispatch({ type: 'FETCH_SUCCESS', payload: pondData });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch sensor data' });
    }
  };

  const selectPond = (pond) => {
    dispatch({ type: 'SELECT_POND', payload: pond });
  };

  const updatePondData = (message) => {
    dispatch({ type: 'UPDATE_POND', payload: message });
  };

  const addAlert = (alert) => {
    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  useEffect(() => {
    if (user?.token) {
      fetchAllSensorData();
    }
  }, [user?.token]);

  return (
    <PondContext.Provider value={{
      ...state,
      fetchAllSensorData,
      selectPond,
      updatePondData,
      addAlert,
    }}>
      {children}
    </PondContext.Provider>
  );
};

export const usePond = () => {
  const context = useContext(PondContext);
  if (context === undefined) {
    throw new Error('usePond must be used within a PondProvider');
  }
  return context;
};