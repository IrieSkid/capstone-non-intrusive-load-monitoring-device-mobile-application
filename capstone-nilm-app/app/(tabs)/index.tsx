import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RealTimeMonitor } from '@/components/dashboard/RealTimeMonitor';
import { DeviceStatus } from '@/components/dashboard/DeviceStatus';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { PowerGauge } from '@/components/dashboard/PowerGauge';
import {
  generateMockDevice,
  calculateTodayStats,
  calculateMonthlyStats,
  getComparisonStats,
  generateMockReading,
} from '@/utils/mockData';

export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [mockDevice, setMockDevice] = useState(generateMockDevice(user?.id || 'mock-user'));
  const [currentReading, setCurrentReading] = useState(generateMockReading(mockDevice.id));
  const [todayStats, setTodayStats] = useState(calculateTodayStats());
  const [monthlyStats, setMonthlyStats] = useState(calculateMonthlyStats());
  const [comparison, setComparison] = useState(getComparisonStats());

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [isLoading, user]);

  useEffect(() => {
    // Update mock device when user changes
    if (user) {
      setMockDevice(generateMockDevice(user.id));
    }
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setCurrentReading(generateMockReading(mockDevice.id));
      setTodayStats(calculateTodayStats());
      setMonthlyStats(calculateMonthlyStats());
      setComparison(getComparisonStats());
      setRefreshing(false);
    }, 1000);
  }, [mockDevice]);

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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Welcome, {user.firstName}! 👋</ThemedText>
          <ThemedText style={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatsCard
                title="Today's Usage"
                value={todayStats.totalKwh.toString()}
                unit="kWh"
                icon="bolt.fill"
                iconColor="#FF9500"
                trend={{
                  value: comparison.change,
                  isPositive: !comparison.isIncrease,
                }}
                subtitle={`vs yesterday: ${comparison.previousKwh} kWh`}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatsCard
                title="Today's Cost"
                value={`₱${todayStats.totalCost.toFixed(2)}`}
                icon="Philippine peso sign.circle.fill"
                iconColor="#34C759"
                subtitle="@ ₱11.50/kWh"
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatsCard
                title="This Month"
                value={monthlyStats.totalKwh.toFixed(0)}
                unit="kWh"
                icon="calendar"
                iconColor="#007AFF"
                subtitle={`Day ${monthlyStats.daysElapsed} of ${monthlyStats.daysInMonth}`}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <StatsCard
                title="Projected Bill"
                value={`₱${monthlyStats.projectedCost.toFixed(0)}`}
                icon="chart.line.uptrend.xyaxis"
                iconColor="#FF3B30"
                subtitle={`${monthlyStats.projectedKwh.toFixed(0)} kWh estimated`}
              />
            </View>
          </View>
        </View>

        {/* Power Gauge */}
        <PowerGauge currentWatts={currentReading.powerWatts} maxWatts={5000} />

        {/* Real-Time Monitor */}
        <RealTimeMonitor deviceId={mockDevice.id} />

        {/* Consumption Chart */}
        <ConsumptionChart />

        {/* Device Status */}
        <DeviceStatus device={mockDevice} />

        {/* Info Note */}
        <ThemedView style={styles.infoNote}>
          <ThemedText style={styles.infoText}>
            ℹ️ This dashboard is displaying mock data for testing. When the hardware is ready, it
            will show real-time readings from your IoT device.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  content: {
    padding: 16,
    paddingTop: 60, // Account for status bar
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statsGrid: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoNote: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    marginTop: 16,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 20,
  },
});
