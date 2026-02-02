/**
 * Device Details Screen
 * View and manage individual device settings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { deviceService, Device } from '@/services/deviceService';

export default function DeviceDetailsScreen() {
  const { colors } = useTheme();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const styles = createStyles(colors);

  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  // Load device details
  useEffect(() => {
    loadDevice();
  }, [deviceId]);

  const loadDevice = async () => {
    if (!deviceId) return;

    try {
      setIsLoading(true);
      const deviceData = await deviceService.getDevice(deviceId);
      if (deviceData) {
        setDevice(deviceData);
        setName(deviceData.name);
        setLocation(deviceData.location || '');
        setIpAddress(deviceData.ipAddress || '');
      } else {
        Alert.alert('Error', 'Device not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading device:', error);
      Alert.alert('Error', 'Failed to load device details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!device) return;

    try {
      setIsSaving(true);
      await deviceService.updateDevice(device.id, {
        name,
        location: location || undefined,
        ipAddress: ipAddress || undefined,
      });

      setDevice({ ...device, name, location: location || undefined, ipAddress: ipAddress || undefined });
      setIsEditing(false);
      Alert.alert('Success', 'Device settings updated');
    } catch (error) {
      console.error('Error updating device:', error);
      Alert.alert('Error', 'Failed to update device settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    Alert.alert(
      'Connection Test',
      'Testing connection to device...\n\nThis would ping the device and check if it responds.',
      [
        {
          text: 'Simulate Success',
          onPress: () => Alert.alert('Success', 'Device is online and responding!'),
        },
        {
          text: 'Simulate Failure',
          onPress: () => Alert.alert('Error', 'Device is offline or not responding'),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRestart = () => {
    Alert.alert(
      'Restart Device',
      'Are you sure you want to restart this device? It will be offline for a few seconds.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Restart command sent to device');
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Device',
      'Are you sure you want to delete this device? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (device) {
                await deviceService.deleteDevice(device.id);
                Alert.alert('Success', 'Device deleted successfully', [
                  { text: 'OK', onPress: () => router.back() },
                ]);
              }
            } catch (error) {
              console.error('Error deleting device:', error);
              Alert.alert('Error', 'Failed to delete device');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading device...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!device) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Device not found</Text>
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
        <Text style={styles.headerTitle}>Device Details</Text>
        <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Device Header */}
        <View style={styles.deviceHeader}>
          <View style={styles.deviceIconLarge}>
            <Text style={styles.deviceIconTextLarge}>⚡</Text>
          </View>
          <View style={[styles.statusBadgeLarge, { backgroundColor: device.isOnline ? colors.success + '20' : colors.error + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: device.isOnline ? colors.success : colors.error }]} />
            <Text style={[styles.statusTextLarge, { color: device.isOnline ? colors.success : colors.error }]}>
              {device.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Device Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Device name"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.fieldValue}>{device.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Type</Text>
              <Text style={styles.fieldValue}>{device.type.replace('_', ' ')}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Location</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Device location"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.fieldValue}>{device.location || 'Not set'}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Network Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network</Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>MAC Address</Text>
              <Text style={[styles.fieldValue, styles.monoValue]}>{device.macAddress}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>IP Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.fieldInput, styles.monoValue]}
                  value={ipAddress}
                  onChangeText={setIpAddress}
                  placeholder="192.168.1.100"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numbers-and-punctuation"
                />
              ) : (
                <Text style={[styles.fieldValue, styles.monoValue]}>{device.ipAddress || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Firmware Version</Text>
              <Text style={styles.fieldValue}>{device.firmwareVersion || 'Unknown'}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Last Seen</Text>
              <Text style={styles.fieldValue}>{device.lastSeen.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Connection Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Management</Text>

          <View style={styles.card}>
            <TouchableOpacity style={styles.actionButton} onPress={handleTestConnection}>
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonIcon}>🔌</Text>
                <View style={styles.actionButtonText}>
                  <Text style={styles.actionButtonTitle}>Test Connection</Text>
                  <Text style={styles.actionButtonDescription}>Ping device to check connectivity</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleRestart}>
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonIcon}>🔄</Text>
                <View style={styles.actionButtonText}>
                  <Text style={styles.actionButtonTitle}>Restart Device</Text>
                  <Text style={styles.actionButtonDescription}>Send restart command to device</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>

          <View style={[styles.card, { borderColor: colors.error + '40' }]}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonIcon}>🗑️</Text>
                <View style={styles.actionButtonText}>
                  <Text style={[styles.actionButtonTitle, { color: colors.error }]}>Delete Device</Text>
                  <Text style={styles.actionButtonDescription}>Permanently remove this device</Text>
                </View>
              </View>
              <Text style={[styles.chevron, { color: colors.error }]}>›</Text>
            </TouchableOpacity>
          </View>
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
    },
    loadingText: {
      marginTop: 10,
      color: colors.textSecondary,
    },
    errorText: {
      color: colors.error,
      fontSize: 16,
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
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    editButton: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    deviceHeader: {
      alignItems: 'center',
      padding: 32,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    deviceIconLarge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight + '30',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    deviceIconTextLarge: {
      fontSize: 40,
    },
    statusBadgeLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      gap: 8,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    statusTextLarge: {
      fontSize: 14,
      fontWeight: '600',
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    field: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    fieldLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    fieldValue: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    fieldInput: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
      backgroundColor: colors.background,
      padding: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    monoValue: {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      textTransform: 'none',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    actionButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    actionButtonIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    actionButtonText: {
      flex: 1,
    },
    actionButtonTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    actionButtonDescription: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    chevron: {
      fontSize: 24,
      color: colors.textSecondary,
      marginLeft: 8,
    },
  });
