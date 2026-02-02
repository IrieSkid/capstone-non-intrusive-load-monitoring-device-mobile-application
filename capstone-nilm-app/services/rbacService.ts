/**
 * RBAC Service
 * Firebase operations for role management
 */

import { firestore } from '@/config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { UserRole, UserProfile, Property, PropertyDevice } from '@/types/rbac.types';

class RBACService {
  private usersCollection = 'users';
  private propertiesCollection = 'properties';

  /**
   * Get user role from Firestore
   */
  async getUserRole(userId: string): Promise<UserRole> {
    try {
      const userDoc = await getDoc(doc(firestore, this.usersCollection, userId));
      
      if (!userDoc.exists()) {
        console.log('User document not found, defaulting to tenant');
        return 'tenant';
      }

      const data = userDoc.data();
      return (data.role as UserRole) || 'tenant';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'tenant'; // Default to tenant on error
    }
  }

  /**
   * Get complete user profile with role information
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(firestore, this.usersCollection, userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      
      return {
        id: userDoc.id,
        email: data.email || '',
        displayName: data.displayName || data.name || 'User',
        phoneNumber: data.phoneNumber,
        role: (data.role as UserRole) || 'tenant',
        unitNumber: data.unitNumber,
        deviceId: data.deviceId,
        propertyId: data.propertyId,
        propertyName: data.propertyName,
        managedDevices: data.managedDevices || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      const userRef = doc(firestore, this.usersCollection, userId);
      
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: Timestamp.now(),
      });

      console.log(`✅ Updated user ${userId} role to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Initialize user with default tenant role
   */
  async initializeUserRole(userId: string, email: string, displayName: string): Promise<void> {
    try {
      const userRef = doc(firestore, this.usersCollection, userId);
      const userDoc = await getDoc(userRef);

      // Only initialize if user doesn't exist or has no role
      if (!userDoc.exists() || !userDoc.data().role) {
        await setDoc(userRef, {
          email,
          displayName,
          role: 'tenant', // Default role
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }, { merge: true });

        console.log(`✅ Initialized user ${userId} with tenant role`);
      }
    } catch (error) {
      console.error('Error initializing user role:', error);
      throw error;
    }
  }

  /**
   * Assign device to user (sets deviceId)
   */
  async assignDeviceToUser(userId: string, deviceId: string, unitNumber?: string): Promise<void> {
    try {
      const userRef = doc(firestore, this.usersCollection, userId);
      
      await updateDoc(userRef, {
        deviceId,
        unitNumber: unitNumber || null,
        updatedAt: Timestamp.now(),
      });

      console.log(`✅ Assigned device ${deviceId} to user ${userId}`);
    } catch (error) {
      console.error('Error assigning device to user:', error);
      throw error;
    }
  }

  /**
   * Set up landlord property (for landlords)
   */
  async setupLandlordProperty(
    landlordId: string,
    propertyName: string,
    address: string
  ): Promise<string> {
    try {
      const propertyRef = doc(collection(firestore, this.propertiesCollection));
      
      const property: Property = {
        id: propertyRef.id,
        landlordId,
        name: propertyName,
        address,
        totalUnits: 0,
        devices: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(propertyRef, {
        ...property,
        createdAt: Timestamp.fromDate(property.createdAt),
        updatedAt: Timestamp.fromDate(property.updatedAt),
      });

      // Update landlord's profile with property info
      const userRef = doc(firestore, this.usersCollection, landlordId);
      await updateDoc(userRef, {
        propertyId: propertyRef.id,
        propertyName,
        updatedAt: Timestamp.now(),
      });

      console.log(`✅ Created property ${propertyRef.id} for landlord ${landlordId}`);
      return propertyRef.id;
    } catch (error) {
      console.error('Error setting up landlord property:', error);
      throw error;
    }
  }

  /**
   * Get landlord's property
   */
  async getLandlordProperty(landlordId: string): Promise<Property | null> {
    try {
      const q = query(
        collection(firestore, this.propertiesCollection),
        where('landlordId', '==', landlordId)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        landlordId: data.landlordId,
        name: data.name,
        address: data.address,
        totalUnits: data.totalUnits || 0,
        devices: data.devices || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error getting landlord property:', error);
      return null;
    }
  }

  /**
   * Add device to landlord's property
   */
  async addDeviceToProperty(
    propertyId: string,
    deviceId: string,
    unitNumber: string,
    tenantId?: string,
    tenantName?: string
  ): Promise<void> {
    try {
      const propertyRef = doc(firestore, this.propertiesCollection, propertyId);
      const propertyDoc = await getDoc(propertyRef);
      
      if (!propertyDoc.exists()) {
        throw new Error('Property not found');
      }

      const property = propertyDoc.data();
      const devices = property.devices || [];

      const newDevice: PropertyDevice = {
        deviceId,
        unitNumber,
        tenantId,
        tenantName,
        isActive: true,
      };

      devices.push(newDevice);

      await updateDoc(propertyRef, {
        devices,
        totalUnits: devices.length,
        updatedAt: Timestamp.now(),
      });

      console.log(`✅ Added device ${deviceId} to property ${propertyId}`);
    } catch (error) {
      console.error('Error adding device to property:', error);
      throw error;
    }
  }

  /**
   * Get all users with specific role (Admin only)
   */
  async getUsersByRole(role: UserRole): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(firestore, this.usersCollection),
        where('role', '==', role)
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || data.name || 'User',
          phoneNumber: data.phoneNumber,
          role: data.role as UserRole,
          unitNumber: data.unitNumber,
          deviceId: data.deviceId,
          propertyId: data.propertyId,
          propertyName: data.propertyName,
          managedDevices: data.managedDevices || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  /**
   * Get all tenants for a landlord's property
   */
  async getPropertyTenants(propertyId: string): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(firestore, this.usersCollection),
        where('propertyId', '==', propertyId),
        where('role', '==', 'tenant')
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email || '',
          displayName: data.displayName || data.name || 'User',
          phoneNumber: data.phoneNumber,
          role: 'tenant',
          unitNumber: data.unitNumber,
          deviceId: data.deviceId,
          propertyId: data.propertyId,
          propertyName: data.propertyName,
          managedDevices: [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error('Error getting property tenants:', error);
      return [];
    }
  }
}

export const rbacService = new RBACService();
