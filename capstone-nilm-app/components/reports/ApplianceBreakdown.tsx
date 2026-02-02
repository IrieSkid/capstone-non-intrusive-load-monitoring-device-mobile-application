/**
 * Appliance Breakdown Component
 * Shows consumption by appliance with pie chart
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import { ApplianceConsumption } from '@/types/report';

interface ApplianceBreakdownProps {
  appliances: ApplianceConsumption[];
}

export function ApplianceBreakdown({ appliances }: ApplianceBreakdownProps) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const screenWidth = Dimensions.get('window').width;

  // Colors for pie chart (contrasting colors)
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

  // Prepare pie chart data (top 5 appliances)
  const topAppliances = appliances.slice(0, 5);
  const pieData = topAppliances.map((appliance, index) => ({
    name: appliance.name,
    population: appliance.totalKwh,
    color: chartColors[index % chartColors.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => colors.primary,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appliance Breakdown</Text>

      {/* Pie Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={screenWidth - 48}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute={false} // Show percentages
        />
      </View>

      {/* Detailed List */}
      <View style={styles.listContainer}>
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
      alignItems: 'center',
      marginBottom: 24,
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
