/**
 * RBAC Context
 * Provides role-based access control throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { rbacService } from '@/services/rbacService';
import { 
  UserRole, 
  RBACPermissions, 
  UserProfile 
} from '@/types/rbac.types';
import { ROLE_PERMISSIONS, RBACService } from '@/utils/rbac';

interface RBACContextType {
  // User role info
  role: UserRole;
  userProfile: UserProfile | null;
  permissions: RBACPermissions;
  isLoading: boolean;
  
  // Permission checkers
  hasPermission: (permission: keyof RBACPermissions) => boolean;
  hasAllPermissions: (permissions: (keyof RBACPermissions)[]) => boolean;
  hasAnyPermission: (permissions: (keyof RBACPermissions)[]) => boolean;
  
  // Role checkers
  isTenant: boolean;
  isLandlord: boolean;
  isAdmin: boolean;
  canManageMultipleUnits: boolean;
  
  // Actions
  refreshRole: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>('tenant');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get permissions for current role
  const permissions = ROLE_PERMISSIONS[role];

  /**
   * Load user role from Firebase
   */
  const loadUserRole = async () => {
    if (!user || !user.id) {
      setRole('tenant');
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get complete user profile with role
      const profile = await rbacService.getUserProfile(user.id);
      
      if (profile) {
        setRole(profile.role);
        setUserProfile(profile);
        console.log(`👤 User role loaded: ${profile.role}`);
      } else {
        // User profile doesn't exist, initialize with tenant role
        await rbacService.initializeUserRole(
          user.id,
          user.email || '',
          user.displayName || 'User'
        );
        setRole('tenant');
        console.log('👤 User initialized with tenant role');
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      setRole('tenant'); // Default to tenant on error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh role from Firebase
   */
  const refreshRole = async () => {
    await loadUserRole();
  };

  // Load role when user changes
  useEffect(() => {
    loadUserRole();
  }, [user?.id]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: keyof RBACPermissions): boolean => {
    return permissions[permission];
  };

  /**
   * Check if user has all specified permissions
   */
  const hasAllPermissions = (perms: (keyof RBACPermissions)[]): boolean => {
    return perms.every(p => permissions[p]);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (perms: (keyof RBACPermissions)[]): boolean => {
    return perms.some(p => permissions[p]);
  };

  const value: RBACContextType = {
    role,
    userProfile,
    permissions,
    isLoading,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isTenant: role === 'tenant',
    isLandlord: role === 'landlord',
    isAdmin: role === 'admin',
    canManageMultipleUnits: role === 'landlord' || role === 'admin',
    refreshRole,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

/**
 * Hook to use RBAC context
 */
export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
}

/**
 * HOC to require specific role
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) {
  return function WithRoleComponent(props: P) {
    const { role, isLoading } = useRBAC();

    if (isLoading) {
      return null; // Or loading spinner
    }

    if (!allowedRoles.includes(role)) {
      return null; // Or unauthorized message
    }

    return <Component {...props} />;
  };
}

/**
 * HOC to require specific permission
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: keyof RBACPermissions
) {
  return function WithPermissionComponent(props: P) {
    const { hasPermission, isLoading } = useRBAC();

    if (isLoading) {
      return null;
    }

    if (!hasPermission(requiredPermission)) {
      return null;
    }

    return <Component {...props} />;
  };
}
