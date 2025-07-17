import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthScreen from './AuthScreen';
import LoadingScreen from '../LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that protects routes requiring authentication
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
};

export default AuthGuard;