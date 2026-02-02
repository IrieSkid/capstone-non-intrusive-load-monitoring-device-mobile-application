# 🎯 Current Features - NILM Mobile App

**Last Updated**: February 2, 2026  
**Status**: ✅ Fully Functional with Database Integration

---

## 📱 Core Features

### 1. **Authentication System** ✅
- Email/Password authentication with Firebase
- Secure user registration and login
- Password reset functionality
- Session persistence with AsyncStorage
- Protected routes and auth guards

### 2. **Real-Time Dashboard** ✅
- Live power consumption monitoring (updates every 3 seconds)
- Interactive appliance control with toggle switches
- Real-time power calculation from active appliances
- Visual feedback for device connection status
- Energy consumption tracking (cumulative kWh)

**Key Metrics Displayed:**
- Current Power (Watts)
- Voltage, Current, Power Factor
- Frequency, Total Energy (kWh)
- Active/Inactive appliance list

### 3. **Device Management** ✅
- Device registration with 4-step wizard
- Device list with online status and last seen
- Device details and settings
- Connection testing and device restart
- Location and network configuration
- Device deletion with confirmation

### 4. **Appliance Management** ✅
- Add appliances with name, category, rated power, icon, and port number
- View all appliances per device
- Edit appliance details (name, category, power, icon, port)
- Delete appliances with confirmation
- Active/Inactive status tracking
- Real-time power consumption per appliance

**Appliance Fields:**
- Name, Category, Icon (emoji)
- Rated Power (Watts)
- Port Number (1-8, for hardware mapping)
- Current Power, Usage Minutes
- Last Detected timestamp
- Active status (ON/OFF)

### 5. **Reports & Analytics** ✅
- **Daily Reports**: Hourly breakdown, 24-hour data
- **Weekly Reports**: Daily breakdown, 7-day summary
- **Monthly Reports**: Daily + weekly aggregates, projections
- **Cost Analysis**: Time-of-day breakdown (morning/afternoon/evening/night)
- **Appliance Breakdown**: Per-appliance consumption, costs, runtime
- Date range filtering
- CSV export and clipboard copy

**Report Metrics:**
- Total kWh consumption
- Total cost (₱12/kWh)
- Peak power, Average power
- Appliance usage percentage
- Estimated monthly costs
- Savings opportunities

### 6. **Notifications & Alerts** ✅
- Real-time alert monitoring based on user-defined rules
- Alert types: Power Threshold, Consumption Limit, Device Offline, Budget Exceeded, Unusual Pattern
- Notification types: Alert (red), Warning (orange), Info (blue)
- Unread count badge
- Mark as read / Delete actions
- Filter by alert type

**Alert Rules:**
- Configurable thresholds
- Severity levels (high/medium/low)
- Automatic notification triggering
- 1-hour cooldown per rule

### 7. **Database Integration (Firestore)** ✅
- All data persisted to Firestore
- Real-time synchronization
- Per-appliance reading tracking
- Usage time and last detected tracking
- Automatic data aggregation

**Collections:**
- `users`: User profiles
- `devices`: IoT device registrations
- `appliances`: Appliance configurations
- `realTimeReadings`: Power readings with per-appliance data
- `consumptionSummaries`: Aggregated daily/weekly/monthly data
- `notifications`: User notifications
- `alertRules`: User-defined alert configurations
- `electricityRates`: Rate plans and pricing

---

## 🎨 UI/UX Features

### Design System
- Light/Dark mode support
- Custom themed components
- Consistent color scheme
- Responsive layouts
- Smooth animations
- Icon-based navigation

### Navigation
- Tab-based navigation (Home, Devices, Reports, Alerts, Profile)
- Stack navigation for detailed views
- Back button handling
- Deep linking support

### User Experience
- Pull-to-refresh on all screens
- Loading states and skeletons
- Error handling with user-friendly messages
- Confirmation dialogs for destructive actions
- Real-time feedback on user actions
- Haptic feedback on interactions

---

## 🔥 Real-Time Simulation System

### How It Works:
1. **User toggles appliance** → State saved to Firestore
2. **Every 3 seconds**: 
   - Calculate total power from active appliances
   - Generate reading with appliance snapshot
   - Update local UI
