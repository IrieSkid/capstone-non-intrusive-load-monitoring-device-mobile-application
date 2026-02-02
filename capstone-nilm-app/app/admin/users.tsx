/**
 * Admin - User Management Screen
 * View and manage all users in the system
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useRBAC } from '@/contexts/RBACContext';
import { adminService, AdminUserData } from '@/services/adminService';
import { UserRole } from '@/types/rbac.types';

export default function AdminUsersScreen() {
  const { colors } = useTheme();
  const { isAdmin } = useRBAC();
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('tenant');
  const [editIsActive, setEditIsActive] = useState(true);
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
   * Load all users
   */
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await adminService.getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  /**
   * Filter users based on search and role
   */
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.displayName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, users]);

  /**
   * Handle edit user
   */
  const handleEditUser = (user: AdminUserData) => {
    setSelectedUser(user);
    const [firstName, ...lastNameParts] = user.displayName.split(' ');
    setEditFirstName(firstName || '');
    setEditLastName(lastNameParts.join(' ') || '');
    setEditPhoneNumber(user.phoneNumber || '');
    setEditRole(user.role);
    setEditIsActive(user.isActive);
    setIsEditModalVisible(true);
  };

  /**
   * Save user changes
   */
  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSaving(true);

      // Update user details
      await adminService.updateUserDetails(selectedUser.id, {
        firstName: editFirstName,
        lastName: editLastName,
        phoneNumber: editPhoneNumber,
        isActive: editIsActive,
      });

      // Update role if changed
      if (editRole !== selectedUser.role) {
        await adminService.updateUserRole(selectedUser.id, editRole);
      }

      Alert.alert('Success', 'User updated successfully');
      setIsEditModalVisible(false);
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Error', 'Failed to save user changes');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle user active status
   */
  const handleToggleActive = async (user: AdminUserData) => {
    try {
      if (user.isActive) {
        await adminService.deactivateUser(user.id);
        Alert.alert('Success', 'User deactivated');
      } else {
        await adminService.reactivateUser(user.id);
        Alert.alert('Success', 'User reactivated');
      }
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      Alert.alert('Error', 'Failed to change user status');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
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
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={styles.headerRight}>
          <Text style={styles.userCount}>{filteredUsers.length} users</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilters}>
          {(['all', 'tenant', 'landlord', 'admin'] as const).map(role => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleFilterChip,
                filterRole === role && styles.roleFilterChipActive,
              ]}
              onPress={() => setFilterRole(role)}
            >
              <Text
                style={[
                  styles.roleFilterText,
                  filterRole === role && styles.roleFilterTextActive,
                ]}
              >
                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredUsers.map(user => (
          <View key={user.id} style={styles.userCard}>
            {/* User Info */}
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.displayName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={[styles.roleBadge, getRoleStyle(user.role, colors)]}>
                    <Text style={styles.roleBadgeText}>{user.role}</Text>
                  </View>
                  {!user.isActive && (
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveBadgeText}>Inactive</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* User Stats */}
            <View style={styles.userStats}>
              <View style={styles.userStatItem}>
                <Ionicons name="hardware-chip-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.userStatText}>{user.deviceCount} devices</Text>
              </View>
              <View style={styles.userStatItem}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.userStatText}>
                  Joined {user.createdAt.toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.userActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditUser(user)}
              >
                <Ionicons name="pencil" size={18} color={colors.primary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleToggleActive(user)}
              >
                <Ionicons
                  name={user.isActive ? 'close-circle' : 'checkmark-circle'}
                  size={18}
                  color={user.isActive ? colors.error : colors.success}
                />
                <Text style={styles.actionButtonText}>
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No users found</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit User Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit User</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                value={editFirstName}
                onChangeText={setEditFirstName}
                placeholder="First Name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={editLastName}
                onChangeText={setEditLastName}
                placeholder="Last Name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editPhoneNumber}
                onChangeText={setEditPhoneNumber}
                placeholder="Phone Number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleSelector}>
                {(['tenant', 'landlord', 'admin'] as const).map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleSelectorButton,
                      editRole === role && styles.roleSelectorButtonActive,
                    ]}
                    onPress={() => setEditRole(role)}
                  >
                    <Text
                      style={[
                        styles.roleSelectorText,
                        editRole === role && styles.roleSelectorTextActive,
                      ]}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.inputLabel}>Active Status</Text>
                <TouchableOpacity
                  style={[styles.toggle, editIsActive && styles.toggleActive]}
                  onPress={() => setEditIsActive(!editIsActive)}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      editIsActive && styles.toggleThumbActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveUser}
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

// Helper function to get role style
function getRoleStyle(role: UserRole, colors: any) {
  switch (role) {
    case 'admin':
      return { backgroundColor: colors.error + '30', borderColor: colors.error };
    case 'landlord':
      return { backgroundColor: colors.warning + '30', borderColor: colors.warning };
    case 'tenant':
    default:
      return { backgroundColor: colors.primary + '30', borderColor: colors.primary };
  }
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
    userCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: colors.textPrimary,
    },
    roleFilters: {
      flexDirection: 'row',
    },
    roleFilterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    roleFilterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    roleFilterText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    roleFilterTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    container: {
      flex: 1,
    },
    userCard: {
      backgroundColor: colors.surface,
      margin: 16,
      marginBottom: 8,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    userAvatarText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
    },
    userMeta: {
      flexDirection: 'row',
      gap: 8,
    },
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    roleBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    inactiveBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.textSecondary + '30',
    },
    inactiveBadgeText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    userStats: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      gap: 16,
    },
    userStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    userStatText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    userActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
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
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
      marginTop: 12,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.textPrimary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    roleSelector: {
      flexDirection: 'row',
      gap: 8,
    },
    roleSelectorButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    roleSelectorButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    roleSelectorText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    roleSelectorTextActive: {
      color: '#fff',
      fontWeight: '600',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    toggle: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.border,
      padding: 2,
    },
    toggleActive: {
      backgroundColor: colors.success,
    },
    toggleThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#fff',
    },
    toggleThumbActive: {
      transform: [{ translateX: 22 }],
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
