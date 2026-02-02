/**
 * Parameters Grid Component
 * 3-column grid showing Voltage, Current, Power Factor
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { generateMockReading } from '@/utils/mockData';
import Colors from '@/constants/Colors';

interface ParametersGridProps {
  deviceId: string;
}

export function ParametersGrid({ deviceId }: ParametersGridProps) {
  const [reading, setReading] = useState(generateMockReading(deviceId));

  useEffect(() => {
    // Update readings every 2 seconds
    const interval = setInterval(() => {
      setReading(generateMockReading(deviceId));
    }, 2000);

    return () => clearInterval(interval);
  }, [deviceId]);

  return (
    <View style={styles.grid}>
      <View style={styles.paramCard}>
        <Text style={styles.value}>{reading.voltageRms.toFixed(1)}</Text>
        <Text style={styles.label}>VOLTAGE (V)</Text>
      </View>

      <View style={styles.paramCard}>
        <Text style={styles.value}>{reading.currentRms.toFixed(2)}</Text>
        <Text style={styles.label}>CURRENT (A)</Text>
      </View>

      <View style={styles.paramCard}>
        <Text style={styles.value}>{reading.powerFactor.toFixed(2)}</Text>
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