3. **Every 30 seconds**:
   - Save reading to Firestore `realTimeReadings`
   - Update appliance `usageMinutes` and `lastDetected`
4. **Reports fetch** actual data from Firestore
5. **Alert monitoring** checks readings against rules

### Data Flow:
```
User Action (Toggle Appliance)
    ↓
Firestore Update (isActive, lastDetected)
    ↓
Local State Update
    ↓
Real-Time Data Generation (every 3s)
    ↓
Firestore Persistence (every 30s)
    ↓
Reports & Analytics (on demand)
    ↓
Alert Monitoring (continuous)
```

---

## 📊 Data Tracking

### Per-Appliance Tracking:
- **Real-Time**: Current power, ON/OFF state, runtime
- **Historical**: Total usage minutes, last detected
- **Aggregated**: Daily/weekly/monthly consumption
- **Cost**: Per-appliance cost breakdown

### Reading Structure:
```typescript
{
  deviceId: string,
  timestamp: Date,
  power: number,           // Total device power
  voltage: number,
  current: number,
  powerFactor: number,
  frequency: number,
  energy: number,          // Cumulative kWh
  applianceReadings: [     // Per-appliance snapshot
    {
      applianceId: string,
      applianceName: string,
      power: number,
      isActive: boolean,
      runtime: number
    }
  ]
}
```

---

## 🎯 Key Achievements

1. ✅ **Full Database Integration**: All features use Firestore, no mock data
2. ✅ **Real-Time Simulation**: Accurate power calculation from appliances
3. ✅ **Per-Appliance Tracking**: Detailed usage data per appliance
4. ✅ **Automatic Alerts**: Rule-based notification system
5. ✅ **Comprehensive Reports**: Multi-period analytics with breakdowns
6. ✅ **Usage Persistence**: Runtime and detection tracking in database
7. ✅ **Cost Analysis**: Time-of-day and appliance-level cost breakdown

---

## 🚀 Ready for Hardware Integration

The app is designed to seamlessly integrate with real IoT hardware:

### Current Simulation:
- Uses rated power values
- Simulates appliance states
- Generates realistic readings

### When Hardware is Ready:
1. Replace `realtimeDataService.generateReading()` with actual sensor data
2. Connect to MQTT/WebSocket for real-time data
3. Hardware sends per-port power readings
4. Map ports to appliances using `portNumber` field
5. All UI and database logic remains the same!

**Hardware Communication:**
```
IoT Device (8 ports)
    ↓ (MQTT/WebSocket)
Mobile App receives:
{
  port1Power: 1200W,
  port2Power: 300W,
  port3Power: 0W,
  ...
}
    ↓
Map to Appliances using portNumber
    ↓
Same data flow as simulation!
```

---

## 📱 Technical Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Styling**: StyleSheet API with custom theme
- **Charts**: Custom React Native components
- **File System**: Expo FileSystem
- **Clipboard**: Expo Clipboard

---

## 🔐 Security Features

- Secure authentication with Firebase
- Row-level security with Firestore rules
- User-specific data isolation
- Protected API calls
- Secure credential storage
- Session management

---

## 📈 Performance

- Optimized re-renders with React.memo
- Efficient Firestore queries with indexes
- Batch updates for multiple appliances
- Debounced data saves (30-second intervals)
- Lazy loading for large lists
- Image optimization

---

## 🎓 User Guide

### Getting Started:
1. **Register/Login** with email and password
2. **Add a Device** using the 4-step wizard
3. **Add Appliances** to your device with port numbers
4. **Toggle Appliances** on Dashboard to control
5. **View Reports** to see consumption and costs
6. **Configure Alerts** to get notified of issues

### Best Practices:
- Add all appliances with accurate rated power
- Use descriptive names and appropriate icons
- Set up alert rules for important thresholds
- Check reports regularly for insights
- Update appliance details as needed

---

**For detailed setup instructions, see**: [SETUP-GUIDE.md](./SETUP-GUIDE.md)  
**For Firebase configuration, see**: [FIREBASE-SETUP.md](./FIREBASE-SETUP.md)  
**For Firestore indexes, see**: [FIRESTORE-INDEXES.md](./FIRESTORE-INDEXES.md)
