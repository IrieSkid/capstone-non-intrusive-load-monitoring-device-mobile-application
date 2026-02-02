/**
 * Real-Time Data Service
 * Simulates WebSocket connection with live data updates
 * Now with Firestore persistence! 🔥
 */

import { mockDevice, generateMockAppliances } from '@/utils/mockData';
import { readingService } from './readingService';

export interface RealtimeReading {
  timestamp: Date;
  voltage: number;
  current: number;
  power: number;
  powerFactor: number;
  frequency: number;
  energy: number; // Total kWh
}

export interface ApplianceStatus {
  id: string;
  name: string;
  icon: string;
  isOn: boolean;
  power: number; // Current watts
  duration: number; // Minutes on
}

type DataCallback = (data: RealtimeReading) => void;
type ApplianceCallback = (appliances: ApplianceStatus[]) => void;

class RealtimeDataService {
  private interval: NodeJS.Timeout | null = null;
  private dataCallbacks: Set<DataCallback> = new Set();
  private applianceCallbacks: Set<ApplianceCallback> = new Set();
  private isConnected = false;
  private currentReading: RealtimeReading;
  private appliances: ApplianceStatus[] = [];
  private totalEnergy = 0; // Cumulative kWh
  private deviceId: string | null = null; // Current device ID
  private saveInterval = 0; // Counter for saving to Firestore

  constructor() {
    // Initialize with base values
    this.currentReading = this.generateReading();
    this.appliances = this.generateAppliances();
  }

  /**
   * Generate realistic power reading
   */
  private generateReading(): RealtimeReading {
    // Base consumption varies by time of day
    const hour = new Date().getHours();
    let basePower = 1000; // Watts

    // Time-based variation
    if (hour >= 0 && hour < 6) basePower = 500; // Night
    else if (hour >= 6 && hour < 9) basePower = 2500; // Morning
    else if (hour >= 9 && hour < 18) basePower = 1500; // Day
    else if (hour >= 18 && hour < 22) basePower = 3000; // Evening
    else basePower = 1800; // Late evening

    // Add random variation (±15%)
    const variation = basePower * 0.15;
    const power = basePower + (Math.random() - 0.5) * 2 * variation;

    // Calculate other values based on power
    const voltage = 220 + (Math.random() - 0.5) * 10; // 220V ± 5V
    const current = power / voltage;
    const powerFactor = 0.85 + Math.random() * 0.1; // 0.85-0.95
    const frequency = 60 + (Math.random() - 0.5) * 0.2; // 60Hz ± 0.1Hz

    return {
      timestamp: new Date(),
      voltage,
      current,
      power,
      powerFactor,
      frequency,
      energy: this.totalEnergy,
    };
  }

  /**
   * Generate appliance statuses
   */
  private generateAppliances(): ApplianceStatus[] {
    const allAppliances = [
      { id: '1', name: 'Air Conditioner', icon: '❄️', avgPower: 1500, probability: 0.6 },
      { id: '2', name: 'Refrigerator', icon: '🧊', avgPower: 150, probability: 1.0 }, // Always on
      { id: '3', name: 'Water Heater', icon: '🚿', avgPower: 3000, probability: 0.2 },
      { id: '4', name: 'Washing Machine', icon: '🧺', avgPower: 500, probability: 0.1 },
      { id: '5', name: 'TV', icon: '📺', avgPower: 100, probability: 0.5 },
      { id: '6', name: 'Electric Fan', icon: '🌀', avgPower: 75, probability: 0.7 },
      { id: '7', name: 'Computer', icon: '💻', avgPower: 300, probability: 0.4 },
      { id: '8', name: 'Lights', icon: '💡', avgPower: 200, probability: 0.8 },
    ];

    return allAppliances.map(appliance => ({
      id: appliance.id,
      name: appliance.name,
      icon: appliance.icon,
      isOn: Math.random() < appliance.probability,
      power: appliance.avgPower + (Math.random() - 0.5) * appliance.avgPower * 0.1,
      duration: Math.floor(Math.random() * 240), // 0-240 minutes
    }));
  }

