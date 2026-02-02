/**
 * Add Appliance Screen
 * Add a new appliance to monitor
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
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { firestoreApplianceService } from '@/services/firestoreApplianceService';

const APPLIANCE_TYPES = [
  { category: 'cooling', icon: '❄️', label: 'Cooling', examples: ['Air Conditioner', 'Fan', 'Refrigerator'] },
  { category: 'heating', icon: '🔥', label: 'Heating', examples: ['Heater', 'Water Heater', 'Iron'] },
  { category: 'cooking', icon: '🍳', label: 'Cooking', examples: ['Oven', 'Microwave', 'Rice Cooker'] },
  { category: 'cleaning', icon: '🧺', label: 'Cleaning', examples: ['Washer', 'Dryer', 'Vacuum'] },
  { category: 'entertainment', icon: '📺', label: 'Entertainment', examples: ['TV', 'Gaming Console', 'Sound System'] },
  { category: 'lighting', icon: '💡', label: 'Lighting', examples: ['Lights', 'Lamp', 'LED Strips'] },
  { category: 'electronics', icon: '💻', label: 'Electronics', examples: ['Computer', 'Phone Charger', 'Router'] },
  { category: 'other', icon: '🔌', label: 'Other', examples: ['Pump', 'Motor', 'Other Device'] },
];

const COMMON_APPLIANCES = [
  { name: 'Air Conditioner', icon: '❄️', category: 'cooling', ratedPower: 1500, portNumber: 1 },
  { name: 'Refrigerator', icon: '🧊', category: 'cooling', ratedPower: 150, portNumber: 2 },
  { name: 'Electric Fan', icon: '🌀', category: 'cooling', ratedPower: 75, portNumber: 3 },
  { name: 'Television', icon: '📺', category: 'entertainment', ratedPower: 100, portNumber: 4 },
  { name: 'Water Heater', icon: '🚿', category: 'heating', ratedPower: 1200, portNumber: 5 },
  { name: 'Washing Machine', icon: '🧺', category: 'cleaning', ratedPower: 500, portNumber: 6 },
  { name: 'Microwave', icon: '🍲', category: 'cooking', ratedPower: 1000, portNumber: 7 },
  { name: 'Rice Cooker', icon: '🍚', category: 'cooking', ratedPower: 400, portNumber: 8 },
  { name: 'Computer', icon: '💻', category: 'electronics', ratedPower: 200, portNumber: 1 },
  { name: 'LED Lights', icon: '💡', category: 'lighting', ratedPower: 60, portNumber: 2 },
];

export default function AddApplianceScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const styles = createStyles(colors);

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [ratedPower, setRatedPower] = useState('');
  const [portNumber, setPortNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAdd = (appliance: typeof COMMON_APPLIANCES[0]) => {
    setName(appliance.name);
    setSelectedCategory(appliance.category);
    setSelectedIcon(appliance.icon);
    setRatedPower(appliance.ratedPower.toString());
    setPortNumber(appliance.portNumber.toString());
  };

  const handleSubmit = async () => {
    if (!user || !deviceId) return;

    // Validation
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter an appliance name');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Required', 'Please select a category');
      return;
    }
    if (!ratedPower || isNaN(Number(ratedPower)) || Number(ratedPower) <= 0) {
      Alert.alert('Invalid', 'Please enter a valid rated power (watts)');
      return;
    }
    if (!portNumber || isNaN(Number(portNumber)) || Number(portNumber) < 1 || Number(portNumber) > 8) {
      Alert.alert('Invalid', 'Please enter a valid port number (1-8)');
      return;
    }

    try {
      setIsSubmitting(true);

      await firestoreApplianceService.addAppliance({
        userId: user.id,
        deviceId,
        name: name.trim(),
        category: selectedCategory,
        icon: selectedIcon || '🔌',
        ratedPower: Number(ratedPower),
        portNumber: Number(portNumber),
        isActive: false,
        currentPower: 0,
        usageMinutes: 0,
      });

      Alert.alert(
        'Success!',
        'Appliance added successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error adding appliance:', error);
      Alert.alert('Error', 'Failed to add appliance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Appliance</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {/* Quick Add */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Add</Text>
            <Text style={styles.sectionDescription}>Tap to auto-fill common appliances</Text>
            <View style={styles.quickAddGrid}>
              {COMMON_APPLIANCES.slice(0, 6).map((appliance) => (
                <TouchableOpacity
                  key={appliance.name}
                  style={styles.quickAddItem}
                  onPress={() => handleQuickAdd(appliance)}>
                  <Text style={styles.quickAddIcon}>{appliance.icon}</Text>
                  <Text style={styles.quickAddName}>{appliance.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Appliance Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Appliance Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Living Room AC"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryGrid}>
              {APPLIANCE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.category}
                  style={[
                    styles.categoryItem,
                    selectedCategory === type.category && styles.categoryItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(type.category);
                    if (!selectedIcon) setSelectedIcon(type.icon);
                  }}>
                  <Text style={styles.categoryIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory === type.category && styles.categoryLabelActive,
                    ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Icon Selection */}
          {selectedCategory && (
            <View style={styles.section}>
              <Text style={styles.label}>Icon (Optional)</Text>
              <View style={styles.iconGrid}>
                {APPLIANCE_TYPES.find(t => t.category === selectedCategory)?.examples.map((example, idx) => {
                  const icons = ['❄️', '🧊', '🌀', '🔥', '🚿', '🍳', '🍲', '🍚', '🧺', '📺', '💡', '💻', '🔌'];
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.iconItem,
                        selectedIcon === icons[idx] && styles.iconItemActive,
                      ]}
                      onPress={() => setSelectedIcon(icons[idx])}>
                      <Text style={styles.iconText}>{icons[idx]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Port Number */}
          <View style={styles.section}>
            <Text style={styles.label}>Port Number (1-8) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1"
              placeholderTextColor={colors.textSecondary}
              value={portNumber}
              onChangeText={setPortNumber}
              keyboardType="numeric"
              maxLength={1}
            />
            <Text style={styles.hint}>
              Select the port number on the device where this appliance is connected (1-8)
            </Text>
          </View>

          {/* Rated Power */}
          <View style={styles.section}>
            <Text style={styles.label}>Rated Power (Watts) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1500"
              placeholderTextColor={colors.textSecondary}
              value={ratedPower}
              onChangeText={setRatedPower}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>
              Check the appliance label or manual for power rating
            </Text>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ℹ️ After adding, the device will automatically detect when this appliance is turned
              on based on its power signature.
            </Text>
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Add Appliance</Text>
            )}
          </TouchableOpacity>
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
      fontSize: 24,
      color: colors.textPrimary,
      width: 32,
      textAlign: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    sectionDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    quickAddGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickAddItem: {
      width: '30%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    quickAddIcon: {
      fontSize: 32,
      marginBottom: 4,
    },
    quickAddName: {
      fontSize: 11,
      color: colors.textPrimary,
      textAlign: 'center',
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
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryItem: {
      width: '22%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.divider,
    },
    categoryItemActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    categoryIcon: {
      fontSize: 28,
      marginBottom: 4,
    },
    categoryLabel: {
      fontSize: 11,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    categoryLabelActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    iconItem: {
      width: 56,
      height: 56,
      backgroundColor: colors.surface,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.divider,
    },
    iconItemActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    iconText: {
      fontSize: 28,
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
    cancelButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.divider,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    submitButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });
