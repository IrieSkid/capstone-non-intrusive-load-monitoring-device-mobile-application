/**
 * RBAC Type Definitions
 * Role-Based Access Control for NILM System
 * 
 * Based on thesis requirements:
 * - Tenants: Monitor own consumption
 * - Landlords: Oversee multiple rental units
 * - Admins: System administration
 */

/**
 * User roles in the system
 */
export type UserRole = 'tenant' | 'landlord' | 'admin';

/**
 * Permissions available in the system
 */
export interface RBACPermissions {
  // Own Device Monitoring
  canViewOwnDevice: boolean;
  canViewOwnAppliances: boolean;
  canToggleOwnAppliances: boolean;
  canAddAppliances: boolean;
  canEditAppliances: boolean;
  canDeleteAppliances: boolean;
  
  // Own Reports & Analytics
  canViewOwnReports: boolean;
  canExportOwnReports: boolean;
  canViewDetailedAnalytics: boolean;
  
  // Own Alert Management
  canViewOwnAlerts: boolean;
  canCreateAlertRules: boolean;
  canEditAlertRules: boolean;
  canDeleteAlertRules: boolean;
  
  // Multi-Unit Management (Landlord)
  canViewAllTenantDevices: boolean;
  canViewAllTenantConsumption: boolean;
  canCompareUnitConsumption: boolean;
  canGeneratePropertyReports: boolean;
  canViewTenantList: boolean;
  
  // Device Management (Landlord)
  canAddDevices: boolean;
  canDeleteDevices: boolean;
  canEditDeviceSettings: boolean;
  canAssignDeviceToTenant: boolean;
  
  // Settings
  canEditOwnSettings: boolean;
  canChangeElectricityRates: boolean;
  
  // System Administration (Admin)
  canManageUserRoles: boolean;
  canViewSystemLogs: boolean;
  canManageAllUsers: boolean;
  canAccessSystemConfig: boolean;
  canDeleteAnyData: boolean;
}

/**
 * Extended user profile with RBAC information
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  
  // Tenant-specific fields
  unitNumber?: string;
  deviceId?: string; // Primary device for this tenant
  
  // Landlord-specific fields
  propertyId?: string;
  propertyName?: string;
  managedDevices?: string[]; // Array of device IDs managed by landlord
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Property information (for landlords)
 */
export interface Property {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  totalUnits: number;
  devices: PropertyDevice[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Device assignment in a property
 */
export interface PropertyDevice {
  deviceId: string;
  unitNumber: string;
  tenantId?: string;
  tenantName?: string;
  isActive: boolean;
}

/**
 * Role display configuration
 */
export interface RoleConfig {
  label: string;
  color: string;
  description: string;
}

/**
 * Role change request (admin function)
 */
export interface RoleChangeRequest {
  userId: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  reason: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}
