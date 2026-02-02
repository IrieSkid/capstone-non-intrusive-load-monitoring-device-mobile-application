/**
 * Real-Time Data Context
 * Provides real-time sensor data throughout the app
 * Now with Firestore integration! 🔥
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { realtimeDataService, RealtimeReading, ApplianceStatus } from '@/services/realtimeDataService';
import { deviceService } from '@/services/deviceService';
import { firestoreApplianceService } from '@/services/firestoreApplianceService';
import { useAuth } from '@/hooks/useAuth';

interface RealtimeDataContextType {
  currentReading: RealtimeReading | null;
  appliances: ApplianceStatus[];
  isConnected: boolean;
  deviceId: string | null;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

const RealtimeDataContext = createContext<RealtimeDataContextType | undefined>(undefined);

export function RealtimeDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentReading, setCurrentReading] = useState<RealtimeReading | null>(null);
  const [appliances, setAppliances] = useState<ApplianceStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Initialize device and start monitoring
      initializeDevice();
    }

    // Cleanup on unmount
    return () => {
      stopMonitoring();
    };
  }, [user]);

  const initializeDevice = async () => {
    if (!user) return;

    try {
      // Get user's devices
      let devices = await deviceService.getUserDevices(user.uid);
      
      // If no device exists, create a mock one for testing
      if (devices.length === 0) {
        console.log('📱 No device found, creating mock device...');
        const mockDevice = await deviceService.createMockDevice(user.uid);
        devices = [mockDevice];

        // Also create default appliances
        await firestoreApplianceService.createDefaultAppliances(user.uid, mockDevice.id);
      }

      // Use the first device
      const device = devices[0];
      setDeviceId(device.id);

      // Start monitoring with this device
      startMonitoring(device.id);
    } catch (error) {
      console.error('Failed to initialize device:', error);
      // Fall back to mock mode without Firestore
      startMonitoring();
    }
  };

  const startMonitoring = (deviceIdParam?: string) => {
    // Subscribe to data updates
    const dataUnsubscribe = realtimeDataService.subscribeToData((reading) => {
      setCurrentReading(reading);
    });

    // Subscribe to appliance updates
    const applianceUnsubscribe = realtimeDataService.subscribeToAppliances((applianceList) => {
      setAppliances(applianceList);
    });

    // Start the service with device ID for Firestore persistence
    realtimeDataService.start(deviceIdParam);
    setIsConnected(true);

    // Return cleanup function
    return () => {
      dataUnsubscribe();
      applianceUnsubscribe();
    };
  };

  const stopMonitoring = () => {
    realtimeDataService.stop();
    setIsConnected(false);
  };

  return (
    <RealtimeDataContext.Provider
      value={{
        currentReading,
        appliances,
        isConnected,
        deviceId,
        startMonitoring,
        stopMonitoring,
      }}>
      {children}
    </RealtimeDataContext.Provider>
  );
}

export function useRealtimeData() {
  const context = useContext(RealtimeDataContext);
  if (context === undefined) {
    throw new Error('useRealtimeData must be used within a RealtimeDataProvider');
  }
  return context;
}
