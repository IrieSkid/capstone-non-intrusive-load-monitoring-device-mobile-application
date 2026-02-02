/**
 * Admin - Device Management Screen
 * View and manage all devices in the system
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRBAC } from '@/contexts/RBACContext';
import { adminService, AdminDeviceData, AdminUserData } from '@/services/adminService';

export default function AdminDevicesScreen() {
  const { colors } = useTheme();
  const { isAdmin } = useRBAC();
  const [devices, setDevices] = useState<AdminDeviceData[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<AdminDeviceData[]>([]);
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedDevice, setSelectedDevice] = useState<AdminDeviceData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isReassignModalVisible, setIsReassignModalVisible] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editHardwareId, setEditHardwareId] = useState('');
  const [editIpAddress, setEditIpAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reassign state
  const [selectedUserId, setSelectedUserId] = useState('');

  const styles = createStyles(colors);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      Alert.alert('Access Denied', 'You do not have permission to access this page.');
      router.back();
    }
  }, [isAdmin]);

  /**
   * Load all devices and users
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allDevices, allUsers] = await Promise.all([
        adminService.getAllDevices(),
        adminService.getAllUsers(),
      ]);
      setDevices(allDevices);
      setFilteredDevices(allDevices);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load devices');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  /**
   * Filter devices based on search and status
   */
  useEffect(() => {
    let filtered = devices;

    // Filter by status
    if (filterStatus === 'online') {
      filtered = filtered.filter(device => device.isOnline);
    } else if (filterStatus === 'offline') {
      filtered = filtered.filter(device => !device.isOnline);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        device =>
          device.name.toLowerCase().includes(query) ||
          device.location?.toLowerCase().includes(query) ||
          device.ownerName.toLowerCase().includes(query) ||
          device.hardwareId?.toLowerCase().includes(query)
      );
    }

    setFilteredDevices(filtered);
  }, [searchQuery, filterStatus, devices]);

  /**
   * Handle edit device
   */
  const handleEditDevice = (device: AdminDeviceData) => {
    setSelectedDevice(device);
    setEditName(device.name);
    setEditLocation(device.location || '');
    setEditHardwareId(device.hardwareId || '');
    setEditIpAddress(device.ipAddress || '');
    setIsEditModalVisible(true);
  };

  /**
   * Save device changes
   */
  const handleSaveDevice = async () => {
    if (!selectedDevice) return;

    try {
      setIsSaving(true);

      await adminService.updateDeviceDetails(selectedDevice.id, {
        name: editName,
        location: editLocation,
        hardwareId: editHardwareId,
        ipAddress: editIpAddress,
      });

      Alert.alert('Success', 'Device updated successfully');
      setIsEditModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error saving device:', error);
      Alert.alert('Error', 'Failed to save device changes');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle reassign device
   */
  const handleReassignDevice = (device: AdminDeviceData) => {
    setSelectedDevice(device);
    setSelectedUserId(device.userId);
    setIsReassignModalVisible(true);
  };

  /**
   * Confirm reassignment
   */
  const handleConfirmReassign = async () => {
    if (!selectedDevice || !selectedUserId) return;

    try {
      setIsSaving(true);

      await adminService.reassignDevice(selectedDevice.id, selectedUserId);

      Alert.alert('Success', 'Device reassigned successfully');
      setIsReassignModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error reassigning device:', error);
      Alert.alert('Error', 'Failed to reassign device');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle delete device
   */
  const handleDeleteDevice = (device: AdminDeviceData) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${device.name}"? This will also delete all associated appliances and data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.deleteDevice(device.id);
              Alert.alert('Success', 'Device deleted successfully');
              loadData();
            } catch (error) {
              console.error('Error deleting device:', error);
              Alert.alert('Error', 'Failed to delete device');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Device Management</Text>
        <View style={styles.headerRight}>
          <Text style={styles.deviceCount}>{filteredDevices.length} devices</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search devices..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          {(['all', 'online', 'offline'] as const).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusFilterChip,
                filterStatus === status && styles.statusFilterChipActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.statusFilterText,
                  filterStatus === status && styles.statusFilterTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Devices List */}
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredDevices.map(device => (
          <View key={device.id} style={styles.deviceCard}>
            {/* Status Indicator */}
            <View
              style={[
                styles.statusDot,
                { backgroundColor: device.isOnline ? colors.success : colors.textSecondary },
              ]}
            />

            {/* Device Header */}
            <View style={styles.deviceHeader}>
              <Ionicons
                name="hardware-chip"
                size={24}
                color={device.isOnline ? colors.primary : colors.textSecondary}
              />
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                {device.location && (
                  <Text style={styles.deviceLocation}>📍 {device.location}</Text>
                )}
              </View>
            </View>

            {/* Owner Info */}
            <View style={styles.ownerInfo}>
              <View style={styles.ownerRow}>
                <Ionicons name="person" size={16} color={colors.textSecondary} />
                <Text style={styles.ownerText}>{device.ownerName}</Text>
                <View style={[styles.roleBadge, getRoleStyle(device.ownerRole, colors)]}>
                  <Text style={styles.roleBadgeText}>{device.ownerRole}</Text>
                </View>
              </View>
              <Text style={styles.ownerEmail}>{device.ownerEmail}</Text>
            </View>

            {/* Device Stats */}
            <View style={styles.deviceStats}>
              <View style={styles.deviceStatItem}>
                <Ionicons name="bulb-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.deviceStatText}>{device.applianceCount} appliances</Text>
              </View>
              <View style={styles.deviceStatItem}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.deviceStatText}>
                  {device.lastReading
                    ? `Last: ${device.lastReading.toLocaleTimeString()}`
                    : 'No data'}
                </Text>
              </View>
            </View>

            {device.hardwareId && (
              <Text style={styles.hardwareId}>Hardware ID: {device.hardwareId}</Text>
            )}

            {/* Actions */}
            <View style={styles.deviceActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditDevice(device)}
              >
                <Ionicons name="pencil" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleReassignDevice(device)}
              >
                <Ionicons name="swap-horizontal" size={18} color={colors.warning} />
                <Text style={styles.actionButtonText}>Reassign</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteDevice(device)}
              >
                <Ionicons name="trash" size={18} color={colors.error} />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredDevices.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="hardware-chip-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No devices found</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Device Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Device</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Device Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Device Name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={editLocation}
                onChangeText={setEditLocation}
                placeholder="Location"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Hardware ID</Text>
              <TextInput
                style={styles.input}
                value={editHardwareId}
                onChangeText={setEditHardwareId}
                placeholder="Hardware ID"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>IP Address</Text>
              <TextInput
                style={styles.input}
                value={editIpAddress}
                onChangeText={setEditIpAddress}
                placeholder="IP Address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveDevice}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reassign Device Modal */}
      <Modal
        visible={isReassignModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReassignModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reassign Device</Text>
              <TouchableOpacity onPress={() => setIsReassignModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Select New Owner</Text>
              {users.map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userOption,
                    selectedUserId === user.id && styles.userOptionSelected,
                  ]}
                  onPress={() => setSelectedUserId(user.id)}
                >
                  <View style={styles.userOptionInfo}>
                    <Text style={styles.userOptionName}>{user.displayName}</Text>
                    <Text style={styles.userOptionEmail}>{user.email}</Text>
                  </View>
                  <View style={[styles.roleBadge, getRoleStyle(user.role, colors)]}>
                    <Text style={styles.roleBadgeText}>{user.role}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsReassignModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleConfirmReassign}
                disabled={isSaving || selectedUserId === selectedDevice?.userId}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Reassign</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Helper function to get role style
function getRoleStyle(role: string, colors: any) {
  switch (role) {
    case 'admin':
      return { backgroundColor: colors.error + '30', borderColor: colors.error };
    case 'landlord':
      return { backgroundColor: colors.warning + '30', borderColor: colors.warning };
    case 'tenant':
    default:
      return { backgroundColor: colors.primary + '30', borderColor: colors.primary };
  }
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
      marginTop: 12,
      color: colors.textSecondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      flex: 1,
      marginLeft: 12,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deviceCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: colors.textPrimary,
    },
    statusFilters: {
      flexDirection: 'row',
    },
    statusFilterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusFilterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    statusFilterText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusFilterTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    deviceCard: {
      backgroundColor: colors.surface,
      margin: 16,
      marginBottom: 8,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusDot: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    deviceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    deviceInfo: {
      flex: 1,
      marginLeft: 12,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    deviceLocation: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    ownerInfo: {
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    ownerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    ownerText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    ownerEmail: {
      fontSize: 13,
      color: colors.textSecondary,
      marginLeft: 24,
    },
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    roleBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    deviceStats: {
      flexDirection: 'row',
      paddingVertical: 12,
      gap: 16,
    },
    deviceStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    deviceStatText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    hardwareId: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: 'monospace',
      marginTop: 8,
    },
    deviceActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 64,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 16,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    modalBody: {
      padding: 20,
      maxHeight: 400,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
      marginTop: 12,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.background,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userOptionSelected: {
      backgroundColor: colors.primaryLight + '20',
      borderColor: colors.primary,
    },
    userOptionInfo: {
      flex: 1,
    },
    userOptionName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    userOptionEmail: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.background,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    saveButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });
