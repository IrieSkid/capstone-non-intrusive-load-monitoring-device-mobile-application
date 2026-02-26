import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { RealtimeDataProvider } from '@/contexts/RealtimeDataContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RealtimeDataProvider>
          <RootLayoutContent />
        </RealtimeDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { isDark } = useTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="add-device" options={{ headerShown: false }} />
        <Stack.Screen name="device-details" options={{ headerShown: false }} />
        <Stack.Screen name="device-appliances" options={{ headerShown: false }} />
        <Stack.Screen name="add-appliance" options={{ headerShown: false }} />
        <Stack.Screen name="appliance-details" options={{ headerShown: false }} />
        <Stack.Screen name="admin-users" options={{ title: 'User Management' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}
