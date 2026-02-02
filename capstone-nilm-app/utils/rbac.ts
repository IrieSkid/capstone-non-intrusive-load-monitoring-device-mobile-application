/**
 * RBAC Utility Functions
 * Role-Based Access Control logic and permission management
 */

import { UserRole, RBACPermissions, RoleConfig } from '@/types/rbac.types';

/**
 * Permission maps for each role
 * Based on thesis requirements and use cases
 */
export const ROLE_PERMISSIONS: Record<UserRole, RBACPermissions> = {
  // TENANT: Primary users - residents monitoring own consumption
  tenant: {
    // Own Device Monitoring - Full access to own device
    canViewOwnDevice: true,
    canViewOwnAppliances: true,
    canToggleOwnAppliances: true,
    canAddAppliances: true,
    canEditAppliances: true,
    canDeleteAppliances: true,
    
    // Own Reports & Analytics - Full access
    canViewOwnReports: true,
    canExportOwnReports: true,
    canViewDetailedAnalytics: true,
    
    // Own Alert Management - Full access
    canViewOwnAlerts: true,
    canCreateAlertRules: true,
    canEditAlertRules: true,
    canDeleteAlertRules: true,
    
    // Multi-Unit Management - No access
    canViewAllTenantDevices: false,
    canViewAllTenantConsumption: false,
    canCompareUnitConsumption: false,
    canGeneratePropertyReports: false,
    canViewTenantList: false,
    
    // Device Management - Limited
    canAddDevices: false,
    canDeleteDevices: false,
    canEditDeviceSettings: false,
    canAssignDeviceToTenant: false,
    
    // Settings - Own settings only
    canEditOwnSettings: true,
    canChangeElectricityRates: false,
    
    // System Administration - No access
    canManageUserRoles: false,
    canViewSystemLogs: false,
    canManageAllUsers: false,
    canAccessSystemConfig: false,
    canDeleteAnyData: false,
  },
  
  // LANDLORD: Property managers - oversee multiple units
  landlord: {
    // Own Device Monitoring - Full access
    canViewOwnDevice: true,
    canViewOwnAppliances: true,
    canToggleOwnAppliances: true,
    canAddAppliances: true,
    canEditAppliances: true,
    canDeleteAppliances: true,
    
    // Own Reports & Analytics - Full access
    canViewOwnReports: true,
    canExportOwnReports: true,
    canViewDetailedAnalytics: true,
    
    // Own Alert Management - Full access
    canViewOwnAlerts: true,
    canCreateAlertRules: true,
    canEditAlertRules: true,
    canDeleteAlertRules: true,
    
    // Multi-Unit Management - Full access (KEY FEATURE)
    canViewAllTenantDevices: true,
    canViewAllTenantConsumption: true,
    canCompareUnitConsumption: true,
    canGeneratePropertyReports: true,
    canViewTenantList: true,
    
    // Device Management - Full access
    canAddDevices: true,
    canDeleteDevices: true,
    canEditDeviceSettings: true,
    canAssignDeviceToTenant: true,
    
    // Settings - Can manage rates
    canEditOwnSettings: true,
    canChangeElectricityRates: true,
    
    // System Administration - No access
    canManageUserRoles: false,
    canViewSystemLogs: false,
    canManageAllUsers: false,
    canAccessSystemConfig: false,
    canDeleteAnyData: false,
  },
  
  // ADMIN: System administrators - full access
  admin: {
    // Own Device Monitoring - Full access
    canViewOwnDevice: true,
    canViewOwnAppliances: true,
    canToggleOwnAppliances: true,
    canAddAppliances: true,
    canEditAppliances: true,
    canDeleteAppliances: true,
    
    // Own Reports & Analytics - Full access
    canViewOwnReports: true,
    canExportOwnReports: true,
    canViewDetailedAnalytics: true,
    
    // Own Alert Management - Full access
    canViewOwnAlerts: true,
    canCreateAlertRules: true,
    canEditAlertRules: true,
    canDeleteAlertRules: true,
    
    // Multi-Unit Management - Full access
    canViewAllTenantDevices: true,
    canViewAllTenantConsumption: true,
    canCompareUnitConsumption: true,
    canGeneratePropertyReports: true,
    canViewTenantList: true,
    
    // Device Management - Full access
    canAddDevices: true,
    canDeleteDevices: true,
    canEditDeviceSettings: true,
    canAssignDeviceToTenant: true,
    
    // Settings - Full access
    canEditOwnSettings: true,
    canChangeElectricityRates: true,
    
    // System Administration - Full access (ADMIN ONLY)
    canManageUserRoles: true,
    canViewSystemLogs: true,
    canManageAllUsers: true,
    canAccessSystemConfig: true,
    canDeleteAnyData: true,
  },
};

