/**
 * Appliance Breakdown Component
 * Shows consumption by appliance with visual breakdown
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ApplianceConsumption } from '@/types/report';

interface ApplianceBreakdownProps {
  appliances: ApplianceConsumption[];
}

export function ApplianceBreakdown({ appliances }: ApplianceBreakdownProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Colors for visualization
  const chartColors = [
    '#2196F3', // Blue
    '#FF9800', // Orange
    '#4CAF50', // Green
    '#F44336', // Red
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FFEB3B', // Yellow
    '#795548', // Brown
  ];

  // Top appliances for pie-style visualization
  const topAppliances = appliances.slice(0, 5);
  const totalKwh = appliances.reduce((sum, a) => sum + a.totalKwh, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appliance Breakdown</Text>

      {/* Horizontal Bar Chart */}
      <View style={styles.chartContainer}>
        {topAppliances.map((appliance, index) => (
          <View key={appliance.applianceId} style={styles.chartRow}>
            <View style={styles.chartLabel}>
              <Text style={styles.applianceIconSmall}>{appliance.icon}</Text>
              <Text style={styles.chartLabelText} numberOfLines={1}>
                {appliance.name}
              </Text>
            </View>
            <View style={styles.chartBarContainer}>
              <View
                style={[
                  styles.chartBar,
                  {
                    width: `${appliance.percentage}%`,
                    backgroundColor: chartColors[index],
                  },
                ]}
              />
              <Text style={styles.chartPercentage}>{appliance.percentage}%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Detailed List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>All Appliances</Text>
        {appliances.map((appliance, index) => (
          <View key={appliance.applianceId} style={styles.applianceItem}>
            <View style={styles.applianceHeader}>
              <View style={styles.applianceInfo}>
                <Text style={styles.applianceIcon}>{appliance.icon}</Text>
                <View style={styles.applianceDetails}>
                  <Text style={styles.applianceName}>{appliance.name}</Text>
                  <Text style={styles.applianceUsage}>
                    {appliance.averageHoursPerDay}h/day · {appliance.percentage}% of total
                  </Text>
                  <Text style={styles.applianceElectrical}>
                    {appliance.avgPower?.toFixed(0) || 0}W · {appliance.avgVoltage?.toFixed(0) || 220}V · {appliance.avgCurrent?.toFixed(2) || 0}A · PF: {appliance.avgPowerFactor?.toFixed(2) || 0.90}
                  </Text>
                </View>
              </View>
              
              <View style={styles.applianceConsumption}>
                <Text style={styles.consumptionValue}>{appliance.totalKwh.toFixed(1)} kWh</Text>
                <Text style={styles.consumptionCost}>₱{appliance.totalCost.toFixed(2)}</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${appliance.percentage}%`,
                    backgroundColor: chartColors[index % chartColors.length],
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Monthly Projection */}
      <View style={styles.projectionSection}>
        <Text style={styles.projectionTitle}>Estimated Monthly Costs</Text>
        {appliances.slice(0, 3).map(appliance => (
          <View key={`monthly-${appliance.applianceId}`} style={styles.projectionItem}>
            <Text style={styles.projectionIcon}>{appliance.icon}</Text>
            <Text style={styles.projectionName}>{appliance.name}</Text>
            <Text style={styles.projectionValue}>₱{appliance.estimatedMonthlyCost.toFixed(2)}/mo</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    chartContainer: {
      gap: 12,
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    chartRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    chartLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 120,
      gap: 8,
    },
    applianceIconSmall: {
      fontSize: 20,
    },
    chartLabelText: {
      fontSize: 12,
      color: colors.textPrimary,
      fontWeight: '600',
      flex: 1,
    },
    chartBarContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    chartBar: {
      height: 24,
      borderRadius: 4,
      minWidth: 20,
    },
    chartPercentage: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textPrimary,
      width: 40,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    listContainer: {
      gap: 16,
    },
    applianceItem: {
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    applianceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    applianceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    applianceIcon: {
      fontSize: 32,
    },
    applianceDetails: {
      flex: 1,
    },
    applianceName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    applianceUsage: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    applianceElectrical: {
      fontSize: 10,
      color: colors.primary,
      marginTop: 2,
      fontWeight: '500',
    },
    applianceConsumption: {
      alignItems: 'flex-end',
    },
    consumptionValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 2,
    },
    consumptionCost: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.background,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    projectionSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    projectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    projectionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      gap: 12,
    },
    projectionIcon: {
      fontSize: 20,
    },
    projectionName: {
      flex: 1,
      fontSize: 13,
      color: colors.textPrimary,
    },
    projectionValue: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.success,
    },
  });
