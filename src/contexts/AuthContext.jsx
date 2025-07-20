import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';
import { isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(undefined);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, error: null };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userUsername = localStorage.getItem('userUsername');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userUsername');
      dispatch({ type: 'LOGOUT' });
      return;
    }
    if (token && userRole && userUsername) {
      const user = {
        username: userUsername,
        token,
        role: userRole,
      };
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await api.login(credentials.username, credentials.password);
      const user = {
        username: credentials.username,
        token: response.token,
        role: response.role,
      };
      
      // Store in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userUsername', credentials.username);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: 'Login failed. Please check your credentials.' });
      throw error;
    }
  };

  const register = async (data) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      await api.register(data.email, data.password, data.name);
      dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'REGISTER_ERROR', payload: 'Registration failed. Please try again.' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userUsername');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};