/**
 * Gradient Power Card Component
 * Shows current power consumption with gradient background
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateMockReading } from '@/utils/mockData';
import Colors from '@/constants/Colors';

interface GradientPowerCardProps {
  deviceId: string;
}

export function GradientPowerCard({ deviceId }: GradientPowerCardProps) {
  const [currentWatts, setCurrentWatts] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Initial reading
    const reading = generateMockReading(deviceId);
    setCurrentWatts(reading.powerWatts);
    setLastUpdate(new Date());

    // Update every 2 seconds
    const interval = setInterval(() => {
      const reading = generateMockReading(deviceId);
      setCurrentWatts(reading.powerWatts);
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [deviceId]);

  const getStatus = () => {
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
