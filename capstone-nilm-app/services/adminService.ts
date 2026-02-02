/**
 * Admin Service
 * Handles administrative operations for user and device management
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserRole } from '@/types/rbac.types';
import { Device } from '@/types/device.types';

// ============================================
// USER MANAGEMENT
// ============================================

export interface AdminUserData {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  deviceCount?: number;
}

/**
 * Get all users in the system
 */
export async function getAllUsers(): Promise<AdminUserData[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const users: AdminUserData[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      // Count devices for this user
      const devicesRef = collection(db, 'devices');
      const deviceQuery = query(devicesRef, where('userId', '==', docSnap.id));
      const deviceSnapshot = await getDocs(deviceQuery);

      users.push({
        id: docSnap.id,
        email: data.email || '',
        displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        role: data.role || 'tenant',
        phoneNumber: data.phoneNumber,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate(),
        isActive: data.isActive !== false, // Default to true if not set
        deviceCount: deviceSnapshot.size,
      });
    }

    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

/**
 * Get user details by ID
 */
export async function getUserById(userId: string): Promise<AdminUserData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    const data = userSnap.data();

    // Count devices
    const devicesRef = collection(db, 'devices');
    const deviceQuery = query(devicesRef, where('userId', '==', userId));
    const deviceSnapshot = await getDocs(deviceQuery);

    return {
      id: userSnap.id,
      email: data.email || '',
      displayName: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      role: data.role || 'tenant',
      phoneNumber: data.phoneNumber,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate(),
      isActive: data.isActive !== false,
      deviceCount: deviceSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ User ${userId} role updated to ${newRole}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Update user details
 */
export async function updateUserDetails(
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    isActive?: boolean;
  }
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ User ${userId} details updated`);
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
}

/**
 * Deactivate user account
 */
export async function deactivateUser(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isActive: false,
      deactivatedAt: Timestamp.now(),
    });
    console.log(`✅ User ${userId} deactivated`);
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
}

/**
 * Reactivate user account
 */
export async function reactivateUser(userId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isActive: true,
      reactivatedAt: Timestamp.now(),
    });
    console.log(`✅ User ${userId} reactivated`);
  } catch (error) {
    console.error('Error reactivating user:', error);
    throw error;
  }
}

// ============================================
// DEVICE MANAGEMENT
// ============================================

export interface AdminDeviceData extends Device {
  ownerName: string;
  ownerEmail: string;
  ownerRole: UserRole;
  applianceCount: number;
  lastReading?: Date;
  isOnline: boolean;
}

/**
 * Get all devices in the system
 */
export async function getAllDevices(): Promise<AdminDeviceData[]> {
  try {
    const devicesRef = collection(db, 'devices');
    const snapshot = await getDocs(devicesRef);

    const devices: AdminDeviceData[] = [];

    for (const docSnap of snapshot.docs) {
      const deviceData = docSnap.data() as Device;

      // Get owner information - handle missing userId
      let userData = null;
      if (deviceData.userId) {
        try {
          const userRef = doc(db, 'users', deviceData.userId);
          const userSnap = await getDoc(userRef);
          userData = userSnap.exists() ? userSnap.data() : null;
        } catch (error) {
          console.error(`Error getting user for device ${docSnap.id}:`, error);
        }
      }

      // Count appliances
      const appliancesRef = collection(db, 'appliances');
      const applianceQuery = query(appliancesRef, where('deviceId', '==', docSnap.id));
      const applianceSnapshot = await getDocs(applianceQuery);

      // Check device online status using lastSeen field from device document
      // This avoids complex Firestore queries and indexes
      let lastReading: Date | undefined;
      let isOnline = false;

      if (deviceData.lastSeen) {
        lastReading = deviceData.lastSeen.toDate();
        const timeDiff = Date.now() - lastReading.getTime();
        isOnline = timeDiff < 2 * 60 * 1000; // Device is online if seen within 2 minutes
      }

      devices.push({
        ...deviceData,
        id: docSnap.id,
        ownerName: userData
          ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
          : 'Unknown User',
        ownerEmail: userData?.email || '',
        ownerRole: userData?.role || 'tenant',
        applianceCount: applianceSnapshot.size,
        lastReading,
        isOnline,
      });
    }

    return devices;
  } catch (error) {
    console.error('Error getting all devices:', error);
    throw error;
  }
}

/**
 * Get device details by ID
 */
export async function getDeviceById(deviceId: string): Promise<AdminDeviceData | null> {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    const deviceSnap = await getDoc(deviceRef);

    if (!deviceSnap.exists()) {
      return null;
    }

    const deviceData = deviceSnap.data() as Device;

    // Get owner information - handle missing userId
    let userData = null;
    if (deviceData.userId) {
      try {
        const userRef = doc(db, 'users', deviceData.userId);
        const userSnap = await getDoc(userRef);
        userData = userSnap.exists() ? userSnap.data() : null;
      } catch (error) {
        console.error(`Error getting user for device ${deviceId}:`, error);
      }
    }

    // Count appliances
    const appliancesRef = collection(db, 'appliances');
    const applianceQuery = query(appliancesRef, where('deviceId', '==', deviceId));
    const applianceSnapshot = await getDocs(applianceQuery);

    // Check device online status using lastSeen field
    let lastReading: Date | undefined;
    let isOnline = false;

    if (deviceData.lastSeen) {
      lastReading = deviceData.lastSeen.toDate();
      const timeDiff = Date.now() - lastReading.getTime();
      isOnline = timeDiff < 2 * 60 * 1000;
    }

    return {
      ...deviceData,
      id: deviceSnap.id,
      ownerName: userData
        ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
        : 'Unknown User',
      ownerEmail: userData?.email || '',
      ownerRole: userData?.role || 'tenant',
      applianceCount: applianceSnapshot.size,
      lastReading,
      isOnline,
    };
  } catch (error) {
    console.error('Error getting device by ID:', error);
    throw error;
  }
}

/**
 * Reassign device to a different user
 */
export async function reassignDevice(deviceId: string, newUserId: string): Promise<void> {
  try {
    // Verify new user exists
    const userRef = doc(db, 'users', newUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error('New user does not exist');
    }

    // Update device ownership
    const deviceRef = doc(db, 'devices', deviceId);
    await updateDoc(deviceRef, {
      userId: newUserId,
      updatedAt: Timestamp.now(),
    });

    console.log(`✅ Device ${deviceId} reassigned to user ${newUserId}`);
  } catch (error) {
    console.error('Error reassigning device:', error);
    throw error;
  }
}

/**
 * Update device details
 */
export async function updateDeviceDetails(
  deviceId: string,
  updates: {
    name?: string;
    location?: string;
    hardwareId?: string;
    ipAddress?: string;
    status?: 'active' | 'inactive' | 'maintenance';
  }
): Promise<void> {
  try {
    const deviceRef = doc(db, 'devices', deviceId);
    await updateDoc(deviceRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    console.log(`✅ Device ${deviceId} details updated`);
  } catch (error) {
    console.error('Error updating device details:', error);
    throw error;
  }
}

/**
 * Delete device (admin only)
 */
export async function deleteDevice(deviceId: string): Promise<void> {
  try {
    // Delete all appliances associated with this device
    const appliancesRef = collection(db, 'appliances');
    const applianceQuery = query(appliancesRef, where('deviceId', '==', deviceId));
    const applianceSnapshot = await getDocs(applianceQuery);

    const deletePromises = applianceSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete the device
    const deviceRef = doc(db, 'devices', deviceId);
    await deleteDoc(deviceRef);

    console.log(`✅ Device ${deviceId} and ${applianceSnapshot.size} appliances deleted`);
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
}

// ============================================
// STATISTICS
// ============================================

export interface SystemStatistics {
  totalUsers: number;
  activeUsers: number;
  tenants: number;
  landlords: number;
  admins: number;
  totalDevices: number;
  onlineDevices: number;
  totalAppliances: number;
  todayReadings: number;
  todayEnergy: number;
}

/**
 * Get system statistics
 */
export async function getSystemStatistics(): Promise<SystemStatistics> {
  try {
    // Count users by role
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    let activeUsers = 0;
    let tenants = 0;
    let landlords = 0;
    let admins = 0;

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.isActive !== false) activeUsers++;
      
      switch (userData.role) {
        case 'tenant':
          tenants++;
          break;
        case 'landlord':
          landlords++;
          break;
        case 'admin':
          admins++;
          break;
      }
    });

    // Count devices and check online status
    const devicesRef = collection(db, 'devices');
    const devicesSnapshot = await getDocs(devicesRef);
    
    let onlineDevices = 0;
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;

    for (const deviceDoc of devicesSnapshot.docs) {
      const readingsRef = collection(db, 'realTimeReadings');
      const readingQuery = query(
        readingsRef,
        where('deviceId', '==', deviceDoc.id),
        orderBy('timestamp', 'desc')
      );
      const readingSnapshot = await getDocs(readingQuery);

      if (!readingSnapshot.empty) {
        const lastReading = readingSnapshot.docs[0].data();
        if (lastReading.timestamp?.toMillis() > twoMinutesAgo) {
          onlineDevices++;
        }
      }
    }

    // Count appliances
    const appliancesRef = collection(db, 'appliances');
    const appliancesSnapshot = await getDocs(appliancesRef);

    // Count today's readings and energy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const readingsRef = collection(db, 'realTimeReadings');
    const todayReadingsQuery = query(
      readingsRef,
      where('timestamp', '>=', Timestamp.fromDate(today))
    );
    const todayReadingsSnapshot = await getDocs(todayReadingsQuery);

    let todayEnergy = 0;
    todayReadingsSnapshot.forEach(doc => {
      const reading = doc.data();
      todayEnergy += reading.energy || 0;
    });

    return {
      totalUsers: usersSnapshot.size,
      activeUsers,
      tenants,
      landlords,
      admins,
      totalDevices: devicesSnapshot.size,
      onlineDevices,
      totalAppliances: appliancesSnapshot.size,
      todayReadings: todayReadingsSnapshot.size,
      todayEnergy,
    };
  } catch (error) {
    console.error('Error getting system statistics:', error);
    throw error;
  }
}

export const adminService = {
  // Users
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserDetails,
  deactivateUser,
  reactivateUser,
  
  // Devices
  getAllDevices,
  getDeviceById,
  reassignDevice,
  updateDeviceDetails,
  deleteDevice,
  
  // Statistics
  getSystemStatistics,
};
