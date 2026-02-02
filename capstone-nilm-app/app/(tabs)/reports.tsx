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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useRealtimeData } from '@/contexts/RealtimeDataContext';
import { reportService } from '@/services/reportService';
import { DailyReport, WeeklyReport, MonthlyReport, CostAnalysis } from '@/types/report';
import { PeriodTabs } from '@/components/reports/PeriodTabs';
import { ConsumptionChartComponent } from '@/components/reports/ConsumptionChart';
import { CostAnalysisCard } from '@/components/reports/CostAnalysisCard';
import { ApplianceBreakdown } from '@/components/reports/ApplianceBreakdown';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { ExportMenu } from '@/components/reports/ExportMenu';

type Period = 'daily' | 'weekly' | 'monthly';

export default function ReportsScreen() {
  const { colors, isDark } = useTheme();
  const { deviceId } = useRealtimeData();
  const styles = createStyles(colors);
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);
  
  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Date range filter
  const [customDateRange, setCustomDateRange] = useState<{ start: Date; end: Date } | null>(null);

  // Load reports
  const loadReports = async () => {
    if (!deviceId) {
      console.log('No deviceId available yet');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Load all reports in parallel
      const [daily, weekly, monthly, cost] = await Promise.all([
        reportService.getDailyReport(deviceId),
        reportService.getWeeklyReport(deviceId),
        reportService.getMonthlyReport(deviceId),
        reportService.getCostAnalysis(deviceId, selectedPeriod),
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

  // Load reports on mount and when period or deviceId changes
  useEffect(() => {
    loadReports();
  }, [selectedPeriod, deviceId]);

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
    // If custom date range is set, show that
    if (customDateRange) {
      return `${customDateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${customDateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
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
        return `${weekReport.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekReport.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'monthly':
        const monthReport = currentReport as MonthlyReport;
        return monthReport.month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  // Handle date range filter
  const handleDateRangeApply = (startDate: Date, endDate: Date) => {
    setCustomDateRange({ start: startDate, end: endDate });
    setShowDatePicker(false);
    
    // In a real app, this would fetch filtered data from Firestore
    // For now, just show a message
    Alert.alert(
      'Date Range Applied',
      `Filtering reports from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}. 
      
Note: This will fetch actual data from Firestore when connected to real hardware.`,
      [{ text: 'OK' }]
    );
  };

  // Clear custom date range
  const handleClearDateRange = () => {
    setCustomDateRange(null);
    loadReports();
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
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>📊 Reports</Text>
            <Text style={styles.dateRange}>{getDateRange()}</Text>
            {customDateRange && (
              <TouchableOpacity onPress={handleClearDateRange} style={styles.clearFilterButton}>
                <Text style={styles.clearFilterText}>✕ Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerButton, customDateRange && styles.headerButtonActive]}
              onPress={() => setShowDatePicker(true)}>
              <Text style={styles.headerButtonIcon}>📅</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowExportMenu(true)}>
              <Text style={styles.headerButtonIcon}>📤</Text>
            </TouchableOpacity>
          </View>
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
        {currentReport && currentReport.applianceBreakdown && (
          <ApplianceBreakdown appliances={currentReport.applianceBreakdown} />
        )}

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoText}>
            ℹ️ These reports are generated using mock data for testing. When connected to
            hardware, real-time consumption data will be displayed.
          </Text>
        </View>
      </ScrollView>

      {/* Date Range Picker Modal */}
      <DateRangePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onApply={handleDateRangeApply}
      />

      {/* Export Menu Modal */}
      {currentReport && (
        <ExportMenu
          visible={showExportMenu}
          onClose={() => setShowExportMenu(false)}
          reportData={{
            period: selectedPeriod,
            dateRange: getDateRange(),
            totalKwh: currentReport.totalKwh,
            totalCost: currentReport.totalCost,
            appliances: (currentReport.applianceBreakdown || []).map(a => ({
              name: a.name,
              kwh: a.totalKwh || a.kwh,
              cost: a.totalCost || 0,
            })),
          }}
        />
      )}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
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
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerButtonIcon: {
      fontSize: 20,
    },
    headerButtonActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    clearFilterButton: {
      marginTop: 4,
    },
    clearFilterText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
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
