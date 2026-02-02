/**
 * Alerts Screen
 * Displays alerts and notifications for energy monitoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { notificationService, Notification } from '@/services/notificationService';
import { getAlertIcon, getAlertColor, getTimeAgo } from '@/utils/mockAlertData';

type FilterType = 'all' | 'alert' | 'warning' | 'info';

export default function AlertsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(colors);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
      filterNotifications(data, filter);
    } catch (error) {
      console.error('Error loading notifications:', error);
      Alert.alert('Error', 'Failed to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const filterNotifications = (notificationsList: Notification[], filterType: FilterType) => {
    if (filterType === 'all') {
      setFilteredNotifications(notificationsList);
    } else {
      setFilteredNotifications(notificationsList.filter(n => n.type === filterType));
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    filterNotifications(notifications, newFilter);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [user]);

  const handleNotificationAction = async (notificationId: string, action: 'markRead' | 'delete') => {
    try {
      if (action === 'markRead') {
        await notificationService.markAsRead(notificationId);
      } else {
        await notificationService.deleteNotification(notificationId);
      }
      loadNotifications(); // Reload after action
      Alert.alert('Success', `Notification ${action === 'markRead' ? 'marked as read' : 'deleted'} successfully`);
    } catch (error) {
      console.error('Error handling notification action:', error);
      Alert.alert('Error', `Failed to ${action} notification. Please try again.`);
    }
  };

  if (isLoading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔔 Notifications</Text>
          <Text style={styles.subtitle}>
            {filteredNotifications.length} {filter !== 'all' ? filter : ''} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterTabs}>
              {(['all', 'alert', 'warning', 'info'] as FilterType[]).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterTab, filter === f && styles.filterTabActive]}
                  onPress={() => handleFilterChange(f)}>
                  <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                  {f === 'alert' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notifications.filter(n => n.type === 'alert' && !n.isRead).length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>No {filter !== 'all' ? filter : ''} notifications</Text>
            <Text style={styles.emptyText}>
              {filter === 'alert' 
                ? 'Great! You have no alert notifications.'
                : 'You have no notifications in this category.'}
            </Text>
          </View>
        ) : (
          <View style={styles.alertsList}>
            {filteredNotifications.map(notification => (
              <View key={notification.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertIconContainer}>
                    <Text style={styles.alertIcon}>{getAlertIcon(notification.type)}</Text>
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getAlertColor(notification.priority) },
                      ]}
                    />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{notification.title}</Text>
                    <Text style={styles.alertMessage}>{notification.message}</Text>
                    <View style={styles.alertMeta}>
                      <Text style={styles.alertTime}>{getTimeAgo(notification.createdAt)}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: notification.isRead ? `${colors.textSecondary}20` : `${colors.primary}20` },
                        ]}>
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: notification.isRead ? colors.textSecondary : colors.primary },
                          ]}>
                          {notification.isRead ? 'Read' : 'Unread'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                {!notification.isRead && (
                  <View style={styles.alertActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.acknowledgeButton]}
                      onPress={() => handleNotificationAction(notification.id, 'markRead')}>
                      <Text style={styles.actionButtonText}>Mark as Read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.dismissButton]}
                      onPress={() => handleNotificationAction(notification.id, 'delete')}>
                      <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Text style={styles.infoText}>
            ℹ️ These notifications are generated from mock data. When connected to hardware, you'll receive
            real-time notifications based on your consumption patterns and configured alert rules.
          </Text>
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
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 10,
      color: colors.textPrimary,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      padding: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterContainer: {
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    filterTabs: {
      flexDirection: 'row',
      gap: 8,
    },
    filterTab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
      gap: 6,
    },
    filterTabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    filterTabTextActive: {
      color: '#FFFFFF',
    },
    badge: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: 'center',
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    emptyState: {
      alignItems: 'center',
      padding: 48,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    alertsList: {
      paddingHorizontal: 16,
      gap: 12,
    },
    alertCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    alertHeader: {
      flexDirection: 'row',
      gap: 12,
    },
    alertIconContainer: {
      position: 'relative',
    },
    alertIcon: {
      fontSize: 32,
    },
    priorityDot: {
      position: 'absolute',
      top: 0,
      right: -2,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.surface,
    },
    alertContent: {
      flex: 1,
    },
    alertTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    alertMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    alertMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    alertTime: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    statusBadgeText: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    alertActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    acknowledgeButton: {
      backgroundColor: colors.primary,
    },
    dismissButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    infoNote: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    infoText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
  });
