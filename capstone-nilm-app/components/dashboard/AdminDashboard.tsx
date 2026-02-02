/**
 * Admin Dashboard
 * System administration and monitoring overview
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
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface SystemStats {
  totalUsers: number;
  tenants: number;
  landlords: number;
  admins: number;
  totalDevices: number;
  activeDevices: number;
  totalReadingsToday: number;
  totalEnergyToday: number;
}

export function AdminDashboard() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    tenants: 0,
    landlords: 0,
    admins: 0,
    totalDevices: 0,
    activeDevices: 0,
    totalReadingsToday: 0,
    totalEnergyToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = createStyles(colors);

  /**
   * Load system statistics
   */
  const loadSystemStats = async () => {
    try {
      setIsLoading(true);

      // Count users by role
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let tenantCount = 0;
      let landlordCount = 0;
      let adminCount = 0;

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        switch (userData.role) {
          case 'tenant':
            tenantCount++;
            break;
          case 'landlord':
            landlordCount++;
            break;
          case 'admin':
            adminCount++;
            break;
        }
      });

      // Count devices
      const devicesRef = collection(db, 'devices');
      const devicesSnapshot = await getDocs(devicesRef);
      const totalDevices = devicesSnapshot.size;

      // Count active devices (online in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      let activeDeviceCount = 0;

      for (const deviceDoc of devicesSnapshot.docs) {
        const deviceData = deviceDoc.data();
        if (deviceData.lastSeen && deviceData.lastSeen.toDate() > fiveMinutesAgo) {
          activeDeviceCount++;
        }
      }

      // Count today's readings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const readingsRef = collection(db, 'realTimeReadings');
      const todayReadingsQuery = query(
        readingsRef,
        where('timestamp', '>=', today)
      );
      const readingsSnapshot = await getDocs(todayReadingsQuery);
      
      let totalEnergy = 0;
      readingsSnapshot.forEach(doc => {
        const reading = doc.data();
        totalEnergy += reading.energy || 0;
      });

      setStats({
        totalUsers: usersSnapshot.size,
        tenants: tenantCount,
        landlords: landlordCount,
        admins: adminCount,
        totalDevices,
        activeDevices: activeDeviceCount,
        totalReadingsToday: readingsSnapshot.size,
        totalEnergyToday: totalEnergy,
      });

    } catch (error) {
      console.error('Error loading system stats:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSystemStats();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadSystemStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSystemStats();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading system stats...</Text>
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
          <Text style={styles.headerTitle}>System Administration</Text>
          <Text style={styles.headerSubtitle}>Complete system overview</Text>
        </View>
        <View style={styles.roleBadge}>
          <Ionicons name="shield-checkmark" size={16} color={colors.error} />
          <Text style={[styles.roleBadgeText, { color: colors.error }]}>Admin</Text>
        </View>
      </View>

      {/* User Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="people" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="person" size={28} color={colors.success} />
            <Text style={styles.statValue}>{stats.tenants}</Text>
            <Text style={styles.statLabel}>Tenants</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="business" size={28} color={colors.warning} />
            <Text style={styles.statValue}>{stats.landlords}</Text>
            <Text style={styles.statLabel}>Landlords</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.error + '20' }]}>
            <Ionicons name="shield" size={28} color={colors.error} />
            <Text style={styles.statValue}>{stats.admins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
        </View>
      </View>

      {/* Device Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primaryLight + '20' }]}>
            <Ionicons name="hardware-chip" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalDevices}</Text>
            <Text style={styles.statLabel}>Total Devices</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={styles.statValue}>{stats.activeDevices}</Text>
            <Text style={styles.statLabel}>Active Now</Text>
          </View>
        </View>
      </View>

      {/* System Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.info + '20' }]}>
            <Ionicons name="pulse" size={28} color={colors.info} />
            <Text style={styles.statValue}>{stats.totalReadingsToday.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Readings</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="flash" size={28} color={colors.warning} />
            <Text style={styles.statValue}>{stats.totalEnergyToday.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total kWh</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => router.push('/admin/users')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Users</Text>
            <Text style={styles.actionSubtitle}>View and edit user accounts</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => router.push('/admin/devices')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="hardware-chip-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Manage Devices</Text>
            <Text style={styles.actionSubtitle}>Configure and reassign devices</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => router.push('/admin/audit-logs')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Audit Logs</Text>
            <Text style={styles.actionSubtitle}>View system activity trail</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.7}
          onPress={() => router.push('/admin/settings')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="settings-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>System Settings</Text>
            <Text style={styles.actionSubtitle}>Configure system parameters</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Admin Info */}
      <View style={styles.infoNote}>
        <Ionicons name="shield-checkmark" size={20} color={colors.error} />
        <Text style={styles.infoText}>
          You have full administrative access to the system. Use these privileges responsibly 
          to manage users, devices, and system configuration.
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
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoNote: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.error + '20',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
