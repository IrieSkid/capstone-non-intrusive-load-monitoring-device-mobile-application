/**
 * Real-Time Data Service
 * Simulates WebSocket connection with live data updates
 * Now with Firestore persistence and real appliance data! 🔥
 * 
 * ⚠️ DEPLOYMENT NOTE:
 * Configure DEVELOPMENT_MODE in config/environment.ts before deployment
 */

import { readingService } from './readingService';
import { firestoreApplianceService, Appliance } from './firestoreApplianceService';
import { ENV, logConfig } from '@/config/environment';

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
  category: string;
  isOn: boolean;
  power: number;        // Current watts
  voltage: number;      // Voltage (V)
  current: number;      // Current (A)
  powerFactor: number;  // Power factor (0-1)
  duration: number;     // Minutes on
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

    // Calculate other values based on power (3 decimal places)
    const voltage = parseFloat((220 + (Math.random() - 0.5) * 10).toFixed(3)); // 220V ± 5V
    const current = parseFloat((power / voltage).toFixed(3));
    const powerFactor = parseFloat((0.85 + Math.random() * 0.1).toFixed(3)); // 0.85-0.95
    const frequency = parseFloat((60 + (Math.random() - 0.5) * 0.2).toFixed(3)); // 60Hz ± 0.1Hz

    return {
      timestamp: new Date(),
      voltage,
      current,
      power: parseFloat(power.toFixed(3)),
      powerFactor,
      frequency,
      energy: parseFloat(this.totalEnergy.toFixed(3)),
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
        category: app.category,
        isOn: app.isActive || false, // Use isActive from database
        power: app.currentPower || app.ratedPower, // Use current or rated power
        voltage: app.voltage || 220, // Load saved voltage or default
        current: app.current || 0,   // Load saved current
        powerFactor: app.powerFactor || this.getDefaultPowerFactor(app.category), // Load or calculate
        duration: app.usageMinutes || 0, // Load existing usage time
      }));

      console.log(`✅ Loaded ${this.appliances.length} appliances from database`);
      console.log(`   Active: ${this.appliances.filter(a => a.isOn).map(a => `${a.name} (${a.duration}min)`).join(', ') || 'None'}`);
      
      // Notify appliance callbacks
      this.applianceCallbacks.forEach(callback => callback([...this.appliances]));
    } catch (error) {
      console.error('Failed to load appliances:', error);
      // Fallback to empty array
      this.appliances = [];
    }
  }

  /**
   * Get default power factor based on appliance category
   */
  private getDefaultPowerFactor(category: string): number {
    const powerFactors: { [key: string]: number } = {
      'Cooling': 0.85,      // AC, Fans - Motors
      'Heating': 0.95,      // Heaters - Resistive
      'Lighting': 0.90,     // LED/CFL lights
      'Entertainment': 0.88, // TV, Audio - Electronics
      'Kitchen': 0.92,      // Microwave, etc.
      'Laundry': 0.80,      // Washing machine - Motors
      'Computing': 0.85,    // Computer, Laptop - SMPS
      'Other': 0.90,        // Default
    };
    return powerFactors[category] || 0.90;
  }

  /**
   * Update appliance durations and electrical parameters
   */
  private updateAppliances(): void {
    // Get current device voltage from reading
    const deviceVoltage = this.currentReading.voltage;
    
    // Increment duration for appliances that are on
    this.appliances = this.appliances.map(appliance => {
      if (appliance.isOn) {
        // Add slight power variation (±5%) for realism (3 decimal places)
        const actualPower = parseFloat((appliance.power * (0.95 + Math.random() * 0.1)).toFixed(3));
        
        // Calculate current: I = P / (V * PF) (3 decimal places)
        const current = parseFloat((actualPower / (deviceVoltage * appliance.powerFactor)).toFixed(3));
        
        // Add slight voltage variation (±2V) (3 decimal places)
        const voltage = parseFloat((deviceVoltage + (Math.random() - 0.5) * 4).toFixed(3));
        
        // Add slight power factor variation (±0.02) (3 decimal places)
        const basePF = this.getDefaultPowerFactor(appliance.category);
        const powerFactor = parseFloat(Math.min(1.0, Math.max(0.5, basePF + (Math.random() - 0.5) * 0.04)).toFixed(3));
        
        return {
          ...appliance,
          duration: parseFloat((appliance.duration + 0.05).toFixed(3)), // Add 3 seconds = 0.05 minutes
          power: actualPower,
          voltage,
          current,
          powerFactor,
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
    const now = new Date();
    
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
      const updateData: any = {
        isActive: newIsOn,
        currentPower: newIsOn ? appliance.power : 0,
        updatedAt: now,
      };

      // If turning ON, reset usage timer but keep lastDetected
      // If turning OFF, save final usage time
      if (!newIsOn && appliance.duration > 0) {
        updateData.usageMinutes = Math.round(appliance.duration);
      }
      
      // Always update lastDetected when turning ON
      if (newIsOn) {
        updateData.lastDetected = now;
      }

      await firestoreApplianceService.updateAppliance(applianceId, updateData);
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
    console.log('⚙️  UI Update Interval:', ENV.UI_UPDATE_INTERVAL / 1000, 'seconds');
    console.log('💾 Persistence Interval:', ENV.PERSISTENCE_INTERVAL / 1000, 'seconds');

    // Update UI at configured interval (3 seconds for smooth UI)
    this.interval = setInterval(() => {
      // Update energy (cumulative)
      const appliancePower = this.calculateTotalPower();
      const intervalSeconds = ENV.UI_UPDATE_INTERVAL / 1000;
      this.totalEnergy += (appliancePower / 1000) * (intervalSeconds / 3600); // Convert to kWh

      // Generate new reading based on appliances
      this.currentReading = {
        ...this.generateReading(),
        power: appliancePower + (Math.random() - 0.5) * 100, // Add some noise
        energy: this.totalEnergy,
      };

      // Notify data callbacks (UI updates)
      this.dataCallbacks.forEach(callback => callback({ ...this.currentReading }));

      // Update appliances every cycle (update durations)
      this.updateAppliances();

      // Increment persistence counter
      this.persistenceCounter += ENV.UI_UPDATE_INTERVAL;

      // Save to Firestore at configured persistence interval
      // In development: Every 30 seconds
      // In production: Every 3 seconds
      if (this.persistenceCounter >= ENV.PERSISTENCE_INTERVAL && this.deviceId) {
        this.saveToFirestore(); // This now also updates appliance usage
        this.persistenceCounter = 0;
        
        if (ENV.DEVELOPMENT_MODE) {
          console.log('💾 [DEV MODE] Saved reading (reduced frequency to save quota)');
        }
      }
    }, ENV.UI_UPDATE_INTERVAL); // Configurable UI update rate
  }

  /**
   * Save current reading to Firestore with appliance data
   */
  private async saveToFirestore(): Promise<void> {
    if (!this.deviceId) return;

    try {
      // Save reading with appliance snapshot
      await readingService.saveReading(this.deviceId, this.currentReading, this.appliances);
      
      // Update appliance usage data in Firestore
      await this.updateApplianceUsageInFirestore();
      
      console.log('💾 Saved reading with', this.appliances.length, 'appliances to Firestore');
    } catch (error) {
      console.error('Failed to save reading:', error);
      // Don't throw - we don't want to break the simulation
    }
  }

  /**
   * Update appliance usage data in Firestore (usageMinutes, lastDetected, electrical params)
   */
  private async updateApplianceUsageInFirestore(): Promise<void> {
    const now = new Date();
    const updatePromises = this.appliances.map(async (appliance) => {
      if (appliance.isOn) {
        // Update usage time, electrical parameters, and last detected for active appliances
        try {
          await firestoreApplianceService.updateAppliance(appliance.id, {
            usageMinutes: Math.round(appliance.duration), // Round to nearest minute
            lastDetected: now,
            currentPower: appliance.power,
            voltage: appliance.voltage,
            current: appliance.current,
            powerFactor: appliance.powerFactor,
          });
        } catch (error) {
          console.error(`Failed to update usage for ${appliance.name}:`, error);
        }
      }
    });

    await Promise.all(updatePromises);
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
