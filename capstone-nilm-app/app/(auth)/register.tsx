/**
 * Register/Sign-up Screen
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user.types';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'tenant' as UserRole,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        role: formData.role,
      });
      // Navigation is handled automatically by AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Create Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join NILM System Today
            </ThemedText>
          </View>

          {/* Registration Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="First Name *"
              placeholderTextColor="#999"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              autoCapitalize="words"
              editable={!isSubmitting}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name *"
              placeholderTextColor="#999"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              autoCapitalize="words"
              editable={!isSubmitting}
            />

            <TextInput
              style={styles.input}
              placeholder="Email *"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isSubmitting}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number (Optional)"
              placeholderTextColor="#999"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
              editable={!isSubmitting}
            />

            <View style={styles.pickerContainer}>
              <ThemedText style={styles.label}>Account Type:</ThemedText>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                enabled={!isSubmitting}
                style={styles.picker}>
                <Picker.Item label="Tenant" value="tenant" />
                <Picker.Item label="Landlord" value="landlord" />
                <Picker.Item label="Administrator" value="admin" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password *"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isSubmitting}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password *"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              autoCapitalize="none"
              editable={!isSubmitting}
            />

            <TouchableOpacity
              style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <ThemedText>Already have an account? </ThemedText>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.loginLink}>Login</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.7,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
