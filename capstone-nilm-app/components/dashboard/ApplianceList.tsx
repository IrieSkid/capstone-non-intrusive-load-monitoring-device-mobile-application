/**
 * Appliance List Component
 * Shows active appliances with power consumption
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

interface Appliance {
  id: string;
  name: string;
  icon: string;
  power: number;
  status: string;
  duration: string;
}

const mockAppliances: Appliance[] = [
  {
    id: '1',
    name: 'Refrigerator',
    icon: '🧊',
    power: 150,
    status: 'ON',
    duration: '2.5 hours',
  },
  {
    id: '2',
    name: 'Air Conditioner',
    icon: '❄️',
    power: 1000,
    status: 'ON',
    duration: '1.2 hours',
  },
  {
    id: '3',
    name: 'Television',
    icon: '📺',
    power: 80,
    status: 'ON',
    duration: '0.5 hours',
  },
];

export function ApplianceList() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Appliances ({mockAppliances.length})</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>

      {mockAppliances.map((appliance) => (
        <View key={appliance.id} style={styles.applianceItem}>
          <View style={styles.applianceIcon}>
            <Text style={styles.iconText}>{appliance.icon}</Text>
          </View>

          <View style={styles.applianceInfo}>
            <Text style={styles.applianceName}>{appliance.name}</Text>
            <Text style={styles.applianceStatus}>
              {appliance.status} • {appliance.duration}
            </Text>
          </View>

          <Text style={styles.appliancePower}>{appliance.power} W</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  viewAll: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  applianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Explicit white background
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  applianceIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 32,
  },
  applianceInfo: {
    flex: 1,
  },
  applianceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  applianceStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  appliancePower: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
