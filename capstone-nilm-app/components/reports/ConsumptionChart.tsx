/**
 * Consumption Chart Component
 * Simple bar chart showing consumption over time
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ConsumptionDataPoint } from '@/types/report';

interface ConsumptionChartProps {
  title: string;
  data: ConsumptionDataPoint[];
  unit?: string;
}

export function ConsumptionChartComponent({ title, data, unit = 'kWh' }: ConsumptionChartProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Ensure data is valid
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.noData}>No data available</Text>
      </View>
    );
  }

  // Find max value for scaling (safely handle undefined values)
  const maxValue = Math.max(...data.map(d => d.value || 0));

  // Sample data for display (show every nth item if too many)
  const displayData = data.length > 24 
    ? data.filter((_, index) => index % Math.ceil(data.length / 12) === 0)
    : data;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>
            {data.reduce((sum, d) => sum + (d.value || 0), 0).toFixed(1)} {unit}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>
            {(data.reduce((sum, d) => sum + (d.value || 0), 0) / data.length).toFixed(1)} {unit}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Peak</Text>
          <Text style={styles.statValue}>
            {maxValue.toFixed(1)} {unit}
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {displayData.map((item, index) => {
            const value = item.value || 0;
            const barHeight = maxValue > 0 ? (value / maxValue) * 150 : 0; // Max height 150px
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <Text style={styles.barValue}>{value.toFixed(1)}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(barHeight, 2), // Minimum 2px height
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {item.label || ''}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Consumption ({unit})</Text>
        </View>
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
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 8,
    },
    statItem: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
    chartScroll: {
      marginBottom: 12,
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 8,
      paddingVertical: 16,
      minHeight: 200,
      gap: 8,
    },
    barContainer: {
      alignItems: 'center',
      minWidth: 50,
    },
    barWrapper: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 170,
      marginBottom: 8,
    },
    barValue: {
      fontSize: 10,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: '600',
    },
    bar: {
      width: 40,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      minHeight: 2,
    },
    barLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: 'center',
      width: 50,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
      gap: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    noData: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 32,
    },
  });
