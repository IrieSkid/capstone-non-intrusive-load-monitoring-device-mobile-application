/**
 * Device Appliances Screen
 * Manage appliances for a specific device
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { firestoreApplianceService, Appliance } from '@/services/firestoreApplianceService';
import { deviceService, Device } from '@/services/deviceService';

export default function DeviceAppliancesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const styles = createStyles(colors);

  const [device, setDevice] = useState<Device | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [deviceId]);

  const loadData = async () => {
    if (!deviceId) return;

    try {
      setIsLoading(true);
      const [deviceData, appliancesData] = await Promise.all([
        deviceService.getDevice(deviceId),
        firestoreApplianceService.getDeviceAppliances(deviceId),
      ]);

      setDevice(deviceData);
      setAppliances(appliancesData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load appliances');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [deviceId]);

  const handleAddAppliance = () => {
    router.push({
      pathname: '/add-appliance',
      params: { deviceId },
    });
  };

  const handleAppliancePress = (appliance: Appliance) => {
    router.push({
      pathname: '/appliance-details',
      params: { applianceId: appliance.id },
    });
  };

  const getPowerColor = (power: number) => {
    if (power < 100) return colors.success;
    if (power < 1000) return colors.warning;
    return colors.error;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading appliances...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Appliances</Text>
          <Text style={styles.headerSubtitle}>{device?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleAddAppliance}>
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{appliances.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {appliances.filter(a => a.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>
              {appliances.filter(a => !a.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        {/* Appliance List */}
        {appliances.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔌</Text>
            <Text style={styles.emptyTitle}>No Appliances Yet</Text>
            <Text style={styles.emptyText}>
              Add appliances to monitor their individual power consumption and usage patterns
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddAppliance}>
              <Text style={styles.emptyButtonText}>Add Appliance</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.applianceList}>
            {/* Active Appliances */}
            {appliances.filter(a => a.isActive).length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Active</Text>
                {appliances
                  .filter(a => a.isActive)
                  .map((appliance) => (
                    <TouchableOpacity
                      key={appliance.id}
                      style={styles.applianceCard}
                      onPress={() => handleAppliancePress(appliance)}>
                      
                      <View style={styles.applianceIcon}>
                        <Text style={styles.applianceIconText}>{appliance.icon}</Text>
                      </View>

                      <View style={styles.applianceInfo}>
                        <Text style={styles.applianceName}>{appliance.name}</Text>
                        <Text style={styles.applianceCategory}>{appliance.category}</Text>
                      <View style={styles.applianceMeta}>
                        <Text style={styles.applianceMetaText}>
                          Port {appliance.portNumber} • Rated: {appliance.ratedPower}W
                        </Text>
                        {appliance.currentPower && (
                          <Text
                            style={[
                              styles.applianceMetaText,
                              { color: getPowerColor(appliance.currentPower) },
                            ]}>
                            • Current: {appliance.currentPower.toFixed(0)}W
                          </Text>
                        )}
                      </View>
                      </View>

                      <View style={styles.applianceActions}>
                        <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                          <Text style={[styles.statusText, { color: colors.success }]}>ON</Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </>
            )}

            {/* Inactive Appliances */}
            {appliances.filter(a => !a.isActive).length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Inactive</Text>
                {appliances
                  .filter(a => !a.isActive)
                  .map((appliance) => (
                    <TouchableOpacity
                      key={appliance.id}
                      style={[styles.applianceCard, { opacity: 0.7 }]}
                      onPress={() => handleAppliancePress(appliance)}>
                      
                      <View style={[styles.applianceIcon, { backgroundColor: colors.divider }]}>
                        <Text style={styles.applianceIconText}>{appliance.icon}</Text>
                      </View>

                      <View style={styles.applianceInfo}>
                        <Text style={styles.applianceName}>{appliance.name}</Text>
                        <Text style={styles.applianceCategory}>{appliance.category}</Text>
                        <Text style={styles.applianceMetaText}>
                          Port {appliance.portNumber} • Rated: {appliance.ratedPower}W
                        </Text>
                      </View>

                      <View style={styles.applianceActions}>
                        <View style={[styles.statusBadge, { backgroundColor: colors.divider }]}>
                          <Text style={[styles.statusText, { color: colors.textSecondary }]}>OFF</Text>
                        </View>
                        <Text style={styles.chevron}>›</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </>
            )}
          </View>
        )}

        {/* Info Note */}
        {appliances.length > 0 && (
          <View style={styles.infoNote}>
            <Text style={styles.infoText}>
              ℹ️ Tap on an appliance to view details, edit settings, or remove it. Active appliances
              are currently detected by the device.
            </Text>
          </View>
        )}
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
    },
    loadingText: {
      marginTop: 10,
      color: colors.textSecondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    backButton: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '600',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    addButton: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: 'uppercase',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
    },
    emptyButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    applianceList: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    applianceCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    applianceIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primaryLight + '30',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    applianceIconText: {
      fontSize: 28,
    },
    applianceInfo: {
      flex: 1,
    },
    applianceName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    applianceCategory: {
      fontSize: 14,
      color: colors.textSecondary,
      textTransform: 'capitalize',
      marginBottom: 4,
    },
    applianceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    applianceMetaText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    applianceActions: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    chevron: {
      fontSize: 24,
      color: colors.textSecondary,
    },
    infoNote: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginTop: 24,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    infoText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
