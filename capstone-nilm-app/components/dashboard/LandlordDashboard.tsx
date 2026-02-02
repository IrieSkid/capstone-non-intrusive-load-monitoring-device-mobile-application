/**
 * Landlord Dashboard
 * Multi-property/unit management view for landlords
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { deviceService } from '@/services/deviceService';
import { readingService } from '@/services/readingService';
import { Device } from '@/types/device.types';
import { RealtimeReading } from '@/types/reading.types';

interface PropertyStats {
  deviceId: string;
  deviceName: string;
  location: string;
  currentPower: number;
  todayEnergy: number;
  todayCost: number;
  status: 'online' | 'offline';
  lastUpdate: Date;
}

export function LandlordDashboard() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    totalPower: 0,
    totalEnergy: 0,
    totalCost: 0,
  });

  const styles = createStyles(colors);

  /**
   * Load all properties/devices managed by landlord
   */
  const loadProperties = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Get all devices for this landlord
      const devices = await deviceService.getUserDevices(user.id);

      // Get latest readings for each device
      const propertyStatsPromises = devices.map(async (device: Device) => {
        try {
          // Get today's readings
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const readings = await readingService.getReadingsByDateRange(
            user.id,
            device.id,
            today,
            new Date()
          );

          // Calculate stats
          const latestReading = readings[0];
          const todayEnergy = readings.reduce((sum, r) => sum + r.energy, 0);
          const todayCost = todayEnergy * 0.012; // ₱12/kWh

          return {
            deviceId: device.id,
            deviceName: device.name,
            location: device.location || 'No location',
            currentPower: latestReading?.power || 0,
            todayEnergy,
            todayCost,
            status: (Date.now() - new Date(latestReading?.timestamp || 0).getTime() < 60000) 
              ? 'online' as const 
              : 'offline' as const,
            lastUpdate: latestReading?.timestamp ? new Date(latestReading.timestamp) : new Date(),
          };
        } catch (error) {
          console.error(`Error loading stats for device ${device.id}:`, error);
          return {
            deviceId: device.id,
            deviceName: device.name,
            location: device.location || 'No location',
            currentPower: 0,
            todayEnergy: 0,
            todayCost: 0,
            status: 'offline' as const,
            lastUpdate: new Date(),
          };
        }
      });

      const propertyStats = await Promise.all(propertyStatsPromises);
      setProperties(propertyStats);

      // Calculate totals
      const totals = {
        totalDevices: propertyStats.length,
        onlineDevices: propertyStats.filter(p => p.status === 'online').length,
        totalPower: propertyStats.reduce((sum, p) => sum + p.currentPower, 0),
        totalEnergy: propertyStats.reduce((sum, p) => sum + p.todayEnergy, 0),
        totalCost: propertyStats.reduce((sum, p) => sum + p.todayCost, 0),
      };
      setTotalStats(totals);

    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProperties();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadProperties, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProperties();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Property Management</Text>
          <Text style={styles.headerSubtitle}>
            {totalStats.onlineDevices}/{totalStats.totalDevices} Properties Online
          </Text>
        </View>
        <View style={styles.roleBadge}>
          <Ionicons name="business" size={16} color={colors.primary} />
          <Text style={styles.roleBadgeText}>Landlord</Text>
        </View>
      </View>

      {/* Overall Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primaryLight + '20' }]}>
          <Ionicons name="business-outline" size={24} color={colors.primary} />
          <Text style={styles.statValue}>{totalStats.totalDevices}</Text>
          <Text style={styles.statLabel}>Properties</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="flash" size={24} color={colors.success} />
          <Text style={styles.statValue}>{totalStats.totalPower.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total kW</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.warning + '20' }]}>
          <Ionicons name="trending-up" size={24} color={colors.warning} />
          <Text style={styles.statValue}>{totalStats.totalEnergy.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Today kWh</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.error + '20' }]}>
          <Ionicons name="cash" size={24} color={colors.error} />
          <Text style={styles.statValue}>₱{totalStats.totalCost.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Today Cost</Text>
        </View>
      </View>

      {/* Properties List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Properties</Text>
        
        {properties.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No properties registered</Text>
            <Text style={styles.emptyStateSubtext}>
              Add devices to start monitoring your properties
            </Text>
          </View>
        ) : (
          properties.map((property) => (
            <TouchableOpacity
              key={property.deviceId}
              style={styles.propertyCard}
              activeOpacity={0.7}
            >
              {/* Status Indicator */}
              <View style={[
                styles.statusDot,
                { backgroundColor: property.status === 'online' ? colors.success : colors.textSecondary }
              ]} />

              {/* Property Info */}
              <View style={styles.propertyHeader}>
                <View style={styles.propertyTitleRow}>
                  <Ionicons name="home" size={20} color={colors.primary} />
                  <Text style={styles.propertyName}>{property.deviceName}</Text>
                </View>
                <Text style={styles.propertyLocation}>{property.location}</Text>
              </View>

              {/* Property Stats */}
              <View style={styles.propertyStats}>
                <View style={styles.propertyStatItem}>
                  <Text style={styles.propertyStatValue}>
                    {property.currentPower.toFixed(2)} kW
                  </Text>
                  <Text style={styles.propertyStatLabel}>Current</Text>
                </View>

                <View style={styles.propertyStatDivider} />

                <View style={styles.propertyStatItem}>
                  <Text style={styles.propertyStatValue}>
                    {property.todayEnergy.toFixed(2)} kWh
                  </Text>
                  <Text style={styles.propertyStatLabel}>Today</Text>
                </View>

                <View style={styles.propertyStatDivider} />

                <View style={styles.propertyStatItem}>
                  <Text style={styles.propertyStatValue}>
                    ₱{property.todayCost.toFixed(2)}
                  </Text>
                  <Text style={styles.propertyStatLabel}>Cost</Text>
                </View>
              </View>

              {/* Last Update */}
              <View style={styles.propertyFooter}>
                <Text style={styles.propertyLastUpdate}>
                  Last update: {property.lastUpdate.toLocaleTimeString()}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          As a Landlord, you can monitor all properties and units under your management. 
          Tap on any property to view detailed analytics.
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.primaryLight + '30',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  propertyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  propertyHeader: {
    marginBottom: 16,
  },
  propertyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  propertyLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 28,
  },
  propertyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  propertyStatItem: {
    alignItems: 'center',
  },
  propertyStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  propertyStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  propertyStatDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  propertyLastUpdate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoNote: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight + '20',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
