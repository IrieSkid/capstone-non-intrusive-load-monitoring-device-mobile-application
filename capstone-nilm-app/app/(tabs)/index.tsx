import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl, View, Text, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { GradientPowerCard } from '@/components/dashboard/GradientPowerCard';
import { ParametersGrid } from '@/components/dashboard/ParametersGrid';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { ApplianceList } from '@/components/dashboard/ApplianceList';
import {
  generateMockDevice,
  calculateTodayStats,
} from '@/utils/mockData';

export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [mockDevice] = useState(generateMockDevice(user?.id || 'mock-user'));
  const [todayStats, setTodayStats] = useState(calculateTodayStats());

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, user]);

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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Greeting Section */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
          <Text style={styles.greetingName}>{user.firstName} {user.lastName}</Text>
        </View>

        {/* Gradient Power Card */}
        <View style={styles.section}>
          <GradientPowerCard deviceId={mockDevice.id} />
        </View>

        {/* Electrical Parameters Grid */}
        <View style={styles.section}>
          <ParametersGrid deviceId={mockDevice.id} />
        </View>

        {/* Today's Consumption Chart */}
        <View style={styles.section}>
          <ConsumptionChart />
        </View>

        {/* Active Appliances */}
        <View style={styles.section}>
          <ApplianceList />
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoText}>
            ℹ️ This dashboard shows simulated readings based on your actual registered appliances. 
            Toggle appliances on/off to see real-time power consumption changes. When hardware is 
            connected, the system will automatically detect appliance states.
          </Text>
        </View>
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
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoNote: {
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight + '30',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
