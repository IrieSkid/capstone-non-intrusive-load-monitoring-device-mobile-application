/**
 * Date Range Picker Component
 * Allows users to select custom date ranges for reports
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date) => void;
}

type Preset = {
  label: string;
  days: number;
};

const PRESETS: Preset[] = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 14 Days', days: 14 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'This Month', days: 0 }, // Special case
  { label: 'Last Month', days: -1 }, // Special case
];

export function DateRangePicker({ visible, onClose, onApply }: DateRangePickerProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  const [selectedPreset, setSelectedPreset] = useState<string>('Last 7 Days');

  const getDateRange = (preset: Preset): { start: Date; end: Date } => {
    const end = new Date();
    const start = new Date();

    if (preset.label === 'This Month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (preset.label === 'Last Month') {
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setDate(0); // Last day of previous month
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(end.getDate() - preset.days + 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset.label);
  };

  const handleApply = () => {
    const preset = PRESETS.find(p => p.label === selectedPreset);
    if (preset) {
      const { start, end } = getDateRange(preset);
      onApply(start, end);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Date Range</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Presets */}
          <View style={styles.presets}>
            {PRESETS.map(preset => {
              const { start, end } = getDateRange(preset);
              const isSelected = selectedPreset === preset.label;

              return (
                <TouchableOpacity
                  key={preset.label}
                  style={[
                    styles.presetButton,
                    isSelected && styles.presetButtonSelected,
                  ]}
                  onPress={() => handlePresetSelect(preset)}>
                  <View style={styles.presetContent}>
                    <Text
                      style={[
                        styles.presetLabel,
                        isSelected && styles.presetLabelSelected,
                      ]}>
                      {preset.label}
                    </Text>
                    <Text
                      style={[
                        styles.presetDate,
                        isSelected && styles.presetDateSelected,
                      ]}>
                      {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                      {end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    closeButton: {
      fontSize: 24,
      color: colors.textSecondary,
      paddingHorizontal: 10,
    },
    presets: {
      padding: 16,
      gap: 12,
    },
    presetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.divider,
      backgroundColor: colors.background,
    },
    presetButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
    presetContent: {
      flex: 1,
    },
    presetLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    presetLabelSelected: {
      color: colors.primary,
    },
    presetDate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    presetDateSelected: {
      color: colors.primary,
    },
    checkmark: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
      marginLeft: 12,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    button: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    applyButton: {
      backgroundColor: colors.primary,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
