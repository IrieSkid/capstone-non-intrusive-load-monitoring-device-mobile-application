/**
 * Authentication Context
 * Provides global authentication state and methods
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { User, AuthState, UserRegistrationData, UserUpdateData } from '@/types/user.types';
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  getCurrentUserData,
  updateUserProfile,
} from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: 'tenant' | 'landlord' | 'admin',
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch user data from Firestore
        const userData = await getCurrentUserData(firebaseUser.uid);
        if (userData) {
          setAuthState({
            user: userData,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          // User data not found in Firestore
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        // User is signed out
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const user = await loginUser(email, password);
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

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: 'tenant' | 'landlord' | 'admin',
    phoneNumber?: string
  ): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const data: UserRegistrationData = {
        email,
        password,
        firstName,
        lastName,
        role: role || 'tenant',
        phoneNumber,
      };
      const user = await registerUser(data);
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
    if (auth.currentUser) {
      const userData = await getCurrentUserData(auth.currentUser.uid);
      if (userData) {
        setAuthState((prev) => ({
          ...prev,
          user: userData,
        }));
      }
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
