/**
 * Gradient Power Card Component
 * Shows current power consumption with gradient background (Real-Time)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRealtimeData } from '@/contexts/RealtimeDataContext';
import Colors from '@/constants/Colors';

interface GradientPowerCardProps {
  deviceId: string;
}

export function GradientPowerCard({ deviceId }: GradientPowerCardProps) {
  const { currentReading, isConnected } = useRealtimeData();

  const currentWatts = currentReading?.power || 0;
  const lastUpdate = currentReading?.timestamp || new Date();

  const getStatus = () => {
    if (!isConnected) return '🔌 Connecting...';
    if (currentWatts > 2000) return '⚡ High Load';
    if (currentWatts > 1000) return '⚡ Active';
    return '⚡ Normal';
  };

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      {/* Connection Status Indicator */}
      <View style={styles.connectionIndicator}>
        <View style={[styles.connectionDot, { backgroundColor: isConnected ? '#4CAF50' : '#FFA726' }]} />
        <Text style={styles.connectionText}>{isConnected ? 'Live' : 'Connecting'}</Text>
      </View>

      <Text style={styles.label}>CURRENT POWER</Text>
      <Text style={styles.value}>{currentWatts.toFixed(0)}</Text>
      <Text style={styles.unit}>Watts</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{getStatus()}</Text>
      </View>
      <Text style={styles.timestamp}>Last updated: {lastUpdate.toLocaleTimeString()}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  connectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  container: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  value: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 16,
  },
  unit: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
