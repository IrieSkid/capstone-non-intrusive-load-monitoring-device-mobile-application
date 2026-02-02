/**
 * Role Badge Component
 * Displays user role with appropriate styling
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserRole } from '@/types/rbac.types';
import { ROLE_CONFIG } from '@/utils/rbac';
import { useTheme } from '@/contexts/ThemeContext';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export function RoleBadge({ role, size = 'medium', showIcon = false }: RoleBadgeProps) {
  const { colors } = useTheme();
  const config = ROLE_CONFIG[role];

  const sizeStyles = {
    small: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 11 },
    medium: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 13 },
    large: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 15 },
  };

  const iconMap = {
    tenant: '🏠',
    landlord: '🏢',
    admin: '⚙️',
  };

  return (
    <View 
      style={[
        styles.badge, 
        { 
          backgroundColor: config.color,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          paddingVertical: sizeStyles[size].paddingVertical,
        }
      ]}
    >
      {showIcon && (
        <Text style={[styles.icon, { fontSize: sizeStyles[size].fontSize }]}>
          {iconMap[role]}
        </Text>
      )}
      <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    gap: 4,
  },
  icon: {
    color: '#ffffff',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
