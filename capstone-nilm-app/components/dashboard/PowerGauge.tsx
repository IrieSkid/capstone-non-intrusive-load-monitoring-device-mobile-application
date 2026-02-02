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
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D0D0D0',
    borderBottomWidth: 0,
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
    color: '#000000',
  },
  unit: {
    fontSize: 16,
    color: '#555555',
    fontWeight: '600',
  },
  percentage: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '500',
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
    fontWeight: '600',
    color: '#333333',
  },
});
