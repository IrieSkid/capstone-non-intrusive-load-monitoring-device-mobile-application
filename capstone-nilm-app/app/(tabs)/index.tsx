import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl, View, Text, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { GradientPowerCard } from '@/components/dashboard/GradientPowerCard';
import { ParametersGrid } from '@/components/dashboard/ParametersGrid';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { ApplianceList } from '@/components/dashboard/ApplianceList';
import Colors from '@/constants/Colors';
import {
  generateMockDevice,
  calculateTodayStats,
} from '@/utils/mockData';

export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
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

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
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
            ℹ️ This dashboard is displaying mock data for testing. When the hardware is ready, it
            will show real-time readings from your IoT device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    // paddingBottom is set dynamically in the component
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
  },
  greeting: {
    padding: 16,
    backgroundColor: Colors.surface,
  },
  greetingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
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
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    fontSize: 13,
    color: Colors.primaryDark,
    lineHeight: 20,
  },
});
