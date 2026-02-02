import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl, View, Text, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { useRBAC } from '@/contexts/RBACContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TenantDashboard } from '@/components/dashboard/TenantDashboard';
import { LandlordDashboard } from '@/components/dashboard/LandlordDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { calculateTodayStats } from '@/utils/mockData';

export default function HomeScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: rbacLoading } = useRBAC();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [todayStats, setTodayStats] = useState(calculateTodayStats());

  const isLoading = authLoading || rbacLoading;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setTodayStats(calculateTodayStats());
      setRefreshing(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Render role-specific dashboard
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      
      {/* Greeting Section */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>{getGreeting()}</Text>
        <Text style={styles.greetingName}>{user.firstName} {user.lastName}</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Route to appropriate dashboard based on role */}
        {role === 'tenant' && <TenantDashboard />}
        {role === 'landlord' && <LandlordDashboard />}
        {role === 'admin' && <AdminDashboard />}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  greeting: {
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greetingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
