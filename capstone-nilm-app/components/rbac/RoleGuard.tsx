/**
 * Role Guard Component
 * Shows/hides content based on user role
 */

import React, { ReactNode } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { UserRole } from '@/types/rbac.types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { role, isLoading } = useRBAC();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Tenant-only content
 */
export function TenantOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={['tenant']} fallback={fallback}>{children}</RoleGuard>;
}

/**
 * Landlord-only content
 */
export function LandlordOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={['landlord']} fallback={fallback}>{children}</RoleGuard>;
}

/**
 * Admin-only content
 */
export function AdminOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={['admin']} fallback={fallback}>{children}</RoleGuard>;
}

/**
 * Landlord or Admin content
 */
export function LandlordOrAdmin({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={['landlord', 'admin']} fallback={fallback}>{children}</RoleGuard>;
}

/**
 * Multi-unit managers (Landlord or Admin)
 */
export function MultiUnitManager({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const { canManageMultipleUnits } = useRBAC();
  
  if (!canManageMultipleUnits) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
