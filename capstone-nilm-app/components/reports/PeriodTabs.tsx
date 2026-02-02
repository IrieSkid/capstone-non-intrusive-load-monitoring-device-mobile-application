/**
 * Period Tabs Component
 * Tab selector for different report periods (Daily, Weekly, Monthly)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type Period = 'daily' | 'weekly' | 'monthly';

interface PeriodTabsProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function PeriodTabs({ selectedPeriod, onPeriodChange }: PeriodTabsProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <View style={styles.container}>
      {periods.map(period => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.tab,
            selectedPeriod === period.key && styles.activeTab,
          ]}
          onPress={() => onPeriodChange(period.key)}>
          <Text
            style={[
              styles.tabText,
              selectedPeriod === period.key && styles.activeTabText,
            ]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
  });
