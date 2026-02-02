/**
 * Audit Log Service
 * Tracks all administrative and critical user actions for security and accountability
 */

import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserRole } from '@/types/rbac.types';

// ============================================
// TYPES
// ============================================

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'ROLE_CHANGE'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'REASSIGN'
  | 'VIEW';

export type EntityType =
  | 'user'
  | 'device'
  | 'appliance'
  | 'alert_rule'
  | 'notification'
  | 'electricity_rate'
  | 'system_setting';

export interface AuditLog {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  description: string;
  createdAt: Date;
}

export interface AuditLogFilter {
  userId?: string;
  action?: AuditAction;
  entityType?: EntityType;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  limitCount?: number;
}

// ============================================
// AUDIT LOG FUNCTIONS
// ============================================

/**
 * Create an audit log entry
 */
export async function logAction(
  log: Omit<AuditLog, 'id' | 'createdAt'>
): Promise<void> {
  try {
    const auditLogsRef = collection(db, 'auditLogs');
    
    await addDoc(auditLogsRef, {
      ...log,
      createdAt: Timestamp.now(),
    });

    console.log(`📝 Audit: ${log.action} ${log.entityType} by ${log.userName}`);
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

/**
 * Log user role change
 */
export async function logRoleChange(
  adminUserId: string,
  adminEmail: string,
  adminName: string,
  targetUserId: string,
  targetUserName: string,
  oldRole: UserRole,
  newRole: UserRole
): Promise<void> {
  await logAction({
    userId: adminUserId,
    userEmail: adminEmail,
    userName: adminName,
    userRole: 'admin',
    action: 'ROLE_CHANGE',
    entityType: 'user',
    entityId: targetUserId,
    entityName: targetUserName,
    oldValue: { role: oldRole },
    newValue: { role: newRole },
    description: `Changed user role from ${oldRole} to ${newRole}`,
  });
}

/**
 * Log user details update
 */
export async function logUserUpdate(
  adminUserId: string,
  adminEmail: string,
  adminName: string,
  targetUserId: string,
  targetUserName: string,
  oldValues: any,
  newValues: any
): Promise<void> {
  await logAction({
    userId: adminUserId,
    userEmail: adminEmail,
    userName: adminName,
    userRole: 'admin',
    action: 'UPDATE',
    entityType: 'user',
    entityId: targetUserId,
    entityName: targetUserName,
    oldValue: oldValues,
    newValue: newValues,
    description: `Updated user details`,
  });
}

/**
 * Log user activation/deactivation
 */
export async function logUserStatusChange(
  adminUserId: string,
  adminEmail: string,
  adminName: string,
  targetUserId: string,
  targetUserName: string,
  isActive: boolean
): Promise<void> {
  await logAction({
    userId: adminUserId,
    userEmail: adminEmail,
    userName: adminName,
    userRole: 'admin',
    action: isActive ? 'ACTIVATE' : 'DEACTIVATE',
    entityType: 'user',
    entityId: targetUserId,
    entityName: targetUserName,
    description: `${isActive ? 'Activated' : 'Deactivated'} user account`,
  });
}

/**
 * Log device reassignment
 */
export async function logDeviceReassignment(
  adminUserId: string,
  adminEmail: string,
  adminName: string,
  deviceId: string,
  deviceName: string,
  oldOwnerName: string,
  newOwnerName: string
): Promise<void> {
  await logAction({
    userId: adminUserId,
    userEmail: adminEmail,
    userName: adminName,
    userRole: 'admin',
    action: 'REASSIGN',
    entityType: 'device',
    entityId: deviceId,
    entityName: deviceName,
    oldValue: { owner: oldOwnerName },
    newValue: { owner: newOwnerName },
    description: `Reassigned device from ${oldOwnerName} to ${newOwnerName}`,
  });
}

/**
 * Log device update
 */
export async function logDeviceUpdate(
  userId: string,
  userEmail: string,
  userName: string,
  userRole: UserRole,
  deviceId: string,
  deviceName: string,
  oldValues: any,
  newValues: any
): Promise<void> {
  await logAction({
    userId,
    userEmail,
    userName,
    userRole,
    action: 'UPDATE',
    entityType: 'device',
    entityId: deviceId,
    entityName: deviceName,
    oldValue: oldValues,
    newValue: newValues,
    description: `Updated device details`,
  });
}

/**
 * Log device deletion
 */
export async function logDeviceDeletion(
  adminUserId: string,
  adminEmail: string,
  adminName: string,
  deviceId: string,
  deviceName: string,
  applianceCount: number
): Promise<void> {
  await logAction({
    userId: adminUserId,
    userEmail: adminEmail,
    userName: adminName,
    userRole: 'admin',
    action: 'DELETE',
    entityType: 'device',
    entityId: deviceId,
    entityName: deviceName,
    description: `Deleted device and ${applianceCount} associated appliances`,
  });
}

/**
 * Log appliance operations
 */
export async function logApplianceAction(
  userId: string,
  userEmail: string,
  userName: string,
  userRole: UserRole,
  action: AuditAction,
  applianceId: string,
  applianceName: string,
  description: string,
  oldValue?: any,
  newValue?: any
): Promise<void> {
  await logAction({
    userId,
    userEmail,
    userName,
    userRole,
    action,
    entityType: 'appliance',
    entityId: applianceId,
    entityName: applianceName,
    oldValue,
    newValue,
    description,
  });
}

/**
 * Log system setting change
 */
export async function logSystemSettingChange(
  adminUserId: string,
  adminEmail: string,
  adminName: string,
  settingKey: string,
  oldValue: any,
  newValue: any
): Promise<void> {
  await logAction({
    userId: adminUserId,
    userEmail: adminEmail,
    userName: adminName,
    userRole: 'admin',
    action: 'UPDATE',
    entityType: 'system_setting',
    entityId: settingKey,
    entityName: settingKey,
    oldValue: { value: oldValue },
    newValue: { value: newValue },
    description: `Changed system setting: ${settingKey}`,
  });
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(
  filters: AuditLogFilter = {}
): Promise<AuditLog[]> {
  try {
    const auditLogsRef = collection(db, 'auditLogs');
    
    // Build query with filters
    let q = query(auditLogsRef, orderBy('createdAt', 'desc'));

    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }

    if (filters.action) {
      q = query(q, where('action', '==', filters.action));
    }

    if (filters.entityType) {
      q = query(q, where('entityType', '==', filters.entityType));
    }

    if (filters.entityId) {
      q = query(q, where('entityId', '==', filters.entityId));
    }

    if (filters.startDate) {
      q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.startDate)));
    }

    if (filters.endDate) {
      q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.endDate)));
    }

    if (filters.limitCount) {
      q = query(q, limit(filters.limitCount));
    } else {
      q = query(q, limit(100)); // Default limit
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        userRole: data.userRole,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        entityName: data.entityName,
        oldValue: data.oldValue,
        newValue: data.newValue,
        ipAddress: data.ipAddress,
        description: data.description,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
}

