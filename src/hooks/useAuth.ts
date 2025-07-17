import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService, UserProfile } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setError(null);
      
      if (user) {
        // Fetch user profile from localStorage
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string, farmName?: string) => {
    setError(null);
    const result = await authService.signUp(email, password, displayName, farmName);
    if (!result.success) {
      setError(result.error || 'Sign up failed');
    }
    return result;
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    const result = await authService.signIn(email, password);
    if (!result.success) {
      setError(result.error || 'Sign in failed');
    }
    return result;
  };

  const signOut = async () => {
    setError(null);
    const result = await authService.signOut();
    if (!result.success) {
      setError(result.error || 'Sign out failed');
    }
    return result;
  };

  const deleteAccount = async () => {
    setError(null);
    const result = await authService.deleteAccount();
    if (!result.success) {
      setError(result.error || 'Account deletion failed');
    }
    return result;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return false;
    
    setError(null);
    const success = await authService.updateUserProfile(user.uid, updates);
    if (success && userProfile) {
      setUserProfile({ ...userProfile, ...updates });
    }
    return success;
  };

  return {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    deleteAccount,
    updateProfile,
    isAuthenticated: !!user
  };
};