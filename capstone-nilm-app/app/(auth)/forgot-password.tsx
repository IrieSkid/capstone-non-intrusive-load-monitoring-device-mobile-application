/**
 * Forgot Password Screen - Redesigned to match new theme
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { resetPassword } from '@/services/auth.service';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colors, isDark } = useTheme();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Success',
        'A password reset link has been sent to your email address. Please check your inbox.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Header with Gradient */}
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
          <IconSymbol name="key.fill" size={64} color="#fff" />
          <Text style={styles.headerTitle}>Reset Password</Text>
          <Text style={styles.headerSubtitle}>
            Enter your email to receive a reset link
          </Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.infoBox}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              We'll send you an email with instructions to reset your password.
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textDisabled}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Send Link Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.submitButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
              <IconSymbol name="paperplane.fill" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
      paddingTop: 80,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#fff',
      marginTop: 16,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    formContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: 24,
      paddingTop: 32,
      marginTop: -24,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: colors.primaryLight + '20',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    infoText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 20,
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
    },
    inputIconContainer: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.textPrimary,
    },
    submitButton: {
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 24,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    footerLink: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
