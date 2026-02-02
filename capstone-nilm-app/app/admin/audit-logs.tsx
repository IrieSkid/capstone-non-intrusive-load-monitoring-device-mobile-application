/**
 * Admin - Audit Logs Screen
 * View system activity and audit trail
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRBAC } from '@/contexts/RBACContext';
import {
  auditLogService,
  AuditLog,
  AuditAction,
  EntityType,
} from '@/services/auditLogService';

export default function AdminAuditLogsScreen() {
  const { colors } = useTheme();
  const { isAdmin } = useRBAC();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterAction, setFilterAction] = useState<AuditAction | 'all'>('all');
  const [filterEntity, setFilterEntity] = useState<EntityType | 'all'>('all');

  const styles = createStyles(colors);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      Alert.alert('Access Denied', 'You do not have permission to access this page.');
      router.back();
    }
  }, [isAdmin]);

  /**
   * Load audit logs from Firestore
   */
  const loadLogs = async () => {
    try {
      setIsLoading(true);
      
      // Get recent activity (last 100 logs)
      const recentLogs = await auditLogService.getRecentActivity(100);
      setLogs(recentLogs);
      setFilteredLogs(recentLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      Alert.alert('Error', 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadLogs();
    }
  }, [isAdmin]);

  /**
   * Filter logs by action and entity type
   */
  useEffect(() => {
    let filtered = logs;

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterEntity !== 'all') {
      filtered = filtered.filter(log => log.entityType === filterEntity);
    }

    setFilteredLogs(filtered);
  }, [filterAction, filterEntity, logs]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading audit logs...</Text>
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
        <Text style={styles.headerTitle}>Audit Logs</Text>
        <View style={styles.headerRight}>
          <Text style={styles.logCount}>{filteredLogs.length} logs</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Action:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['all', 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE', 'ACTIVATE', 'DEACTIVATE', 'REASSIGN'] as const).map(action => (
            <TouchableOpacity
              key={action}
              style={[
                styles.filterChip,
                filterAction === action && styles.filterChipActive,
              ]}
              onPress={() => setFilterAction(action)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterAction === action && styles.filterTextActive,
                ]}
              >
                {action === 'all' ? 'All' : action.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterLabel}>Filter by Entity:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {(['all', 'user', 'device', 'appliance', 'system_setting'] as const).map(entity => (
            <TouchableOpacity
              key={entity}
              style={[
                styles.filterChip,
                filterEntity === entity && styles.filterChipActive,
              ]}
              onPress={() => setFilterEntity(entity)}
            >
              <Text
                style={[
                  styles.filterText,
                  filterEntity === entity && styles.filterTextActive,
                ]}
              >
                {entity === 'all' ? 'All' : entity.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Logs List */}
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredLogs.map((log, index) => (
          <View key={`${log.id}-${index}`} style={styles.logCard}>
            {/* Log Header */}
            <View style={styles.logHeader}>
              <View style={[styles.actionBadge, getActionStyle(log.action, colors)]}>
                <Text style={styles.actionText}>{log.action}</Text>
              </View>
              <Text style={styles.logTime}>
                {log.createdAt.toLocaleString()}
              </Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Ionicons name="person" size={16} color={colors.primary} />
              <Text style={styles.userName}>{log.userName}</Text>
              <Text style={styles.userEmail}>({log.userEmail})</Text>
            </View>

            {/* Description */}
            <Text style={styles.logDescription}>{log.description}</Text>

            {/* Entity Info */}
            <View style={styles.entityInfo}>
              <View style={[styles.entityBadge, getEntityStyle(log.entityType, colors)]}>
                <Text style={styles.entityText}>{log.entityType}</Text>
              </View>
              {log.entityName && (
                <Text style={styles.entityName}>→ {log.entityName}</Text>
              )}
            </View>

            {/* Before/After Values */}
            {(log.oldValue || log.newValue) && (
              <View style={styles.changesContainer}>
                {log.oldValue && (
                  <View style={styles.changeBox}>
                    <Text style={styles.changeLabel}>Before:</Text>
                    <Text style={styles.changeValue}>
                      {JSON.stringify(log.oldValue, null, 2)}
                    </Text>
                  </View>
                )}
                {log.newValue && (
                  <View style={styles.changeBox}>
                    <Text style={styles.changeLabel}>After:</Text>
                    <Text style={styles.changeValue}>
                      {JSON.stringify(log.newValue, null, 2)}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {filteredLogs.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No audit logs found</Text>
            <Text style={styles.emptyStateSubtext}>
              System activity will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.infoText}>
          Audit logs track all administrative actions for security and accountability. 
          Logs are stored permanently in Firestore.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Helper function to get action style
function getActionStyle(action: AuditAction, colors: any) {
  const styles: Record<string, any> = {
    CREATE: { backgroundColor: colors.success + '30', borderColor: colors.success },
    UPDATE: { backgroundColor: colors.info + '30', borderColor: colors.info },
    DELETE: { backgroundColor: colors.error + '30', borderColor: colors.error },
    ROLE_CHANGE: { backgroundColor: colors.warning + '30', borderColor: colors.warning },
    ACTIVATE: { backgroundColor: colors.success + '30', borderColor: colors.success },
    DEACTIVATE: { backgroundColor: colors.error + '30', borderColor: colors.error },
    REASSIGN: { backgroundColor: colors.primary + '30', borderColor: colors.primary },
    LOGIN: { backgroundColor: colors.info + '30', borderColor: colors.info },
    LOGOUT: { backgroundColor: colors.textSecondary + '30', borderColor: colors.textSecondary },
    VIEW: { backgroundColor: colors.primaryLight + '30', borderColor: colors.primaryLight },
  };
  return styles[action] || { backgroundColor: colors.border, borderColor: colors.border };
}

// Helper function to get entity style
function getEntityStyle(entity: EntityType, colors: any) {
  const styles: Record<string, any> = {
    user: { backgroundColor: colors.primary + '20' },
    device: { backgroundColor: colors.success + '20' },
    appliance: { backgroundColor: colors.info + '20' },
    alert_rule: { backgroundColor: colors.warning + '20' },
    notification: { backgroundColor: colors.error + '20' },
    electricity_rate: { backgroundColor: colors.primaryLight + '20' },
    system_setting: { backgroundColor: '#9333EA20' },
  };
  return styles[entity] || { backgroundColor: colors.border };
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
    logCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
      marginTop: 8,
    },
    filterScroll: {
      marginBottom: 8,
    },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.background,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    filterTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    logCard: {
      backgroundColor: colors.surface,
      margin: 16,
      marginBottom: 8,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    actionBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    actionText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    logTime: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 6,
    },
    userName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    userEmail: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    logDescription: {
      fontSize: 14,
      color: colors.textPrimary,
      marginBottom: 12,
      lineHeight: 20,
    },
    entityInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    entityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    entityText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    entityName: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    changesContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    changeBox: {
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    changeLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 6,
    },
    changeValue: {
      fontSize: 12,
      color: colors.textPrimary,
      fontFamily: 'monospace',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 64,
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
    },
    infoNote: {
      flexDirection: 'row',
      margin: 16,
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
