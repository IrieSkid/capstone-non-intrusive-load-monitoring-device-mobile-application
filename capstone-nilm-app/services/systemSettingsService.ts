/**
 * System Settings Service
 * Manages system-wide configuration settings stored in Firestore
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// ============================================
// TYPES
// ============================================

export type SettingCategory = 
  | 'general'
  | 'billing'
  | 'alerts'
  | 'device'
  | 'notifications'
  | 'security';

export interface SystemSetting {
  key: string;
  value: any;
  description: string;
  category: SettingCategory;
  isPublic: boolean;
  dataType: 'string' | 'number' | 'boolean' | 'object';
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

// ============================================
// DEFAULT SETTINGS
// ============================================

export const DEFAULT_SETTINGS: Record<string, Omit<SystemSetting, 'key' | 'createdAt' | 'updatedAt'>> = {
  // General Settings
  appName: {
    value: 'NILM Energy Monitor',
    description: 'Application display name',
    category: 'general',
    isPublic: true,
    dataType: 'string',
  },
  appVersion: {
    value: '1.0.0',
    description: 'Current application version',
    category: 'general',
    isPublic: true,
    dataType: 'string',
  },
  maintenanceMode: {
    value: false,
    description: 'Enable maintenance mode (disables user access)',
    category: 'general',
    isPublic: false,
    dataType: 'boolean',
  },
  
  // Billing Settings
  defaultElectricityRate: {
    value: 12.0,
    description: 'Default electricity rate in ₱/kWh',
    category: 'billing',
    isPublic: true,
    dataType: 'number',
  },
  currency: {
    value: 'PHP',
    description: 'Currency code (PHP, USD, etc.)',
    category: 'billing',
    isPublic: true,
    dataType: 'string',
  },
  currencySymbol: {
    value: '₱',
    description: 'Currency symbol',
    category: 'billing',
    isPublic: true,
    dataType: 'string',
  },
  
  // Device Settings
  deviceOnlineThreshold: {
    value: 120,
    description: 'Seconds before device is considered offline',
    category: 'device',
    isPublic: false,
    dataType: 'number',
  },
  dataRetentionDays: {
    value: 90,
    description: 'Days to retain raw sensor data',
    category: 'device',
    isPublic: false,
    dataType: 'number',
  },
  readingInterval: {
    value: 3,
    description: 'Reading interval in seconds',
    category: 'device',
    isPublic: true,
    dataType: 'number',
  },
  
  // Alert Settings
  enableAlerts: {
    value: true,
    description: 'Enable alert system',
    category: 'alerts',
    isPublic: false,
    dataType: 'boolean',
  },
  defaultHighPowerThreshold: {
    value: 5.0,
    description: 'Default high power threshold in kW',
    category: 'alerts',
    isPublic: false,
    dataType: 'number',
  },
  defaultCostThreshold: {
    value: 500.0,
    description: 'Default daily cost threshold in ₱',
    category: 'alerts',
    isPublic: false,
    dataType: 'number',
  },
  
  // Notification Settings
  enableEmailNotifications: {
    value: false,
    description: 'Enable email notifications',
    category: 'notifications',
    isPublic: false,
    dataType: 'boolean',
  },
  enablePushNotifications: {
    value: true,
    description: 'Enable push notifications',
    category: 'notifications',
    isPublic: false,
    dataType: 'boolean',
  },
  
  // Security Settings
  maxLoginAttempts: {
    value: 5,
    description: 'Maximum login attempts before lockout',
    category: 'security',
    isPublic: false,
    dataType: 'number',
  },
  sessionTimeout: {
    value: 24,
    description: 'Session timeout in hours',
    category: 'security',
    isPublic: false,
    dataType: 'number',
  },
};

// ============================================
// SETTING FUNCTIONS
// ============================================

/**
 * Initialize system settings with defaults
 * Creates any missing default settings (doesn't overwrite existing ones)
 */
