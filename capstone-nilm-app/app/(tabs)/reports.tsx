/**
 * Reports Screen (Placeholder for Phase 4)
 */

import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Colors from '@/constants/Colors';

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Reports</ThemedText>
        </ThemedView>

      <View style={styles.content}>
        <ThemedView style={styles.placeholder}>
          <ThemedText style={styles.icon}>📊</ThemedText>
          <ThemedText style={styles.title}>Reports Coming Soon</ThemedText>
          <ThemedText style={styles.subtitle}>
            Detailed consumption reports and analytics will be available in Phase 4
          </ThemedText>
        </ThemedView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: 16,
  },
  placeholder: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.divider,
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
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
