/**
 * Login Screen - Redesigned to match new theme
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { colors, isDark } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header with Gradient */}
        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
          <IconSymbol name="bolt.fill" size={64} color="#fff" />
          <Text style={styles.headerTitle}>NILM Monitor</Text>
          <Text style={styles.headerSubtitle}>Energy monitoring made simple</Text>
        </LinearGradient>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtext}>Sign in to continue monitoring</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textDisabled}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputIconContainer}>
              <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textDisabled}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <IconSymbol
                name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
              <IconSymbol name="arrow.right" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
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
    header: {
      alignItems: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
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
    welcomeSection: {
      marginBottom: 32,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    welcomeSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      marginBottom: 16,
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
    eyeIcon: {
      padding: 8,
    },
    forgotPassword: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'right',
      marginBottom: 24,
    },
    loginButton: {
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 24,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      gap: 8,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },
    dividerText: {
      marginHorizontal: 16,
      color: colors.textSecondary,
      fontSize: 14,
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
