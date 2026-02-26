/**
 * Appliance List Component
 * Shows all appliances with toggle controls for simulation (Real-Time)
 */

import { useRealtimeData } from '@/contexts/RealtimeDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export function ApplianceList() {
  const { colors } = useTheme();
  const { appliances, toggleAppliance } = useRealtimeData();
  const styles = createStyles(colors);

  // Show all appliances for simulation control
  const activeAppliances = appliances.filter(a => a.isOn);
  const inactiveAppliances = appliances.filter(a => !a.isOn);

  // Format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 1) return '< 1m';
    if (minutes < 60) return `${Math.floor(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleToggle = async (applianceId: string) => {
    await toggleAppliance(applianceId);
  };

  const renderAppliance = (appliance: any) => (
    <View key={appliance.id} style={styles.applianceItem}>
      <View style={[
        styles.applianceIcon,
        { backgroundColor: appliance.isOn ? colors.success + '20' : colors.divider }
      ]}>
        <Text style={styles.iconText}>{appliance.icon}</Text>
      </View>

      <View style={styles.applianceInfo}>
        <Text style={styles.applianceName}>{appliance.name}</Text>
        <Text style={styles.applianceStatus}>
          {appliance.isOn ? (
            <>
              <Text style={{ color: colors.success, fontWeight: '600' }}>ON</Text> • {formatDuration(appliance.duration)}
            </>
          ) : (
            <Text style={{ color: colors.textSecondary }}>OFF</Text>
          )}
        </Text>
        {appliance.isOn && (
          <Text style={styles.applianceElectrical}>
            {appliance.power.toFixed(0)}W • {appliance.voltage.toFixed(0)}V • {appliance.current.toFixed(2)}A • PF: {appliance.powerFactor.toFixed(2)}
          </Text>
        )}
      </View>

      <Switch
        value={appliance.isOn}
        onValueChange={() => handleToggle(appliance.id)}
        trackColor={{ true: colors.success, false: colors.divider }}
        thumbColor={appliance.isOn ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Appliance Simulation ({activeAppliances.length}/{appliances.length} ON)
        </Text>
      </View>

      <View style={styles.sectionNote}>
        <Text style={styles.sectionNoteText}>
          Toggle appliances to simulate real-time power consumption
        </Text>
      </View>

      {appliances.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No appliances found. Add appliances from Devices tab.</Text>
        </View>
      ) : (
        <>
          {/* Active Appliances */}
          {activeAppliances.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>ACTIVE ({activeAppliances.length})</Text>
              {activeAppliances.map(renderAppliance)}
            </>
          )}

          {/* Inactive Appliances */}
          {inactiveAppliances.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>INACTIVE ({inactiveAppliances.length})</Text>
              {inactiveAppliances.map(renderAppliance)}
            </>
          )}
        </>
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
  applianceElectrical: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '500',
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionNote: {
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sectionNoteText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