export async function initializeSettings(adminUserId: string): Promise<void> {
  try {
    const settingsRef = collection(db, 'systemSettings');
    const snapshot = await getDocs(settingsRef);

    // Get existing setting keys
    const existingKeys = new Set(snapshot.docs.map(doc => doc.id));

    // Find missing settings
    const missingSettings: Array<[string, Omit<SystemSetting, 'key' | 'createdAt' | 'updatedAt'>]> = [];
    for (const [key, setting] of Object.entries(DEFAULT_SETTINGS)) {
      if (!existingKeys.has(key)) {
        missingSettings.push([key, setting]);
      }
    }

    // Create missing settings
    if (missingSettings.length > 0) {
      console.log(`Initializing ${missingSettings.length} missing system settings...`);
      
      for (const [key, setting] of missingSettings) {
        await setDoc(doc(db, 'systemSettings', key), {
          ...setting,
          createdAt: Timestamp.now(),
          createdBy: adminUserId,
          updatedAt: Timestamp.now(),
          updatedBy: adminUserId,
        });
        console.log(`✅ Created setting: ${key}`);
      }

      console.log(`✅ System settings initialized (${missingSettings.length} new settings)`);
    } else {
      console.log('✅ All system settings already exist');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
    throw error;
  }
}

/**
 * Get a specific setting by key
 */
export async function getSetting(key: string): Promise<SystemSetting | null> {
  try {
    const settingRef = doc(db, 'systemSettings', key);
    const settingSnap = await getDoc(settingRef);

    if (!settingSnap.exists()) {
      // Return default if exists
      if (DEFAULT_SETTINGS[key]) {
        return {
          key,
          ...DEFAULT_SETTINGS[key],
        };
      }
      return null;
    }

    const data = settingSnap.data();
    return {
      key: settingSnap.id,
      value: data.value,
      description: data.description,
      category: data.category,
      isPublic: data.isPublic,
      dataType: data.dataType,
      createdAt: data.createdAt?.toDate(),
      createdBy: data.createdBy,
      updatedAt: data.updatedAt?.toDate(),
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    // Return default if available
    if (DEFAULT_SETTINGS[key]) {
      return {
        key,
        ...DEFAULT_SETTINGS[key],
      };
    }
    return null;
  }
}

/**
 * Get setting value (shorthand)
 */
export async function getSettingValue<T = any>(key: string, defaultValue?: T): Promise<T> {
  const setting = await getSetting(key);
  if (setting) {
    return setting.value as T;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  // Return from defaults
  if (DEFAULT_SETTINGS[key]) {
    return DEFAULT_SETTINGS[key].value as T;
  }
  return defaultValue as T;
}

/**
 * Get all settings
 * Merges Firestore settings with defaults (defaults are used for missing settings)
 */
export async function getAllSettings(): Promise<SystemSetting[]> {
  try {
    const settingsRef = collection(db, 'systemSettings');
    const snapshot = await getDocs(settingsRef);

    // Create a map of existing Firestore settings
    const firestoreSettings = new Map<string, SystemSetting>();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      firestoreSettings.set(doc.id, {
        key: doc.id,
        value: data.value,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        dataType: data.dataType,
        createdAt: data.createdAt?.toDate(),
        createdBy: data.createdBy,
        updatedAt: data.updatedAt?.toDate(),
        updatedBy: data.updatedBy,
      });
    });

    // Merge with defaults - Firestore values take precedence
    const allSettings: SystemSetting[] = [];
    for (const [key, defaultSetting] of Object.entries(DEFAULT_SETTINGS)) {
      if (firestoreSettings.has(key)) {
        // Use Firestore value
        allSettings.push(firestoreSettings.get(key)!);
      } else {
        // Use default value (not yet in Firestore)
        allSettings.push({
          key,
          ...defaultSetting,
        });
      }
    }

    // Add any custom settings that aren't in defaults
    firestoreSettings.forEach((setting, key) => {
      if (!DEFAULT_SETTINGS[key]) {
        allSettings.push(setting);
      }
    });

    return allSettings;
  } catch (error) {
    console.error('Error getting all settings:', error);
    // Return defaults if Firestore fails
    return Object.entries(DEFAULT_SETTINGS).map(([key, setting]) => ({
      key,
      ...setting,
    }));
  }
}

/**
 * Get settings by category
 */
export async function getSettingsByCategory(category: SettingCategory): Promise<SystemSetting[]> {
  try {
    const settingsRef = collection(db, 'systemSettings');
    const q = query(settingsRef, where('category', '==', category));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        key: doc.id,
        value: data.value,
        description: data.description,
        category: data.category,
        isPublic: data.isPublic,
        dataType: data.dataType,
        createdAt: data.createdAt?.toDate(),
        createdBy: data.createdBy,
        updatedAt: data.updatedAt?.toDate(),
        updatedBy: data.updatedBy,
      };
    });
  } catch (error) {
    console.error(`Error getting settings for category ${category}:`, error);
    return [];
  }
}

