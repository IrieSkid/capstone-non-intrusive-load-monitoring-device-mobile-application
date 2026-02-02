/**
 * Tenant Dashboard
 * Personal energy consumption monitoring for tenants
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { GradientPowerCard } from '@/components/dashboard/GradientPowerCard';
import { ParametersGrid } from '@/components/dashboard/ParametersGrid';
import { ConsumptionChart } from '@/components/dashboard/ConsumptionChart';
import { ApplianceList } from '@/components/dashboard/ApplianceList';
import { generateMockDevice } from '@/utils/mockData';

export function TenantDashboard() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const mockDevice = generateMockDevice(user?.id || 'mock-user');

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Role Badge */}
      <View style={styles.roleBadgeContainer}>
        <View style={styles.roleBadge}>
          <Ionicons name="person" size={14} color={colors.primary} />
          <Text style={styles.roleBadgeText}>Tenant</Text>
        </View>
      </View>

      {/* Gradient Power Card */}
      <View style={styles.section}>
        <GradientPowerCard deviceId={mockDevice.id} />
      </View>

      {/* Electrical Parameters Grid */}
      <View style={styles.section}>
        <ParametersGrid deviceId={mockDevice.id} />
      </View>

      {/* Today's Consumption Chart */}
      <View style={styles.section}>
        <ConsumptionChart />
      </View>

      {/* Active Appliances */}
      <View style={styles.section}>
        <ApplianceList />
      </View>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Monitor your energy consumption in real-time. Toggle appliances on/off 
          to see power changes. Your landlord may have access to view your usage data.
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  roleBadgeContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: colors.primaryLight + '30',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoNote: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight + '20',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
