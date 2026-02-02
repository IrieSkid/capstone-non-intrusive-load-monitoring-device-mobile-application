/**
 * Cost Analysis Card Component
 * Shows cost breakdown and insights
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CostAnalysis } from '@/types/report';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface CostAnalysisCardProps {
  analysis: CostAnalysis;
}

export function CostAnalysisCard({ analysis }: CostAnalysisCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Safety checks for undefined values
  if (!analysis || !analysis.costByTimeOfDay) {
    return null;
  }

  const isIncrease = (analysis.percentageChange || 0) > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cost Analysis</Text>

      {/* Current vs Previous */}
      <View style={styles.comparisonSection}>
        <View style={styles.comparisonItem}>
          <Text style={styles.label}>Current Period</Text>
          <Text style={styles.currentValue}>₱{(analysis.currentPeriodCost || 0).toFixed(2)}</Text>
        </View>
        
        <View style={styles.comparisonItem}>
          <Text style={styles.label}>Previous Period</Text>
          <Text style={styles.previousValue}>₱{(analysis.previousPeriodCost || 0).toFixed(2)}</Text>
        </View>
      </View>

      {/* Percentage Change */}
      <View style={[styles.changeContainer, isIncrease ? styles.increaseContainer : styles.decreaseContainer]}>
        <Text style={[styles.changeText, isIncrease ? styles.increaseText : styles.decreaseText]}>
          {isIncrease ? '▲' : '▼'} {Math.abs(analysis.percentageChange || 0).toFixed(1)}%
        </Text>
        <Text style={[styles.changeLabel, isIncrease ? styles.increaseText : styles.decreaseText]}>
          {isIncrease ? 'Increase' : 'Decrease'} from last period
        </Text>
      </View>

      {/* Cost by Time of Day */}
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>Cost by Time of Day</Text>
        
        <View style={styles.timeGrid}>
          <View style={styles.timeItem}>
            <Text style={styles.timeIcon}>🌅</Text>
            <Text style={styles.timeLabel}>Morning</Text>
            <Text style={styles.timeValue}>₱{(analysis.costByTimeOfDay?.morning || 0).toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeItem}>
            <Text style={styles.timeIcon}>☀️</Text>
            <Text style={styles.timeLabel}>Afternoon</Text>
            <Text style={styles.timeValue}>₱{(analysis.costByTimeOfDay?.afternoon || 0).toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeItem}>
            <Text style={styles.timeIcon}>🌆</Text>
            <Text style={styles.timeLabel}>Evening</Text>
            <Text style={styles.timeValue}>₱{(analysis.costByTimeOfDay?.evening || 0).toFixed(2)}</Text>
          </View>
          
          <View style={styles.timeItem}>
            <Text style={styles.timeIcon}>🌙</Text>
            <Text style={styles.timeLabel}>Night</Text>
            <Text style={styles.timeValue}>₱{(analysis.costByTimeOfDay?.night || 0).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsSection}>
        <View style={styles.insightItem}>
          <Text style={styles.insightLabel}>Estimated Next Bill</Text>
          <Text style={styles.insightValue}>₱{(analysis.estimatedNextBill || 0).toFixed(2)}</Text>
        </View>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightLabel}>Potential Savings</Text>
          <Text style={[styles.insightValue, { color: colors.success }]}>
            ₱{(analysis.savingsOpportunity || 0).toFixed(2)}
          </Text>
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
    comparisonSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 12,
    },
    comparisonItem: {
      flex: 1,
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 8,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    currentValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    previousValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textSecondary,
    },
    changeContainer: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    increaseContainer: {
      backgroundColor: `${colors.error}15`,
    },
    decreaseContainer: {
      backgroundColor: `${colors.success}15`,
    },
    changeText: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 4,
    },
    changeLabel: {
      fontSize: 12,
      fontWeight: '600',
    },
    increaseText: {
      color: colors.error,
    },
    decreaseText: {
      color: colors.success,
    },
    timeSection: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    timeItem: {
      flex: 1,
      minWidth: '45%',
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 8,
      alignItems: 'center',
    },
    timeIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    timeLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    timeValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    insightsSection: {
      flexDirection: 'row',
      gap: 12,
    },
    insightItem: {
      flex: 1,
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 8,
      alignItems: 'center',
    },
    insightLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 4,
      textAlign: 'center',
    },
    insightValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
  });
