import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const PondContext = createContext(undefined);

const pondReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, ponds: action.payload, error: null };
    case 'FETCH_ERROR':
    case 'COMMAND_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SELECT_POND':
      return { ...state, selectedPond: action.payload };
    case 'UPDATE_POND':
      const updatedPonds = state.ponds.map(pond =>
        pond.id === action.payload.pondId
          ? {
              ...pond,
              temperature: action.payload.temperature,
              turbidity: action.payload.turbidity,
              ph: action.payload.ph,
              waterLevel: action.payload.waterLevel,
              lastUpdated: action.payload.timestamp || new Date().toISOString(),
              verified: action.payload.verified,
            }
          : pond
      );
      return {
        ...state,
        ponds: updatedPonds,
        selectedPond: state.selectedPond?.id === action.payload.pondId
          ? updatedPonds.find(p => p.id === action.payload.pondId) || state.selectedPond
          : state.selectedPond,
      };
    case 'COMMAND_SUCCESS':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  ponds: [],
  selectedPond: null,
  loading: false,
  error: null,
};

export const PondProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pondReducer, initialState);
  const { user } = useAuth();

  const fetchPonds = async () => {
    if (!user?.token) return;
    
    dispatch({ type: 'FETCH_START' });
    try {
      const ponds = await api.getPonds(user.token);
      dispatch({ type: 'FETCH_SUCCESS', payload: ponds });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch pond data' });
    }
  };

  const selectPond = (pond) => {
    dispatch({ type: 'SELECT_POND', payload: pond });
  };

  const updatePondData = (message) => {
    dispatch({ type: 'UPDATE_POND', payload: message });
  };

  const sendCommand = async (pondId, command) => {
    if (!user?.token || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    try {
      await api.sendCommand(pondId, command, user.token);
      dispatch({ type: 'COMMAND_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'COMMAND_ERROR', payload: 'Failed to send command' });
      throw error;
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchPonds();
    }
  }, [user?.token]);

  return (
    <PondContext.Provider value={{
      ...state,
      fetchPonds,
      selectPond,
      updatePondData,
      sendCommand,
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