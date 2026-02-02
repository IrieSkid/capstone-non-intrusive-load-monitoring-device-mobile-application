/**
 * Real-Time Data Service
 * Simulates WebSocket connection with live data updates
 * Now with Firestore persistence and real appliance data! 🔥
 */

import { readingService } from './readingService';
import { firestoreApplianceService, Appliance } from './firestoreApplianceService';

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
  private userId: string | null = null; // User ID for loading appliances

  constructor() {
    // Initialize with base values
    this.currentReading = this.generateReading();
    this.appliances = [];
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
   * Load appliances from Firestore
   */
  async loadAppliances(userId: string, deviceId: string): Promise<void> {
    try {
      console.log('📱 Loading appliances from Firestore...');
      const firestoreAppliances = await firestoreApplianceService.getDeviceAppliances(deviceId);
      
      // Convert to ApplianceStatus format
      this.appliances = firestoreAppliances.map(app => ({
        id: app.id,
        name: app.name,
        icon: app.icon,
        isOn: app.isActive || false, // Use isActive from database
        power: app.ratedPower,
        duration: app.usageMinutes || 0,
      }));

      console.log(`✅ Loaded ${this.appliances.length} appliances from database`);
      
      // Notify appliance callbacks
      this.applianceCallbacks.forEach(callback => callback([...this.appliances]));
    } catch (error) {
      console.error('Failed to load appliances:', error);
      // Fallback to empty array
      this.appliances = [];
    }
  }

  /**
   * Update appliance durations (increment usage time)
   */
  private updateAppliances(): void {
    // Increment duration for appliances that are on
    this.appliances = this.appliances.map(appliance => {
      if (appliance.isOn) {
        return {
          ...appliance,
          duration: appliance.duration + 0.05, // Add 3 seconds = 0.05 minutes
          // Add slight power variation (±5%) for realism
          power: appliance.power * (0.95 + Math.random() * 0.1),
        };
      }
      return appliance;
    });

    // Notify appliance callbacks
    this.applianceCallbacks.forEach(callback => callback([...this.appliances]));
  }

  /**
   * Toggle an appliance on/off
   */
  async toggleAppliance(applianceId: string): Promise<void> {
    const appliance = this.appliances.find(a => a.id === applianceId);
    if (!appliance) return;

    const newIsOn = !appliance.isOn;
    
    // Update local state
    this.appliances = this.appliances.map(a => {
      if (a.id === applianceId) {
        return {
          ...a,
          isOn: newIsOn,
          duration: newIsOn ? 0 : a.duration, // Reset duration when turned on
        };
      }
      return a;
    });

    // Update in Firestore
    try {
      await firestoreApplianceService.updateAppliance(applianceId, {
        isActive: newIsOn,
        currentPower: newIsOn ? appliance.power : 0,
      });
      console.log(`🔄 Toggled ${appliance.name}: ${newIsOn ? 'ON' : 'OFF'}`);
    } catch (error) {
      console.error('Failed to update appliance in Firestore:', error);
    }

    // Notify callbacks
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
  async start(deviceId?: string, userId?: string): Promise<void> {
    if (this.interval) return; // Already running

    this.isConnected = true;
    this.deviceId = deviceId || null;
    this.userId = userId || null;
    
    // Load appliances if we have deviceId and userId
    if (deviceId && userId) {
      await this.loadAppliances(userId, deviceId);
    }
    
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

      // Update appliances every cycle (update durations)
      this.updateAppliances();

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
