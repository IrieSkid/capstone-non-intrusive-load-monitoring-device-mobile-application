/**
 * Reports Screen (Placeholder for Phase 4)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

export default function ReportsScreen() {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Reports</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.placeholder}>
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.title}>Reports Coming Soon</Text>
            <Text style={styles.subtitle}>
              Detailed consumption reports and analytics will be available in Phase 4
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: 16,
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.divider,
    borderStyle: 'dashed',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
