/**
 * Parameters Grid Component
 * 3-column grid showing Voltage, Current, Power Factor (Real-Time)
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRealtimeData } from '@/contexts/RealtimeDataContext';
import Colors from '@/constants/Colors';

interface ParametersGridProps {
  deviceId: string;
}

export function ParametersGrid({ deviceId }: ParametersGridProps) {
  const { currentReading } = useRealtimeData();

  // Use real-time data or show loading state
  const voltage = currentReading?.voltage || 0;
  const current = currentReading?.current || 0;
  const powerFactor = currentReading?.powerFactor || 0;

  return (
    <View style={styles.grid}>
      <View style={styles.paramCard}>
        <Text style={styles.value}>{voltage.toFixed(1)}</Text>
        <Text style={styles.label}>VOLTAGE (V)</Text>
      </View>

      <View style={styles.paramCard}>
        <Text style={styles.value}>{current.toFixed(2)}</Text>
        <Text style={styles.label}>CURRENT (A)</Text>
      </View>

      <View style={styles.paramCard}>
        <Text style={styles.value}>{powerFactor.toFixed(2)}</Text>
        <Text style={styles.label}>POWER FACTOR</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  paramCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
