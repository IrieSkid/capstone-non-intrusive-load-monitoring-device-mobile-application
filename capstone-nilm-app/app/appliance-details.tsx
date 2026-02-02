/**
 * Appliance Details Screen
 * View and manage individual appliance settings
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { firestoreApplianceService, Appliance } from '@/services/firestoreApplianceService';

const ICONS = ['❄️', '🧊', '🌀', '🔥', '🚿', '🍳', '🍲', '🍚', '🧺', '📺', '💡', '💻', '🔌', '⚡', '🔋'];

export default function ApplianceDetailsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { applianceId } = useLocalSearchParams<{ applianceId: string }>();
  const styles = createStyles(colors);

  const [appliance, setAppliance] = useState<Appliance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [ratedPower, setRatedPower] = useState('');
  const [portNumber, setPortNumber] = useState('');
  const [category, setCategory] = useState('');

  // Classification settings
  const [showClassification, setShowClassification] = useState(false);

  useEffect(() => {
    loadAppliance();
  }, [applianceId]);

  const loadAppliance = async () => {
    if (!applianceId || !user) return;

    try {
      setIsLoading(true);
      // We need to load appliances and find the one we want
      // In a real scenario, we'd have a getApplianceById method
      const appliances = await firestoreApplianceService.getUserAppliances(user.id);
      const found = appliances.find(a => a.id === applianceId);
      
      if (found) {
        setAppliance(found);
        setName(found.name);
        setIcon(found.icon);
        setRatedPower(found.ratedPower.toString());
        setPortNumber(found.portNumber.toString());
        setCategory(found.category);
      } else {
        Alert.alert('Error', 'Appliance not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading appliance:', error);
      Alert.alert('Error', 'Failed to load appliance details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!appliance) return;

    // Validation
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter an appliance name');
      return;
    }
    if (!ratedPower || isNaN(Number(ratedPower)) || Number(ratedPower) <= 0) {
      Alert.alert('Invalid', 'Please enter a valid rated power');
      return;
    }
    if (!portNumber || isNaN(Number(portNumber)) || Number(portNumber) < 1 || Number(portNumber) > 8) {
      Alert.alert('Invalid', 'Please enter a valid port number (1-8)');
      return;
    }

    try {
      setIsSaving(true);
      await firestoreApplianceService.updateAppliance(appliance.id, {
        name,
        icon,
        ratedPower: Number(ratedPower),
        portNumber: Number(portNumber),
        category,
      });

      setAppliance({ ...appliance, name, icon, ratedPower: Number(ratedPower), portNumber: Number(portNumber), category });
      setIsEditing(false);
      Alert.alert('Success', 'Appliance updated successfully');
    } catch (error) {
      console.error('Error updating appliance:', error);
      Alert.alert('Error', 'Failed to update appliance');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Appliance',
      'Are you sure you want to delete this appliance? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (appliance) {
                await firestoreApplianceService.deleteAppliance(appliance.id);
                Alert.alert('Success', 'Appliance deleted successfully', [
                  { text: 'OK', onPress: () => router.back() },
                ]);
              }
            } catch (error) {
              console.error('Error deleting appliance:', error);
              Alert.alert('Error', 'Failed to delete appliance');
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
          <Text style={styles.loadingText}>Loading appliance...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appliance) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Appliance not found</Text>
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
        <Text style={styles.headerTitle}>Appliance Details</Text>
        <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Appliance Header */}
        <View style={styles.applianceHeader}>
          {isEditing ? (
            <View style={styles.iconSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {ICONS.map((iconOption) => (
                  <TouchableOpacity
                    key={iconOption}
                    style={[
                      styles.iconOption,
                      icon === iconOption && styles.iconOptionActive,
                    ]}
                    onPress={() => setIcon(iconOption)}>
                    <Text style={styles.iconOptionText}>{iconOption}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.applianceIconLarge}>
              <Text style={styles.applianceIconTextLarge}>{appliance.icon}</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadgeLarge,
              {
                backgroundColor: appliance.isActive
                  ? colors.success + '20'
                  : colors.divider,
              },
            ]}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: appliance.isActive
                    ? colors.success
                    : colors.textSecondary,
                },
              ]}
            />
            <Text
              style={[
                styles.statusTextLarge,
                {
                  color: appliance.isActive ? colors.success : colors.textSecondary,
                },
              ]}>
              {appliance.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Appliance name"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.fieldValue}>{appliance.name}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Category</Text>
              <Text style={styles.fieldValue}>{appliance.category}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Port Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={portNumber}
                  onChangeText={setPortNumber}
                  placeholder="1-8"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ) : (
                <Text style={styles.fieldValue}>Port {appliance.portNumber}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Rated Power</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={ratedPower}
                  onChangeText={setRatedPower}
                  placeholder="Watts"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.fieldValue}>{appliance.ratedPower} W</Text>
              )}
            </View>

            {appliance.currentPower !== undefined && appliance.currentPower > 0 && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Current Power</Text>
                <Text style={[styles.fieldValue, { color: colors.primary }]}>
                  {appliance.currentPower.toFixed(0)} W
                </Text>
              </View>
            )}

            {appliance.usageMinutes !== undefined && appliance.usageMinutes > 0 && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Total Usage</Text>
                <Text style={styles.fieldValue}>
                  {Math.floor(appliance.usageMinutes / 60)}h {appliance.usageMinutes % 60}m
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Classification Settings */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowClassification(!showClassification)}>
            <Text style={styles.sectionTitle}>Classification Settings</Text>
            <Text style={styles.chevron}>{showClassification ? '▼' : '▶'}</Text>
          </TouchableOpacity>

          {showClassification && (
            <View style={styles.card}>
              <Text style={styles.classificationDescription}>
                Configure how this appliance is detected and classified by the NILM system.
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto-Detection</Text>
                  <Text style={styles.settingDescription}>
                    Automatically detect when turned on/off
                  </Text>
                </View>
                <Switch
                  value={true}
                  onValueChange={() => {
                    Alert.alert('Info', 'Auto-detection is always enabled in current version');
                  }}
                  trackColor={{ true: colors.primary }}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Power Threshold</Text>
                  <Text style={styles.settingDescription}>
                    Minimum: {Math.floor(appliance.ratedPower * 0.7)}W | Maximum:{' '}
                    {Math.floor(appliance.ratedPower * 1.3)}W
                  </Text>
                </View>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Detection Confidence</Text>
                  <Text style={styles.settingDescription}>
                    Current: 85% - High confidence detection
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  Alert.alert(
                    'Train Appliance',
                    'To improve detection accuracy:\n\n1. Turn off all other appliances\n2. Turn on this appliance\n3. Keep it running for 30 seconds\n4. The system will learn its power signature'
                  )
                }>
                <Text style={styles.actionButtonText}>🎓 Train Detection Model</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>

          <View style={[styles.card, { borderColor: colors.error + '40' }]}>
            <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
              <View style={styles.dangerButtonContent}>
                <Text style={styles.dangerButtonIcon}>🗑️</Text>
                <View style={styles.dangerButtonText}>
                  <Text style={[styles.dangerButtonTitle, { color: colors.error }]}>
                    Delete Appliance
                  </Text>
                  <Text style={styles.dangerButtonDescription}>
                    Permanently remove this appliance
                  </Text>
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
    applianceHeader: {
      alignItems: 'center',
      padding: 32,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    applianceIconLarge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight + '30',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    applianceIconTextLarge: {
      fontSize: 40,
    },
    iconSelector: {
      marginBottom: 16,
    },
    iconOption: {
      width: 60,
      height: 60,
      backgroundColor: colors.background,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 2,
      borderColor: colors.divider,
    },
    iconOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    iconOptionText: {
      fontSize: 32,
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    chevron: {
      fontSize: 14,
      color: colors.textSecondary,
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
    classificationDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    actionButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      marginTop: 12,
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
    },
    dangerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    dangerButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    dangerButtonIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    dangerButtonText: {
      flex: 1,
    },
    dangerButtonTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    dangerButtonDescription: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