/**
 * Role display configuration
 */
export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  tenant: {
    label: 'Tenant',
    color: '#3b82f6', // Blue
    description: 'Resident monitoring own energy consumption',
  },
  landlord: {
    label: 'Landlord',
    color: '#8b5cf6', // Purple
    description: 'Property manager overseeing multiple units',
  },
  admin: {
    label: 'Admin',
    color: '#ef4444', // Red
    description: 'System administrator with full access',
  },
};

/**
 * RBAC Service - Utility functions for permission checking
 */
export class RBACService {
  /**
   * Get permissions for a role
   */
  static getPermissions(role: UserRole): RBACPermissions {
    return ROLE_PERMISSIONS[role];
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(
    role: UserRole,
    permission: keyof RBACPermissions
  ): boolean {
    return ROLE_PERMISSIONS[role][permission];
  }

  /**
   * Check multiple permissions (ALL must pass)
   */
  static hasAllPermissions(
    role: UserRole,
    permissions: (keyof RBACPermissions)[]
  ): boolean {
    return permissions.every(p => ROLE_PERMISSIONS[role][p]);
  }

  /**
   * Check multiple permissions (ANY can pass)
   */
  static hasAnyPermission(
    role: UserRole,
    permissions: (keyof RBACPermissions)[]
  ): boolean {
    return permissions.some(p => ROLE_PERMISSIONS[role][p]);
  }

  /**
   * Get role configuration
   */
  static getRoleConfig(role: UserRole): RoleConfig {
    return ROLE_CONFIG[role];
  }

  /**
   * Check if role is hierarchically higher
   */
  static isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
    const hierarchy: Record<UserRole, number> = {
      tenant: 1,
      landlord: 2,
      admin: 3,
    };
    return hierarchy[role1] > hierarchy[role2];
  }

  /**
   * Get available roles for assignment
   */
  static getAssignableRoles(currentUserRole: UserRole): UserRole[] {
    if (currentUserRole === 'admin') {
      return ['tenant', 'landlord', 'admin'];
    }
    if (currentUserRole === 'landlord') {
      return ['tenant'];
    }
    return [];
  }

  /**
   * Validate role transition
   */
  static canChangeRole(
    currentUserRole: UserRole,
    targetUserId: string,
    targetUserRole: UserRole,
    newRole: UserRole
  ): { allowed: boolean; reason?: string } {
    // Only admins can change roles
    if (currentUserRole !== 'admin') {
      return {
        allowed: false,
        reason: 'Only administrators can change user roles',
      };
    }

    // Cannot change own role
    if (currentUserRole === targetUserRole && targetUserId) {
      return {
        allowed: false,
        reason: 'Cannot change your own role',
      };
    }

    // Validate role transition
    const validRoles: UserRole[] = ['tenant', 'landlord', 'admin'];
    if (!validRoles.includes(newRole)) {
      return {
        allowed: false,
        reason: 'Invalid role specified',
      };
    }

    return { allowed: true };
  }
}

/**
 * Helper function to format role for display
 */
export function formatRole(role: UserRole): string {
  return ROLE_CONFIG[role].label;
}

/**
 * Helper function to get role color
 */
export function getRoleColor(role: UserRole): string {
  return ROLE_CONFIG[role].color;
}

/**
 * Helper function to check if user is tenant
 */
export function isTenant(role: UserRole): boolean {
  return role === 'tenant';
}

/**
 * Helper function to check if user is landlord
 */
export function isLandlord(role: UserRole): boolean {
  return role === 'landlord';
}

/**
 * Helper function to check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * Helper function to check if user can manage multiple units
 */
export function canManageMultipleUnits(role: UserRole): boolean {
  return role === 'landlord' || role === 'admin';
}
