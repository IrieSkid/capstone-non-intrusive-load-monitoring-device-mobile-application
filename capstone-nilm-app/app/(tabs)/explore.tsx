/**
 * Device Management Screen
 * View and manage all IoT devices
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
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { deviceService, Device } from '@/services/deviceService';

export default function DevicesScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(colors);

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load devices
  const loadDevices = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userDevices = await deviceService.getUserDevices(user.id);
      setDevices(userDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load devices');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDevices();
  }, [user]);

  const handleAddDevice = () => {
    router.push('/add-device');
  };

  const handleDevicePress = (device: Device) => {
    router.push({
      pathname: '/device-details',
      params: { deviceId: device.id },
    });
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? colors.success : colors.error;
  };

  const getStatusText = (isOnline: boolean) => {
    return isOnline ? 'Online' : 'Offline';
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (isLoading && devices.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>🔌 Devices</Text>
            <Text style={styles.subtitle}>
              {devices.length} device{devices.length !== 1 ? 's' : ''} registered
            </Text>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddDevice}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Device List */}
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📱</Text>
            <Text style={styles.emptyTitle}>No Devices Yet</Text>
            <Text style={styles.emptyText}>
              Add your first energy monitoring device to start tracking your consumption
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddDevice}>
              <Text style={styles.emptyButtonText}>Add Device</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.deviceList}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceCard}
                onPress={() => handleDevicePress(device)}>
                
                {/* Device Icon & Status */}
                <View style={styles.deviceIconContainer}>
                  <View style={styles.deviceIcon}>
                    <Text style={styles.deviceIconText}>⚡</Text>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(device.isOnline) },
                    ]}
                  />
                </View>

                {/* Device Info */}
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type.replace('_', ' ')}</Text>
                  {device.location && (
                    <Text style={styles.deviceLocation}>📍 {device.location}</Text>
                  )}
                  <Text style={styles.deviceLastSeen}>
                    Last seen: {formatLastSeen(device.lastSeen)}
                  </Text>
                </View>

                {/* Status Badge */}
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(device.isOnline)}20` },
                    ]}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(device.isOnline) },
                      ]}>
                      {getStatusText(device.isOnline)}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Info Note */}
        {devices.length > 0 && (
          <View style={styles.infoNote}>
            <Text style={styles.infoText}>
              ℹ️ Tap on a device to view details, configure settings, or remove it.
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
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 10,
      color: colors.textSecondary,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      padding: 16,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 80,
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
    deviceList: {
      padding: 16,
      gap: 12,
    },
    deviceCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    deviceIconContainer: {
      position: 'relative',
      marginRight: 16,
    },
    deviceIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primaryLight + '30',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deviceIconText: {
      fontSize: 28,
    },
    statusDot: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    deviceType: {
      fontSize: 14,
      color: colors.textSecondary,
      textTransform: 'capitalize',
      marginBottom: 4,
    },
    deviceLocation: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    deviceLastSeen: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    statusContainer: {
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
      marginHorizontal: 16,
      marginTop: 16,
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
