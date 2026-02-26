import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { adminService, AdminUser } from '@/services/adminService';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminUsersScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'tenant' as 'tenant' | 'landlord' | 'admin',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      try {
        const list = await adminService.getUsers();
        setUsers(list);
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Text style={styles.emptyText}>Admin access required.</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const toggleActive = async (u: AdminUser) => {
    try {
      await adminService.updateUser(u.user_id, {
        status: u.status_name === 'active' ? 'inactive' : 'active',
      });
      setUsers((prev) =>
        prev.map((x) =>
          x.user_id === u.user_id ? { ...x, status_name: u.status_name === 'active' ? 'inactive' : 'active' } : x
        )
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update user');
    }
  };

  const handleCreate = async () => {
    if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }
    try {
      const created = await adminService.createUser({
        email: newUser.email,
        password: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      });
      setUsers((prev) => [created, ...prev]);
      setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'tenant' });
      setCreating(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create user');
    }
  };

  const handleDelete = async (u: AdminUser) => {
    Alert.alert('Delete user', `Delete ${u.user_email}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await adminService.deleteUser(u.user_id);
            setUsers((prev) => prev.filter((x) => x.user_id !== u.user_id));
          } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to delete user');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {creating ? (
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Create User</Text>
          <View style={styles.row}>
            <View style={[styles.inputWrapper, { marginRight: 8 }]}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.input}
                value={newUser.firstName}
                onChangeText={(text) => setNewUser((u) => ({ ...u, firstName: text }))}
                placeholder="First name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={newUser.lastName}
                onChangeText={(text) => setNewUser((u) => ({ ...u, lastName: text }))}
                placeholder="Last name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={newUser.email}
              onChangeText={(text) => setNewUser((u) => ({ ...u, email: text }))}
              placeholder="email@example.com"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={newUser.password}
              onChangeText={(text) => setNewUser((u) => ({ ...u, password: text }))}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>
          <View style={styles.roleRow}>
            {(['tenant', 'landlord', 'admin'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, newUser.role === r && styles.roleChipActive]}
                onPress={() => setNewUser((u) => ({ ...u, role: r }))}>
                <Text
                  style={[styles.roleChipText, newUser.role === r && styles.roleChipTextActive]}>
                  {r.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.createActions}>
            <TouchableOpacity style={[styles.createButton, styles.createPrimary]} onPress={handleCreate}>
              <Text style={styles.createButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, styles.createSecondary]}
              onPress={() => {
                setCreating(false);
                setNewUser({ firstName: '', lastName: '', email: '', password: '', role: 'tenant' });
              }}>
              <Text style={[styles.createButtonText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.newUserButton} onPress={() => setCreating(true)}>
          <Text style={styles.newUserButtonText}>+ New User</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userName}>{item.user_name}</Text>
            <Text style={styles.userEmail}>{item.user_email}</Text>
            <Text style={styles.userMeta}>
              Role: <Text style={styles.metaStrong}>{item.role_name}</Text> • Status:{' '}
              <Text style={styles.metaStrong}>{item.status_name}</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => toggleActive(item)}
                style={[
                  styles.actionButton,
                  item.status_name === 'active' ? styles.deactivateButton : styles.activateButton,
                ]}>
                <Text style={styles.actionButtonText}>
                  {item.status_name === 'active' ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item)}
                style={[styles.actionButton, { backgroundColor: '#4b5563' }]}>
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 16,
      color: colors.textPrimary,
    },
    card: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    userMeta: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 6,
    },
    metaStrong: {
      fontWeight: '600',
      color: colors.textPrimary,
    },
    actionButton: {
      marginTop: 10,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    deactivateButton: {
      backgroundColor: '#ef4444',
    },
    activateButton: {
      backgroundColor: '#22c55e',
    },
    actionButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 13,
    },
    emptyText: {
      color: colors.textPrimary,
      fontSize: 16,
    },
    createCard: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surface,
      marginBottom: 12,
    },
    createTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    inputWrapper: {
      flex: 1,
      marginBottom: 8,
    },
    inputLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.divider,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      color: colors.textPrimary,
      backgroundColor: colors.background,
      fontSize: 14,
    },
    roleRow: {
      flexDirection: 'row',
      marginTop: 4,
      marginBottom: 8,
      gap: 6,
    },
    roleChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.background,
    },
    roleChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    roleChipText: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    roleChipTextActive: {
      color: '#fff',
    },
    createActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
      gap: 8,
    },
    createButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    createPrimary: {
      backgroundColor: colors.primary,
    },
    createSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    createButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 13,
    },
    newUserButton: {
      alignSelf: 'flex-end',
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    newUserButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 13,
    },
  });
