/**
 * Today's Consumption Chart Component
 * Shows hourly consumption for today with chart placeholder
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateTodayStats } from '@/utils/mockData';
import { useTheme } from '@/contexts/ThemeContext';

export function ConsumptionChart() {
  const todayStats = calculateTodayStats();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Consumption</Text>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartContainer}>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>📈 Hourly Consumption Chart</Text>
          <Text style={styles.chartSubtext}>Line chart coming in Phase 3</Text>
        </View>
      </View>

      {/* Summary Stats */}
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryValue}>{todayStats.totalKwh.toFixed(1)} kWh</Text>
          <Text style={styles.summaryLabel}>Energy</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.summaryValue, { color: Colors.success }]}>
            ₱{todayStats.totalCost.toFixed(2)}
          </Text>
          <Text style={styles.summaryLabel}>Cost</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chartContainer: {
    minHeight: 150,
    marginBottom: 12,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.divider,
    borderStyle: 'dashed',
    padding: 32,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