/**
 * Get recent activity for a specific user
 */
export async function getUserActivity(
  userId: string,
  limitCount: number = 50
): Promise<AuditLog[]> {
  return getAuditLogs({ userId, limitCount });
}

/**
 * Get recent activity for a specific entity
 */
export async function getEntityHistory(
  entityType: EntityType,
  entityId: string,
  limitCount: number = 50
): Promise<AuditLog[]> {
  return getAuditLogs({ entityType, entityId, limitCount });
}

/**
 * Get system-wide recent activity
 */
export async function getRecentActivity(limitCount: number = 100): Promise<AuditLog[]> {
  return getAuditLogs({ limitCount });
}

/**
 * Get audit logs for a date range
 */
export async function getActivityByDateRange(
  startDate: Date,
  endDate: Date,
  limitCount: number = 100
): Promise<AuditLog[]> {
  return getAuditLogs({ startDate, endDate, limitCount });
}

export const auditLogService = {
  logAction,
  logRoleChange,
  logUserUpdate,
  logUserStatusChange,
  logDeviceReassignment,
  logDeviceUpdate,
  logDeviceDeletion,
  logApplianceAction,
  logSystemSettingChange,
  getAuditLogs,
  getUserActivity,
  getEntityHistory,
  getRecentActivity,
  getActivityByDateRange,
};
