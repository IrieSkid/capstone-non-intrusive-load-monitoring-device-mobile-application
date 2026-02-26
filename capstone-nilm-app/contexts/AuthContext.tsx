/**
 * Authentication Context
 * Provides global authentication state and methods using MySQL
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState, UserRegistrationData, UserUpdateData } from '@/types/user.types';
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  getCurrentUserData,
  updateUserProfile,
  verifyToken,
} from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: UserRegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_ID_KEY = '@user_id';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for stored token on mount
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userId = await AsyncStorage.getItem(USER_ID_KEY);

      if (token && userId) {
        // Verify token and get user
        const user = await verifyToken(token);
        if (user) {
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }

      // No valid token found
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error checking stored auth:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const { user, token } = await loginUser(email, password);
      
      // Store token and user ID
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_ID_KEY, user.id);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const register = async (data: UserRegistrationData): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const user = await registerUser(data);
      
      // Auto-login after registration
      const { token } = await loginUser(data.email, data.password);
      
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_ID_KEY, user.id);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await resetPassword(email);
  };

  const updateProfile = async (data: UserUpdateData): Promise<void> => {
    if (!authState.user) {
      throw new Error('No user logged in');
    }

    try {
      await updateUserProfile(authState.user.id, data);
      // Refresh user data
      await refreshUser();
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!authState.user) {
      return;
    }

    try {
      const userData = await getCurrentUserData(authState.user.id);
      if (userData) {
        setAuthState((prev) => ({
          ...prev,
          user: userData,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    sendPasswordReset,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
