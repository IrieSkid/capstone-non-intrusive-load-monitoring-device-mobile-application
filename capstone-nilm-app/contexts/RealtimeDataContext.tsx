/**
 * Real-Time Data Context
 * Provides real-time sensor data throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { realtimeDataService, RealtimeReading, ApplianceStatus } from '@/services/realtimeDataService';

interface RealtimeDataContextType {
  currentReading: RealtimeReading | null;
  appliances: ApplianceStatus[];
  isConnected: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

const RealtimeDataContext = createContext<RealtimeDataContextType | undefined>(undefined);

export function RealtimeDataProvider({ children }: { children: ReactNode }) {
  const [currentReading, setCurrentReading] = useState<RealtimeReading | null>(null);
  const [appliances, setAppliances] = useState<ApplianceStatus[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Auto-start monitoring when provider mounts
    startMonitoring();

    // Cleanup on unmount
    return () => {
      stopMonitoring();
    };
  }, []);

  const startMonitoring = () => {
    // Subscribe to data updates
    const dataUnsubscribe = realtimeDataService.subscribeToData((reading) => {
      setCurrentReading(reading);
    });

    // Subscribe to appliance updates
    const applianceUnsubscribe = realtimeDataService.subscribeToAppliances((applianceList) => {
      setAppliances(applianceList);
    });

    // Start the service
    realtimeDataService.start();
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
