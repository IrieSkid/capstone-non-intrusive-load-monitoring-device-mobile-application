/**
 * Real-Time Monitor Component
 * Displays live electrical readings (voltage, current, power)
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { generateMockReading } from '@/utils/mockData';
import { RealTimeReading } from '@/types/readings.types';

interface RealTimeMonitorProps {
  deviceId: string;
}

export function RealTimeMonitor({ deviceId }: RealTimeMonitorProps) {
  const [reading, setReading] = useState<RealTimeReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial reading
    setReading(generateMockReading(deviceId));
    setIsLoading(false);

    // Update readings every 2 seconds to simulate real-time
    const interval = setInterval(() => {
      setReading(generateMockReading(deviceId));
    }, 2000);

    return () => clearInterval(interval);
  }, [deviceId]);

  if (isLoading || !reading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        ⚡ Real-Time Monitoring
      </ThemedText>

      <View style={styles.grid}>
        {/* Voltage */}
        <View style={styles.reading}>
          <ThemedText style={styles.label}>Voltage</ThemedText>
          <ThemedText style={styles.value}>{reading.voltageRms}</ThemedText>
          <ThemedText style={styles.unit}>V</ThemedText>
        </View>

        {/* Current */}
        <View style={styles.reading}>
          <ThemedText style={styles.label}>Current</ThemedText>
          <ThemedText style={styles.value}>{reading.currentRms}</ThemedText>
          <ThemedText style={styles.unit}>A</ThemedText>
        </View>

        {/* Power */}
        <View style={styles.reading}>
          <ThemedText style={styles.label}>Power</ThemedText>
          <ThemedText style={styles.value}>{reading.powerWatts.toFixed(0)}</ThemedText>
          <ThemedText style={styles.unit}>W</ThemedText>
        </View>

        {/* Power Factor */}
        <View style={styles.reading}>
          <ThemedText style={styles.label}>Power Factor</ThemedText>
          <ThemedText style={styles.value}>{reading.powerFactor}</ThemedText>
          <ThemedText style={styles.unit}>PF</ThemedText>
        </View>

        {/* Frequency */}
        <View style={styles.reading}>
          <ThemedText style={styles.label}>Frequency</ThemedText>
          <ThemedText style={styles.value}>{reading.frequency}</ThemedText>
          <ThemedText style={styles.unit}>Hz</ThemedText>
        </View>

        {/* Energy */}
        <View style={styles.reading}>
          <ThemedText style={styles.label}>Energy</ThemedText>
          <ThemedText style={styles.value}>{reading.energyKwh}</ThemedText>
          <ThemedText style={styles.unit}>kWh</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.timestamp}>
        Last updated: {reading.recordedAt.toLocaleTimeString()}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reading: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  unit: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 12,
  },
});
