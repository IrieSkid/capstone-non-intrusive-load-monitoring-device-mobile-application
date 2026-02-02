/**
 * Device Status Component
 * Shows current device connection status
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Device } from '@/types/device.types';

interface DeviceStatusProps {
  device: Device;
}

export function DeviceStatus({ device }: DeviceStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'maintenance':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Online';
      case 'inactive':
        return 'Offline';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Unknown';
    }
  };

  const lastSeenText = device.lastSeenAt
    ? new Date(device.lastSeenAt).toLocaleString()
    : 'Never';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">📱 Device Status</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(device.status) }]}>
          <View style={styles.pulse} />
          <ThemedText style={styles.statusText}>{getStatusText(device.status)}</ThemedText>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Device Name:</ThemedText>
          <ThemedText style={styles.value}>{device.deviceName}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Location:</ThemedText>
          <ThemedText style={styles.value}>{device.location || 'Not set'}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>MAC Address:</ThemedText>
          <ThemedText style={styles.value}>{device.macAddress}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>IP Address:</ThemedText>
          <ThemedText style={styles.value}>{device.ipAddress || 'N/A'}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Firmware:</ThemedText>
          <ThemedText style={styles.value}>v{device.firmwareVersion || '1.0.0'}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Last Seen:</ThemedText>
          <ThemedText style={styles.value}>{lastSeenText}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});
