/**
 * Add Device Screen
 * Wizard flow for adding a new IoT device
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { deviceService } from '@/services/deviceService';

type SetupStep = 'info' | 'network' | 'location' | 'review';

export default function AddDeviceScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(colors);

  const [currentStep, setCurrentStep] = useState<SetupStep>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('energy_monitor');
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [location, setLocation] = useState('');

  const deviceTypes = [
    { value: 'energy_monitor', label: 'Energy Monitor', icon: '⚡' },
    { value: 'smart_meter', label: 'Smart Meter', icon: '📊' },
    { value: 'power_analyzer', label: 'Power Analyzer', icon: '🔬' },
  ];

  const handleNext = () => {
    // Validation
    if (currentStep === 'info') {
      if (!deviceName.trim()) {
        Alert.alert('Required', 'Please enter a device name');
        return;
      }
      setCurrentStep('network');
    } else if (currentStep === 'network') {
      if (!macAddress.trim()) {
        Alert.alert('Required', 'Please enter the MAC address');
        return;
      }
      setCurrentStep('location');
    } else if (currentStep === 'location') {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'network') setCurrentStep('info');
    else if (currentStep === 'location') setCurrentStep('network');
    else if (currentStep === 'review') setCurrentStep('location');
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      await deviceService.registerDevice(user.id, {
        name: deviceName,
        type: deviceType,
        macAddress: macAddress.toUpperCase(),
        ipAddress: ipAddress || undefined,
        location: location || undefined,
        isOnline: false,
        lastSeen: new Date(),
        firmwareVersion: '1.0.0',
      });

      Alert.alert(
        'Success!',
        'Device added successfully. You can now start monitoring your energy consumption.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error adding device:', error);
      Alert.alert('Error', 'Failed to add device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = ['info', 'network', 'location', 'review'];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= currentIndex && styles.stepCircleActive,
              ]}>
              <Text
                style={[
                  styles.stepNumber,
                  index <= currentIndex && styles.stepNumberActive,
                ]}>
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index < currentIndex && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'info':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Device Information</Text>
            <Text style={styles.stepDescription}>
              Let's start by giving your device a name and selecting its type
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Device Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Main Breaker Monitor"
                placeholderTextColor={colors.textSecondary}
                value={deviceName}
                onChangeText={setDeviceName}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Device Type *</Text>
              <View style={styles.typeSelector}>
                {deviceTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeOption,
                      deviceType === type.value && styles.typeOptionActive,
                    ]}
                    onPress={() => setDeviceType(type.value)}>
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.typeLabel,
                        deviceType === type.value && styles.typeLabelActive,
                      ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'network':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Network Configuration</Text>
            <Text style={styles.stepDescription}>
              Enter the device's network details for connection
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>MAC Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="AA:BB:CC:DD:EE:FF"
                placeholderTextColor={colors.textSecondary}
                value={macAddress}
                onChangeText={setMacAddress}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Text style={styles.hint}>
                Found on the device label or in device settings
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>IP Address (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="192.168.1.100"
                placeholderTextColor={colors.textSecondary}
                value={ipAddress}
                onChangeText={setIpAddress}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.hint}>Static IP or leave empty for DHCP</Text>
            </View>
          </View>
        );

      case 'location':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Device Location</Text>
            <Text style={styles.stepDescription}>
              Where is this device installed? (Optional)
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Main Breaker, Living Room"
                placeholderTextColor={colors.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.locationSuggestions}>
              {['Main Breaker', 'Utility Room', 'Garage', 'Kitchen'].map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={styles.suggestionChip}
                  onPress={() => setLocation(loc)}>
                  <Text style={styles.suggestionText}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Confirm</Text>
            <Text style={styles.stepDescription}>
              Please verify the information below
            </Text>

            <View style={styles.reviewSection}>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Device Name</Text>
                <Text style={styles.reviewValue}>{deviceName}</Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Device Type</Text>
                <Text style={styles.reviewValue}>
                  {deviceTypes.find((t) => t.value === deviceType)?.label}
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>MAC Address</Text>
                <Text style={styles.reviewValue}>{macAddress.toUpperCase()}</Text>
              </View>

              {ipAddress && (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>IP Address</Text>
                  <Text style={styles.reviewValue}>{ipAddress}</Text>
                </View>
              )}

              {location && (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Location</Text>
                  <Text style={styles.reviewValue}>{location}</Text>
                </View>
              )}
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ After adding, the device will appear in your devices list. Make sure
                the device is powered on and connected to your network.
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Device</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {renderStepContent()}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          {currentStep !== 'info' && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          {currentStep !== 'review' ? (
            <TouchableOpacity
              style={[styles.primaryButton, currentStep === 'info' && { flex: 1 }]}
              onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSubmit}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Add Device</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
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
    closeButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 24,
      color: colors.textPrimary,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stepCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.divider,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepCircleActive: {
      backgroundColor: colors.primary,
    },
    stepNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    stepNumberActive: {
      color: '#fff',
    },
    stepLine: {
      width: 40,
      height: 2,
      backgroundColor: colors.divider,
      marginHorizontal: 8,
    },
    stepLineActive: {
      backgroundColor: colors.primary,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    stepContent: {
      marginBottom: 24,
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    stepDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.textPrimary,
    },
    hint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    typeSelector: {
      gap: 12,
    },
    typeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.divider,
      borderRadius: 12,
      padding: 16,
    },
    typeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    typeIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    typeLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    typeLabelActive: {
      color: colors.primary,
    },
    locationSuggestions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
    },
    suggestionChip: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    suggestionText: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    reviewSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    reviewItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    reviewLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    reviewValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    infoBox: {
      backgroundColor: colors.primaryLight + '20',
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoText: {
      fontSize: 12,
      color: colors.textPrimary,
      lineHeight: 18,
    },
    actions: {
      flexDirection: 'row',
      padding: 16,
      gap: 12,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.divider,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });
