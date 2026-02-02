/**
 * Admin - System Settings Screen
 * Manage system-wide configuration settings
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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/hooks/useAuth';
import {
  systemSettingsService,
  SystemSetting,
  SettingCategory,
} from '@/services/systemSettingsService';
import { auditLogService } from '@/services/auditLogService';

export default function AdminSettingsScreen() {
  const { colors } = useTheme();
  const { isAdmin } = useRBAC();
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [filteredSettings, setFilteredSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<SettingCategory | 'all'>('all');
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Edit form state
  const [editValue, setEditValue] = useState<string>('');
  const [editBoolValue, setEditBoolValue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const styles = createStyles(colors);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      Alert.alert('Access Denied', 'You do not have permission to access this page.');
      router.back();
    }
  }, [isAdmin]);

  /**
   * Load all settings from Firestore
   */
  const loadSettings = async () => {
    try {
      setIsLoading(true);

      // Initialize settings if needed
      if (user?.id) {
        await systemSettingsService.initializeSettings(user.id);
      }

      // Get all settings
      const allSettings = await systemSettingsService.getAllSettings();
      setSettings(allSettings);
      setFilteredSettings(allSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  /**
   * Filter settings by category
   */
  useEffect(() => {
    if (filterCategory === 'all') {
      setFilteredSettings(settings);
    } else {
      setFilteredSettings(settings.filter(s => s.category === filterCategory));
    }
  }, [filterCategory, settings]);

  /**
   * Handle edit setting
   */
  const handleEditSetting = (setting: SystemSetting) => {
    setSelectedSetting(setting);
    
    if (setting.dataType === 'boolean') {
      setEditBoolValue(setting.value as boolean);
    } else {
      setEditValue(String(setting.value));
    }
    
    setIsEditModalVisible(true);
  };

  /**
   * Save setting changes
   */
  const handleSaveSetting = async () => {
    if (!selectedSetting || !user) return;

    try {
      setIsSaving(true);

      let newValue: any;
      
      // Convert value based on data type
      if (selectedSetting.dataType === 'boolean') {
        newValue = editBoolValue;
      } else if (selectedSetting.dataType === 'number') {
        newValue = parseFloat(editValue);
        if (isNaN(newValue)) {
          Alert.alert('Invalid Input', 'Please enter a valid number');
          return;
        }
      } else {
        newValue = editValue;
      }

      // Update in Firestore
      await systemSettingsService.updateSetting(selectedSetting.key, newValue, user.id);

      // Log the change
      await auditLogService.logSystemSettingChange(
        user.id,
        user.email || '',
        `${user.firstName} ${user.lastName}`,
        selectedSetting.key,
        selectedSetting.value,
        newValue
      );

      Alert.alert('Success', 'Setting updated successfully');
      setIsEditModalVisible(false);
      loadSettings(); // Reload settings
    } catch (error) {
      console.error('Error saving setting:', error);
      Alert.alert('Error', 'Failed to save setting');
    } finally {
      setIsSaving(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSettings();
  };

  /**
   * Initialize missing settings in Firestore
   */
  const handleInitializeSettings = async () => {
    if (!user?.id) return;

    Alert.alert(
      'Initialize Settings',
      'This will create any missing default settings in the database. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Initialize',
          onPress: async () => {
            try {
              setIsLoading(true);
              await systemSettingsService.initializeSettings(user.id);
              Alert.alert('Success', 'Missing settings have been initialized');
              loadSettings();
            } catch (error) {
              console.error('Error initializing settings:', error);
              Alert.alert('Error', 'Failed to initialize settings');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading settings...</Text>
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
        <Text style={styles.headerTitle}>System Settings</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={handleInitializeSettings}
            style={styles.initButton}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={18} color={colors.primary} />
            <Text style={styles.initButtonText}>Init</Text>
          </TouchableOpacity>
          <Text style={styles.settingCount}>{filteredSettings.length} settings</Text>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
          {(['all', 'general', 'billing', 'device', 'alerts', 'notifications', 'security'] as const).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                filterCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setFilterCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  filterCategory === category && styles.categoryTextActive,
                ]}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Settings List */}
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredSettings.map(setting => (
          <TouchableOpacity
            key={setting.key}
            style={styles.settingCard}
            onPress={() => handleEditSetting(setting)}
            activeOpacity={0.7}
          >
            <View style={styles.settingHeader}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingKey}>{setting.key}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <View style={[styles.categoryBadge, getCategoryStyle(setting.category, colors)]}>
                <Text style={styles.categoryBadgeText}>{setting.category}</Text>
              </View>
            </View>

            <View style={styles.settingValue}>
              <View style={styles.valueContainer}>
                <Text style={styles.valueLabel}>Current Value:</Text>
                <Text style={styles.valueText}>
                  {setting.dataType === 'boolean'
                    ? setting.value ? '✅ Enabled' : '❌ Disabled'
                    : String(setting.value)}
                </Text>
              </View>
              <View style={styles.settingMeta}>
                <Text style={styles.metaText}>
                  Type: {setting.dataType}
                </Text>
                {!setting.isPublic && (
                  <View style={styles.privateBadge}>
                    <Ionicons name="lock-closed" size={12} color={colors.textSecondary} />
                    <Text style={styles.privateText}>Private</Text>
                  </View>
                )}
              </View>
            </View>

            {setting.updatedAt && (
              <Text style={styles.lastUpdated}>
                Last updated: {setting.updatedAt.toLocaleString()}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {filteredSettings.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="settings-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No settings found</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Setting Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Setting</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {selectedSetting && (
                <>
                  <Text style={styles.modalSettingKey}>{selectedSetting.key}</Text>
                  <Text style={styles.modalSettingDescription}>{selectedSetting.description}</Text>

                  <View style={styles.currentValueBox}>
                    <Text style={styles.currentValueLabel}>Current Value:</Text>
                    <Text style={styles.currentValue}>
                      {selectedSetting.dataType === 'boolean'
                        ? selectedSetting.value ? 'Enabled' : 'Disabled'
                        : String(selectedSetting.value)}
                    </Text>
                  </View>

                  <Text style={styles.inputLabel}>New Value:</Text>
                  
                  {selectedSetting.dataType === 'boolean' ? (
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>
                        {editBoolValue ? 'Enabled' : 'Disabled'}
                      </Text>
                      <Switch
                        value={editBoolValue}
                        onValueChange={setEditBoolValue}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={editBoolValue ? colors.primary : colors.textSecondary}
                      />
                    </View>
                  ) : (
                    <TextInput
                      style={styles.input}
                      value={editValue}
                      onChangeText={setEditValue}
                      placeholder={`Enter ${selectedSetting.dataType}`}
                      placeholderTextColor={colors.textSecondary}
                      keyboardType={selectedSetting.dataType === 'number' ? 'numeric' : 'default'}
                    />
                  )}

                  <View style={styles.warningBox}>
                    <Ionicons name="warning" size={20} color={colors.warning} />
                    <Text style={styles.warningText}>
                      Changing system settings may affect all users. Please be careful.
                    </Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveSetting}
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
    </SafeAreaView>
  );
}

// Helper function to get category style
function getCategoryStyle(category: SettingCategory, colors: any) {
  const styles: Record<SettingCategory, any> = {
    general: { backgroundColor: colors.primary + '30', borderColor: colors.primary },
    billing: { backgroundColor: colors.success + '30', borderColor: colors.success },
    device: { backgroundColor: colors.info + '30', borderColor: colors.info },
    alerts: { backgroundColor: colors.warning + '30', borderColor: colors.warning },
    notifications: { backgroundColor: colors.error + '30', borderColor: colors.error },
    security: { backgroundColor: '#9333EA30', borderColor: '#9333EA' },
  };
  return styles[category];
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
      gap: 12,
    },
    initButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
      gap: 4,
    },
    initButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    settingCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoryFilters: {
      flexDirection: 'row',
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    categoryTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    settingCard: {
      backgroundColor: colors.surface,
      margin: 16,
      marginBottom: 8,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingKey: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    categoryBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    settingValue: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    valueContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    valueLabel: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    valueText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    settingMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    privateBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    privateText: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    lastUpdated: {
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
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
    },
    modalSettingKey: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    modalSettingDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    currentValueBox: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    currentValueLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    currentValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    switchLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    warningBox: {
      flexDirection: 'row',
      backgroundColor: colors.warning + '20',
      padding: 12,
      borderRadius: 8,
      gap: 12,
    },
    warningText: {
      flex: 1,
      fontSize: 13,
      color: colors.textPrimary,
      lineHeight: 18,
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
