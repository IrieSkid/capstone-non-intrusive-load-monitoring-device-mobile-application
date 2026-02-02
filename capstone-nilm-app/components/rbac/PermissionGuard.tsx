/**
 * Permission Guard Component
 * Shows/hides content based on user permissions
 */

import React, { ReactNode } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { RBACPermissions } from '@/types/rbac.types';

interface PermissionGuardProps {
  permission: keyof RBACPermissions;
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: boolean;
}

export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null,
  showLoading = false 
}: PermissionGuardProps) {
  const { hasPermission, isLoading } = useRBAC();

  if (isLoading && showLoading) {
    return <>{fallback}</>;
  }

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard for multiple permissions (ALL required)
 */
interface AllPermissionsGuardProps {
  permissions: (keyof RBACPermissions)[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AllPermissionsGuard({ 
  permissions, 
  children, 
  fallback = null 
}: AllPermissionsGuardProps) {
  const { hasAllPermissions } = useRBAC();

  if (!hasAllPermissions(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Guard for multiple permissions (ANY can pass)
 */
interface AnyPermissionGuardProps {
  permissions: (keyof RBACPermissions)[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function AnyPermissionGuard({ 
  permissions, 
  children, 
  fallback = null 
}: AnyPermissionGuardProps) {
  const { hasAnyPermission } = useRBAC();

  if (!hasAnyPermission(permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
