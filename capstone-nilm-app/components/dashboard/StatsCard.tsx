/**
 * Stats Card Component
 * Displays a single statistic with icon and optional trend
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface StatsCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: string;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  unit,
  icon,
  iconColor = '#007AFF',
  trend,
  subtitle,
}: StatsCardProps) {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <IconSymbol name={icon as any} size={24} color={iconColor} />
        </View>
        {trend && (
          <View style={[styles.trend, trend.isPositive ? styles.trendUp : styles.trendDown]}>
            <Text style={[styles.trendText, trend.isPositive ? styles.trendUpText : styles.trendDownText]}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>

      <ThemedText style={styles.title}>{title}</ThemedText>

      <View style={styles.valueContainer}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        {unit && <ThemedText style={styles.unit}> {unit}</ThemedText>}
      </View>

      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trend: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: '#E8F5E9',
  },
  trendDown: {
    backgroundColor: '#FFEBEE',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendUpText: {
    color: '#4CAF50',
  },
  trendDownText: {
    color: '#F44336',
  },
  title: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 16,
    color: '#666666',
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
});
