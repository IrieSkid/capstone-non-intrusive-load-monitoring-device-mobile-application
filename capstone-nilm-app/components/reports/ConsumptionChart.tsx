/**
 * Consumption Chart Component
 * Line chart showing consumption over time
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ConsumptionDataPoint } from '@/types/report';

interface ConsumptionChartProps {
  title: string;
  data: ConsumptionDataPoint[];
  unit?: string;
}

export function ConsumptionChartComponent({ title, data, unit = 'kWh' }: ConsumptionChartProps) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const screenWidth = Dimensions.get('window').width;

  // Prepare chart data for Victory
  const chartData = data.map((d, index) => ({
    x: index,
    y: d.value,
    label: d.label,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <VictoryChart
        width={screenWidth - 48}
        height={220}
        theme={VictoryTheme.material}
        padding={{ top: 20, bottom: 40, left: 50, right: 20 }}>
        
        <VictoryAxis
          style={{
            axis: { stroke: colors.divider },
            tickLabels: { fill: colors.textSecondary, fontSize: 10 },
            grid: { stroke: 'transparent' },
          }}
          tickValues={data.map((_, i) => i)}
          tickFormat={(t) => data[t]?.label || ''}
        />
        
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors.divider },
            tickLabels: { fill: colors.textSecondary, fontSize: 10 },
            grid: { stroke: colors.divider, strokeDasharray: '4,4' },
          }}
        />
        
        <VictoryLine
          data={chartData}
          style={{
            data: { 
              stroke: colors.primary,
              strokeWidth: 3,
            },
          }}
          interpolation="natural"
        />
      </VictoryChart>

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
      marginBottom: 8,
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
  });
