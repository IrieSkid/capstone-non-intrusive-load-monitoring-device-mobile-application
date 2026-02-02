/**
 * Consumption Chart Component
 * Displays daily consumption as a simple bar chart
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { generateDailyConsumptionData } from '@/utils/mockData';

const screenWidth = Dimensions.get('window').width;

export function ConsumptionChart() {
  const data = generateDailyConsumptionData();
  const maxKwh = Math.max(...data.map((d) => d.kwh));

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        📊 Last 7 Days Consumption
      </ThemedText>

      <View style={styles.chart}>
        {data.map((item, index) => {
          const heightPercentage = (item.kwh / maxKwh) * 100;

          return (
            <View key={index} style={styles.barContainer}>
              <ThemedText style={styles.kwhValue}>{item.kwh}</ThemedText>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercentage}%`,
                      backgroundColor: index === 6 ? '#007AFF' : '#4ECDC4',
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.dayLabel}>{item.date}</ThemedText>
              <ThemedText style={styles.costLabel}>₱{item.cost.toFixed(0)}</ThemedText>
            </View>
          );
        })}
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Weekly Total</ThemedText>
          <ThemedText style={styles.summaryValue}>
            {data.reduce((sum, item) => sum + item.kwh, 0).toFixed(1)} kWh
          </ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryLabel}>Weekly Cost</ThemedText>
          <ThemedText style={styles.summaryValue}>
            ₱{data.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  kwhValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
  },
  barWrapper: {
    flex: 1,
    width: '80%',
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333333',
  },
  costLabel: {
    fontSize: 9,
    color: '#666666',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
