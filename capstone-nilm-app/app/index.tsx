/**
 * Root Index - Handles initial navigation
 * Redirects to login or dashboard based on auth state
 */

import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, go to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, go to login
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
