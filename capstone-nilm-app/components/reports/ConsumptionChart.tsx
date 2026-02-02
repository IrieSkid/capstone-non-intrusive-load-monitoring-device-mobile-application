/**
 * Consumption Chart Component
 * Line chart showing consumption over time
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
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

  // Prepare chart data
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => colors.primary, // Line color
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: colors.divider,
      strokeWidth: 1,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 48} // Padding consideration
        height={220}
        chartConfig={chartConfig}
        bezier // Smooth curves
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        fromZero={true}
      />

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
      marginBottom: 16,
    },
    chart: {
      marginVertical: 8,
      borderRadius: 12,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 12,
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
