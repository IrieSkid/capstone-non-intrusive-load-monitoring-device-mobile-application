/**
 * Reports & Analytics Screen
 * Comprehensive energy consumption reports with charts and insights
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { reportService } from '@/services/reportService';
import { DailyReport, WeeklyReport, MonthlyReport, CostAnalysis } from '@/types/report';
import { PeriodTabs } from '@/components/reports/PeriodTabs';
import { ConsumptionChartComponent } from '@/components/reports/ConsumptionChart';
import { CostAnalysisCard } from '@/components/reports/CostAnalysisCard';
import { ApplianceBreakdown } from '@/components/reports/ApplianceBreakdown';

type Period = 'daily' | 'weekly' | 'monthly';

export default function ReportsScreen() {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);

  // Load reports
  const loadReports = async () => {
    try {
      setIsLoading(true);
      
      // Load all reports in parallel
      const [daily, weekly, monthly, cost] = await Promise.all([
        reportService.getDailyReport(),
        reportService.getWeeklyReport(),
        reportService.getMonthlyReport(),
        reportService.getCostAnalysis(selectedPeriod),
      ]);
      
      setDailyReport(daily);
      setWeeklyReport(weekly);
      setMonthlyReport(monthly);
      setCostAnalysis(cost);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load reports on mount and when period changes
  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReports();
  }, [selectedPeriod]);

  // Get current report based on selected period
  const getCurrentReport = () => {
    switch (selectedPeriod) {
      case 'daily':
        return dailyReport;
      case 'weekly':
        return weeklyReport;
      case 'monthly':
        return monthlyReport;
    }
  };

  const currentReport = getCurrentReport();

  // Format date range
  const getDateRange = () => {
    if (!currentReport) return '';
    
    switch (selectedPeriod) {
      case 'daily':
        return new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      case 'weekly':
        const weekReport = currentReport as WeeklyReport;
        return `${weekReport.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekReport.weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'monthly':
        const monthReport = currentReport as MonthlyReport;
        return `${monthReport.month} ${monthReport.year}`;
    }
  };

  if (isLoading && !currentReport) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.background} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Reports</Text>
          <Text style={styles.dateRange}>{getDateRange()}</Text>
        </View>

        {/* Period Tabs */}
        <View style={styles.tabsContainer}>
          <PeriodTabs selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </View>

        {/* Summary Stats */}
        {currentReport && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Consumption</Text>
              <Text style={styles.summaryValue}>{currentReport.totalKwh.toFixed(1)} kWh</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Cost</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                ₱{currentReport.totalCost.toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Consumption Chart */}
        {currentReport && (
          <ConsumptionChartComponent
            title={`${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Consumption`}
            data={
              selectedPeriod === 'daily'
                ? (currentReport as DailyReport).hourlyData
                : selectedPeriod === 'weekly'
                ? (currentReport as WeeklyReport).dailyData
                : (currentReport as MonthlyReport).dailyData
            }
            unit="kWh"
          />
        )}

        {/* Cost Analysis */}
        {costAnalysis && <CostAnalysisCard analysis={costAnalysis} />}

        {/* Appliance Breakdown */}
        {currentReport && (
          <ApplianceBreakdown appliances={currentReport.applianceBreakdown} />
        )}

        {/* Export Button (Placeholder) */}
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => alert('Export functionality coming soon!')}>
          <Text style={styles.exportButtonText}>📄 Export Report</Text>
        </TouchableOpacity>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoText}>
            ℹ️ These reports are generated using mock data for testing. When connected to
            hardware, real-time consumption data will be displayed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 10,
      color: colors.textPrimary,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    dateRange: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    tabsContainer: {
      marginBottom: 16,
    },
    summaryContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
    },
    exportButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    exportButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    infoNote: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
