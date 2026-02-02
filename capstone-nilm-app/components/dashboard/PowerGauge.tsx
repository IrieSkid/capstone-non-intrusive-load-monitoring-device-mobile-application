/**
 * Power Gauge Component
 * Circular gauge showing current power consumption
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface PowerGaugeProps {
  currentWatts: number;
  maxWatts?: number;
}

export function PowerGauge({ currentWatts, maxWatts = 5000 }: PowerGaugeProps) {
  const percentage = Math.min((currentWatts / maxWatts) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const getColor = (percent: number) => {
    if (percent < 50) return '#4CAF50';
    if (percent < 75) return '#FF9800';
    return '#F44336';
  };

  const color = getColor(percentage);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        ⚡ Current Power
      </ThemedText>

      <View style={styles.gaugeContainer}>
        {/* Gauge Background */}
        <View style={styles.gaugeBg} />

        {/* Gauge Fill */}
        <View
          style={[
            styles.gaugeFill,
            {
              backgroundColor: color,
              transform: [{ rotate: `${rotation}deg` }],
            },
          ]}
        />

        {/* Center Circle */}
        <View style={styles.center}>
          <ThemedText style={styles.mainValue}>{currentWatts.toFixed(0)}</ThemedText>
          <ThemedText style={styles.unit}>Watts</ThemedText>
          <ThemedText style={styles.percentage}>{percentage.toFixed(0)}%</ThemedText>
        </View>
      </View>

      <View style={styles.labels}>
        <ThemedText style={styles.label}>0 W</ThemedText>
        <ThemedText style={styles.label}>{maxWatts} W</ThemedText>
      </View>

      <View style={styles.status}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <ThemedText style={styles.statusText}>
          {percentage < 50 ? 'Normal' : percentage < 75 ? 'Moderate' : 'High'} Usage
        </ThemedText>
      </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  gaugeContainer: {
    width: 200,
    height: 100,
    position: 'relative',
    marginVertical: 20,
  },
  gaugeBg: {
    position: 'absolute',
    width: 200,
    height: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  gaugeFill: {
    position: 'absolute',
    width: 200,
    height: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transformOrigin: 'bottom center',
  },
  center: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  mainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  unit: {
    fontSize: 14,
    opacity: 0.7,
  },
  percentage: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