  /**
   * Update appliance states randomly
   */
  private updateAppliances(): void {
    // 10% chance each appliance changes state
    this.appliances = this.appliances.map(appliance => {
      if (Math.random() < 0.1) {
        // Toggle state
        const newIsOn = !appliance.isOn;
        return {
          ...appliance,
          isOn: newIsOn,
          duration: newIsOn ? 0 : appliance.duration,
        };
      }
      // Increment duration if on
      return {
        ...appliance,
        duration: appliance.isOn ? appliance.duration + 1 : appliance.duration,
      };
    });

    // Notify appliance callbacks
    this.applianceCallbacks.forEach(callback => callback([...this.appliances]));
  }

  /**
   * Calculate total power from appliances
   */
  private calculateTotalPower(): number {
    return this.appliances
      .filter(a => a.isOn)
      .reduce((sum, a) => sum + a.power, 0);
  }

  /**
   * Start streaming data
   */
  start(deviceId?: string): void {
    if (this.interval) return; // Already running

    this.isConnected = true;
    this.deviceId = deviceId || null;
    console.log('🔌 Real-time data service started', deviceId ? `for device ${deviceId}` : '');

    // Update every 3 seconds
    this.interval = setInterval(() => {
      // Update energy (cumulative)
      const appliancePower = this.calculateTotalPower();
      this.totalEnergy += (appliancePower / 1000) * (3 / 3600); // Convert to kWh for 3 seconds

      // Generate new reading based on appliances
      this.currentReading = {
        ...this.generateReading(),
        power: appliancePower + (Math.random() - 0.5) * 100, // Add some noise
        energy: this.totalEnergy,
      };

      // Notify data callbacks
      this.dataCallbacks.forEach(callback => callback({ ...this.currentReading }));

      // Update appliances periodically (every 5 cycles = 15 seconds)
      if (Math.random() < 0.2) {
        this.updateAppliances();
      }

      // Save to Firestore every 10 cycles (30 seconds)
      this.saveInterval++;
      if (this.saveInterval >= 10 && this.deviceId) {
        this.saveToFirestore();
        this.saveInterval = 0;
      }
    }, 3000); // Every 3 seconds
  }

  /**
   * Save current reading to Firestore
   */
  private async saveToFirestore(): Promise<void> {
    if (!this.deviceId) return;

    try {
      await readingService.saveReading(this.deviceId, this.currentReading);
      console.log('💾 Saved reading to Firestore');
    } catch (error) {
      console.error('Failed to save reading:', error);
      // Don't throw - we don't want to break the simulation
    }
  }

  /**
   * Stop streaming data
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isConnected = false;
      console.log('🔌 Real-time data service stopped');
    }
  }

  /**
   * Subscribe to data updates
   */
  subscribeToData(callback: DataCallback): () => void {
    this.dataCallbacks.add(callback);
    // Send current reading immediately
    callback({ ...this.currentReading });
    
    return () => {
      this.dataCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to appliance updates
   */
  subscribeToAppliances(callback: ApplianceCallback): () => void {
    this.applianceCallbacks.add(callback);
    // Send current appliances immediately
    callback([...this.appliances]);
    
    return () => {
      this.applianceCallbacks.delete(callback);
    };
  }

  /**
   * Get connection status
   */
  isConnectedToDevice(): boolean {
    return this.isConnected;
  }

  /**
   * Get current reading (snapshot)
   */
  getCurrentReading(): RealtimeReading {
    return { ...this.currentReading };
  }

  /**
   * Get current appliances (snapshot)
   */
  getCurrentAppliances(): ApplianceStatus[] {
    return [...this.appliances];
  }

  /**
   * Reset energy counter
   */
  resetEnergy(): void {
    this.totalEnergy = 0;
  }
}

// Export singleton instance
export const realtimeDataService = new RealtimeDataService();
