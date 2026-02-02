/**
 * Appliance List Component
 * Shows active appliances with power consumption (Real-Time)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRealtimeData } from '@/contexts/RealtimeDataContext';

export function ApplianceList() {
  const { colors } = useTheme();
  const { appliances } = useRealtimeData();
  const styles = createStyles(colors);

  // Filter to show only appliances that are ON
  const activeAppliances = appliances.filter(a => a.isOn);

  // Format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Appliances ({activeAppliances.length})</Text>
      </View>

      {activeAppliances.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No appliances currently active</Text>
        </View>
      ) : (
        activeAppliances.map((appliance) => (
          <View key={appliance.id} style={styles.applianceItem}>
            <View style={styles.applianceIcon}>
              <Text style={styles.iconText}>{appliance.icon}</Text>
            </View>

            <View style={styles.applianceInfo}>
              <Text style={styles.applianceName}>{appliance.name}</Text>
              <Text style={styles.applianceStatus}>
                {appliance.isOn ? 'ON' : 'OFF'} • {formatDuration(appliance.duration)}
              </Text>
            </View>

            <Text style={styles.appliancePower}>{appliance.power.toFixed(0)} W</Text>
          </View>
        ))
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  applianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  applianceIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.primaryLight,
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
    color: colors.textPrimary,
    marginBottom: 4,
  },
  applianceStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  appliancePower: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
