/**
 * Forgot Password Screen
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

export default function ForgotPasswordScreen() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendPasswordReset(email);
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your inbox.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(auth)/login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send password reset email');
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
              Reset Password
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!isSubmitting}
            />

            <TouchableOpacity
              style={[styles.resetButton, isSubmitting && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.resetButtonText}>Send Reset Link</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.backContainer}>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.backLink}>← Back to Login</ThemedText>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backContainer: {
    alignItems: 'center',
  },
  backLink: {
    color: '#007AFF',
    fontSize: 16,
  },
});
