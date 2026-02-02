/**
 * Theme Context - Dark/Light Mode Support
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  divider: '#E0E0E0',
  border: '#D0D0D0',
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#1565C0',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  background: '#121212',
  surface: '#1E1E1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#666666',
  divider: '#2C2C2C',
  border: '#3C3C3C',
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

  // Load theme preference from storage
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Determine if dark mode is active
  const isDark =
    themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  const value = {
    themeMode,
    isDark,
    setThemeMode,
    colors,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