/**
 * Update a setting
 */
export async function updateSetting(
  key: string,
  value: any,
  adminUserId: string
): Promise<void> {
  try {
    const settingRef = doc(db, 'systemSettings', key);
    const settingSnap = await getDoc(settingRef);

    if (settingSnap.exists()) {
      // Update existing setting
      await setDoc(settingRef, {
        ...settingSnap.data(),
        value,
        updatedAt: Timestamp.now(),
        updatedBy: adminUserId,
      });
    } else {
      // Create new setting (use default structure if available)
      const defaultSetting = DEFAULT_SETTINGS[key];
      if (defaultSetting) {
        await setDoc(settingRef, {
          ...defaultSetting,
          value,
          createdAt: Timestamp.now(),
          createdBy: adminUserId,
          updatedAt: Timestamp.now(),
          updatedBy: adminUserId,
        });
      } else {
        throw new Error(`Setting ${key} does not exist and no default is defined`);
      }
    }

    console.log(`✅ Updated setting: ${key} = ${value}`);
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    throw error;
  }
}

/**
 * Create a new custom setting
 */
export async function createSetting(
  setting: Omit<SystemSetting, 'createdAt' | 'updatedAt'>,
  adminUserId: string
): Promise<void> {
  try {
    const settingRef = doc(db, 'systemSettings', setting.key);
    
    await setDoc(settingRef, {
      value: setting.value,
      description: setting.description,
      category: setting.category,
      isPublic: setting.isPublic,
      dataType: setting.dataType,
      createdAt: Timestamp.now(),
      createdBy: adminUserId,
      updatedAt: Timestamp.now(),
      updatedBy: adminUserId,
    });

    console.log(`✅ Created setting: ${setting.key}`);
  } catch (error) {
    console.error(`Error creating setting ${setting.key}:`, error);
    throw error;
  }
}

/**
 * Get public settings (for non-admin users)
 */
export async function getPublicSettings(): Promise<Record<string, any>> {
  try {
    const settingsRef = collection(db, 'systemSettings');
    const q = query(settingsRef, where('isPublic', '==', true));
    const snapshot = await getDocs(q);

    const settings: Record<string, any> = {};
    snapshot.docs.forEach(doc => {
      settings[doc.id] = doc.data().value;
    });

    return settings;
  } catch (error) {
    console.error('Error getting public settings:', error);
    return {};
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get electricity rate (most commonly used setting)
 */
export async function getElectricityRate(): Promise<number> {
  return getSettingValue<number>('defaultElectricityRate', 12.0);
}

/**
 * Get device online threshold in milliseconds
 */
export async function getDeviceOnlineThreshold(): Promise<number> {
  const seconds = await getSettingValue<number>('deviceOnlineThreshold', 120);
  return seconds * 1000; // Convert to milliseconds
}

/**
 * Check if maintenance mode is enabled
 */
export async function isMaintenanceModeEnabled(): Promise<boolean> {
  return getSettingValue<boolean>('maintenanceMode', false);
}

export const systemSettingsService = {
  initializeSettings,
  getSetting,
  getSettingValue,
  getAllSettings,
  getSettingsByCategory,
  updateSetting,
  createSetting,
  getPublicSettings,
  getElectricityRate,
  getDeviceOnlineThreshold,
  isMaintenanceModeEnabled,
  DEFAULT_SETTINGS,
};
