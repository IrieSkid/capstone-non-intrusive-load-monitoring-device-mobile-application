/**
 * Consumption History Component
 * Shows historical consumption trends and comparisons
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface HistoricalDataPoint {
  period: string;
  kwh: number;
  cost: number;
  change: number; // percentage change from previous
}

interface ConsumptionHistoryProps {
  data: HistoricalDataPoint[];
  period: 'daily' | 'weekly' | 'monthly';
}

export function ConsumptionHistory({ data, period }: ConsumptionHistoryProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📈 Consumption History</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No historical data available yet.</Text>
          <Text style={styles.emptyHint}>
            Start using your devices to build consumption history.
          </Text>
        </View>
      </View>
    );
  }

  // Calculate average and total
  const totalKwh = data.reduce((sum, d) => sum + d.kwh, 0);
  const avgKwh = totalKwh / data.length;
  const totalCost = data.reduce((sum, d) => sum + d.cost, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 Consumption History</Text>
        <Text style={styles.subtitle}>Last {data.length} {period} periods</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={styles.summaryValue}>{avgKwh.toFixed(1)} kWh</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>{totalKwh.toFixed(1)} kWh</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Cost</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            ₱{totalCost.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Historical List */}
      <ScrollView 
        style={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        {data.map((item, index) => (
          <View key={`history-${index}`} style={styles.historyItem}>
            <View style={styles.historyInfo}>
              <Text style={styles.historyPeriod}>{item.period}</Text>
              <Text style={styles.historyKwh}>{item.kwh.toFixed(1)} kWh</Text>
            </View>
            
            <View style={styles.historyRight}>
              <Text style={styles.historyCost}>₱{item.cost.toFixed(2)}</Text>
              {item.change !== 0 && (
                <View style={[
                  styles.changeIndicator,
                  { backgroundColor: item.change > 0 ? colors.error + '20' : colors.success + '20' }
                ]}>
                  <Text style={[
                    styles.changeText,
                    { color: item.change > 0 ? colors.error : colors.success }
                  ]}>
                    {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change).toFixed(1)}%
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Trend Indicator */}
      {data.length >= 2 && (
        <View style={styles.trendSection}>
          <Text style={styles.trendTitle}>Trend Analysis</Text>
          {renderTrendInsight(data, colors)}
        </View>
      )}
    </View>
  );
}

function renderTrendInsight(data: HistoricalDataPoint[], colors: any) {
  // Calculate trend from last 3 periods
  const recentData = data.slice(-3);
  const trend = recentData.reduce((sum, d) => sum + d.change, 0) / recentData.length;

  let icon = '📊';
  let message = '';
  let color = colors.textPrimary;

  if (trend > 5) {
    icon = '⚠️';
    message = 'Consumption is increasing. Consider reviewing appliance usage.';
    color = colors.error;
  } else if (trend < -5) {
    icon = '✅';
    message = 'Great! Consumption is decreasing. Keep up the good work!';
    color = colors.success;
  } else {
    icon = '📊';
    message = 'Consumption is stable. Maintain your current usage patterns.';
    color = colors.textSecondary;
  }

  const styles = StyleSheet.create({
    trendInsight: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${color}10`,
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: color,
    },
    trendIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    trendMessage: {
      flex: 1,
      fontSize: 13,
      color,
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.trendInsight}>
      <Text style={styles.trendIcon}>{icon}</Text>
      <Text style={styles.trendMessage}>{message}</Text>
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
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    summaryRow: {
      flexDirection: 'row',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    list: {
      maxHeight: 300,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    historyInfo: {
      flex: 1,
    },
    historyPeriod: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    historyKwh: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    historyRight: {
      alignItems: 'flex-end',
      gap: 4,
    },
    historyCost: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    changeIndicator: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    changeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    trendSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    trendTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    emptyState: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyHint: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
