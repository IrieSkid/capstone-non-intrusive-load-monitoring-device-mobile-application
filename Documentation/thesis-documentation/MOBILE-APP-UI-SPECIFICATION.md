# NILM System - Mobile App UI/UX Specification

**Platform**: React Native + Expo  
**Target Devices**: iOS and Android  
**Design System**: Material Design / React Native Paper

---

## App Architecture

### Navigation Structure
- **Navigation Type**: Bottom Tab Navigation + Stack Navigation
- **Main Tabs**: Dashboard, Devices, Reports, Notifications, Profile
- **Authentication Flow**: Stack Navigation (Login → Register → Forgot Password)

---

## SCREEN 1: SPLASH SCREEN

### Layout
```
┌─────────────────────────────────┐
│                                 │
│         [App Logo]              │
│      NILM Monitoring            │
│                                 │
│    [Loading Indicator]          │
│                                 │
│    Version 1.0.0                │
│                                 │
└─────────────────────────────────┘
```

### Components
- **App Logo**: Centered, animated fade-in
- **App Name**: "NILM Monitoring" or "Energy Monitor"
- **Loading Indicator**: Circular progress indicator
- **Version Number**: Bottom center, small text

### Behavior
- Auto-navigate to Login if not authenticated
- Auto-navigate to Dashboard if authenticated
- Duration: 2-3 seconds

---

## SCREEN 2: LOGIN SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back          [Skip/Help?]   │
│                                 │
│         [App Logo]              │
│      Welcome Back!              │
│   Sign in to continue           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email Address             │  │
│  │ [________________]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password                  │  │
│  │ [________________]  👁    │  │
│  └───────────────────────────┘  │
│                                 │
│  [ ] Remember Me                │
│  Forgot Password?                │
│                                 │
│  ┌───────────────────────────┐  │
│  │      SIGN IN              │  │
│  └───────────────────────────┘  │
│                                 │
│  ───────── OR ─────────         │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Continue with Google    │  │
│  └───────────────────────────┘  │
│                                 │
│  Don't have an account?          │
│  Sign Up                         │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Header**: Back button (if navigated from), Skip/Help link
- **Logo/Title**: App branding
- **Email Input**: Text input with email keyboard
- **Password Input**: Text input with password visibility toggle
- **Remember Me**: Checkbox
- **Forgot Password**: Link to password reset
- **Sign In Button**: Primary action button
- **Google Sign In**: Secondary authentication option
- **Sign Up Link**: Navigation to registration

### Validation
- Email format validation
- Password minimum length (6 characters)
- Show error messages below inputs
- Disable button until valid input

### User Flow
- Login → Dashboard (if successful)
- Forgot Password → Password Reset Screen
- Sign Up → Registration Screen

---

## SCREEN 3: REGISTRATION SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│      Create Account             │
│   Join NILM Monitoring           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Full Name                 │  │
│  │ [________________]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email Address             │  │
│  │ [________________]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Phone Number (Optional)   │  │
│  │ [________________]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password                  │  │
│  │ [________________]  👁    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Confirm Password          │  │
│  │ [________________]  👁    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Role                      │  │
│  │ [Tenant ▼]                │  │
│  └───────────────────────────┘  │
│                                 │
│  [ ] I agree to Terms & Privacy │
│                                 │
│  ┌───────────────────────────┐  │
│  │      CREATE ACCOUNT       │  │
│  └───────────────────────────┘  │
│                                 │
│  Already have an account?        │
│  Sign In                         │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Full Name Input**: Required field
- **Email Input**: Required, with validation
- **Phone Number Input**: Optional, with country code
- **Password Input**: With strength indicator
- **Confirm Password**: Must match password
- **Role Selector**: Dropdown (Tenant, Landlord, Admin)
- **Terms Checkbox**: Required to proceed
- **Create Account Button**: Primary action
- **Sign In Link**: Navigation to login

### Validation
- All required fields must be filled
- Email format validation
- Password strength requirements
- Password match validation
- Terms acceptance required

---

## SCREEN 4: FORGOT PASSWORD SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│      Reset Password             │
│   Enter your email to receive   │
│   password reset instructions   │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email Address             │  │
│  │ [________________]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   SEND RESET LINK         │  │
│  └───────────────────────────┘  │
│                                 │
│  Remember your password?         │
│  Sign In                         │
│                                 │
└─────────────────────────────────┘
```

### Behavior
- Send password reset email
- Show success message
- Navigate to email confirmation screen

---

## SCREEN 5: MAIN DASHBOARD (Home Screen)

### Layout
```
┌─────────────────────────────────┐
│  ☰ Menu    🔔(3)    👤 Profile  │
│                                 │
│  Good [Morning/Afternoon/Evening]│
│  John Doe                       │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Current Power            │  │
│  │                           │  │
│  │      1,250 W              │  │
│  │      ⚡ Active             │  │
│  │                           │  │
│  │  Last updated: 10:30 AM    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────┐  ┌───────┐  ┌──────┐│
│  │ 220V  │  │ 5.68A │  │ 0.95 ││
│  │Voltage│  │Current│  │  PF  ││
│  └───────┘  └───────┘  └──────┘│
│                                 │
│  Today's Consumption            │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Line Chart]           │  │
│  │    5.2 kWh                │  │
│  │    ₱65.00                 │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Active Appliances (3)          │
│  ┌───────────────────────────┐  │
│  │ 🧊 Refrigerator   150 W   │  │
│  │    ON • 2.5 hours         │  │
│  ├───────────────────────────┤  │
│  │ ❄️ Air Conditioner 1000W  │  │
│  │    ON • 1.2 hours         │  │
│  ├───────────────────────────┤  │
│  │ 📺 Television      80 W    │  │
│  │    ON • 0.5 hours         │  │
│  └───────────────────────────┘  │
│                                 │
│  [View All Appliances →]        │
│                                 │
│  Quick Actions                   │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │📊    │ │📱    │ │⚙️    │    │
│  │Reports│ │Devices│ │Settings│    │
│  └──────┘ └──────┘ └──────┘    │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Header**: 
  - Hamburger menu (drawer navigation)
  - Notification bell with badge count
  - Profile icon/avatar
- **Greeting**: Time-based greeting with user name
- **Current Power Card**: 
  - Large power display (Watts)
  - Status indicator (Active/Inactive)
  - Last update timestamp
  - Real-time updates
- **Electrical Parameters**: 
  - Three cards: Voltage, Current, Power Factor
  - Compact display
- **Today's Consumption Card**:
  - Line chart showing hourly consumption
  - Total kWh for today
  - Estimated cost in PHP
  - Tap to view detailed chart
- **Active Appliances List**:
  - List of currently ON appliances
  - Icon, name, current power, duration
  - Status indicator
  - Tap to view appliance details
  - "View All" link to appliances screen
- **Quick Actions**: 
  - Three icon buttons: Reports, Devices, Settings
  - Quick navigation shortcuts

### Real-Time Updates
- Power values update every 5 seconds
- Appliance status updates in real-time
- Chart data refreshes automatically
- Pull-to-refresh available

### User Interactions
- Tap power card → Detailed power view
- Tap chart → Full screen chart view
- Tap appliance → Appliance details
- Pull down → Refresh data
- Tap quick actions → Navigate to respective screens

---

## SCREEN 6: DEVICES SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back    My Devices    ➕ Add  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🏠 Main Meter             │  │
│  │                           │  │
│  │ Status: 🟢 Online          │  │
│  │ Location: Living Room      │  │
│  │ Last Sync: 2 min ago       │  │
│  │                           │  │
│  │ Current: 1,250 W          │  │
│  │ Today: 5.2 kWh            │  │
│  │                           │  │
│  │ Appliances: 5             │  │
│  │                           │  │
│  │ [View Details →]           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🏢 Unit 2 Meter            │  │
│  │                           │  │
│  │ Status: 🔴 Offline        │  │
│  │ Location: Unit 2          │  │
│  │ Last Sync: 15 min ago     │  │
│  │                           │  │
│  │ [View Details →]           │  │
│  └───────────────────────────┘  │
│                                 │
│  [➕ Add New Device]            │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Header**: 
  - Back button
  - Screen title "My Devices"
  - Add button (+ icon)
- **Device Cards**: 
  - Device name with icon
  - Status indicator (Online/Offline/Error)
  - Location
  - Last sync timestamp
  - Current power (if online)
  - Today's consumption (if online)
  - Appliance count
  - View Details button
- **Add Device Button**: 
  - Floating action button or card
  - Navigate to device registration

### Device Card States
- **Online**: Green indicator, shows real-time data
- **Offline**: Red indicator, shows last known data
- **Error**: Yellow indicator, shows error message

### User Interactions
- Tap device card → Device details screen
- Tap Add → Device registration screen
- Swipe device card → Quick actions (Edit/Delete)
- Pull to refresh → Update device status

---

## SCREEN 7: DEVICE DETAILS SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back              ⋮ Menu     │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🏠 Main Meter             │  │
│  │                           │  │
│  │ 🟢 Online                 │  │
│  │ Location: Living Room      │  │
│  │ Serial: NILM-001          │  │
│  │                           │  │
│  │ Current Power: 1,250 W    │  │
│  │ Today: 5.2 kWh • ₱65.00  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Real-Time Readings        │  │
│  │                           │  │
│  │ Voltage:    220.5 V       │  │
│  │ Current:      5.68 A       │  │
│  │ Power:     1,250 W       │  │
│  │ Apparent:  1,315 VA      │  │
│  │ Power Factor: 0.95       │  │
│  │                           │  │
│  │ Last Update: 10:30:15 AM │  │
│  └───────────────────────────┘  │
│                                 │
│  Appliances (5)                 │
│  ┌───────────────────────────┐  │
│  │ 🧊 Refrigerator           │  │
│  │    ON • 150 W • Port 1    │  │
│  ├───────────────────────────┤  │
│  │ ❄️ Air Conditioner         │  │
│  │    ON • 1000 W • Port 2   │  │
│  ├───────────────────────────┤  │
│  │ 📺 Television             │  │
│  │    ON • 80 W • Port 3     │  │
│  ├───────────────────────────┤  │
│  │ 💡 Living Room Lights     │  │
│  │    OFF • Port 4           │  │
│  ├───────────────────────────┤  │
│  │ 🌀 Electric Fan           │  │
│  │    OFF • Port 5           │  │
│  └───────────────────────────┘  │
│                                 │
│  [➕ Add Appliance]              │
│                                 │
│  Consumption History            │
│  ┌───────────────────────────┐  │
│  │ [Bar Chart - Last 7 Days]│  │
│  └───────────────────────────┘  │
│                                 │
│  [View Full History →]           │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Device Header Card**: 
  - Device name and icon
  - Status indicator
  - Location and serial number
  - Current consumption summary
- **Real-Time Readings Card**: 
  - All electrical parameters
  - Live updating values
  - Last update timestamp
- **Appliances List**: 
  - All appliances for this device
  - Status (ON/OFF), power, port number
  - Tap to view appliance details
- **Add Appliance Button**: 
  - Navigate to add appliance screen
- **Consumption History Chart**: 
  - Mini chart showing recent consumption
  - Tap to view full history

### Menu Options (⋮)
- Edit Device
- Delete Device
- Device Settings
- View Logs
- Share Device

---

## SCREEN 8: ADD/EDIT DEVICE SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Cancel    Add Device    ✓ Save│
│                                 │
│  ┌───────────────────────────┐  │
│  │ Device Information         │  │
│  │                           │  │
│  │ Device Name *             │  │
│  │ [________________]         │  │
│  │                           │  │
│  │ Serial Number *           │  │
│  │ [________________]         │  │
│  │                           │  │
│  │ MAC Address *            │  │
│  │ [________________]         │  │
│  │                           │  │
│  │ Location                  │  │
│  │ [________________]         │  │
│  │                           │  │
│  │ WiFi SSID                │  │
│  │ [________________]         │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Scan QR Code             │  │
│  │ [Scan Device QR Code]     │  │
│  └───────────────────────────┘  │
│                                 │
│  Instructions:                  │
│  1. Power on the device         │
│  2. Scan QR code on device      │
│  3. Or enter details manually   │
│                                 │
│  ┌───────────────────────────┐  │
│  │      REGISTER DEVICE     │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Device Name Input**: Required
- **Serial Number Input**: Required, unique
- **MAC Address Input**: Required, unique
- **Location Input**: Optional
- **WiFi SSID Input**: Optional, for reference
- **QR Code Scanner**: 
  - Button to open camera scanner
  - Auto-fill device information
- **Instructions**: Step-by-step guide
- **Register Button**: Submit device registration

### Validation
- All required fields must be filled
- Serial number and MAC address must be unique
- Format validation for MAC address
- Show loading state during registration

---

## SCREEN 9: APPLIANCES SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back    Appliances    ➕ Add  │
│                                 │
│  Filter: [All ▼] [Device ▼]      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🧊 Refrigerator           │  │
│  │    Main Meter • Port 1     │  │
│  │                           │  │
│  │ Status: 🟢 ON             │  │
│  │ Current: 150 W             │  │
│  │ Today: 2.5 kWh            │  │
│  │ Rated: 200 W              │  │
│  │                           │  │
│  │ [View Details →]           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ❄️ Air Conditioner         │  │
│  │    Main Meter • Port 2     │  │
│  │                           │  │
│  │ Status: 🟢 ON             │  │
│  │ Current: 1000 W           │  │
│  │ Today: 8.5 kWh            │  │
│  │ Rated: 1500 W             │  │
│  │                           │  │
│  │ [View Details →]           │  │
│  └───────────────────────────┘  │
│                                 │
│  [➕ Add New Appliance]          │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Header**: 
  - Back button
  - Screen title
  - Add button
- **Filter Options**: 
  - Filter by device
  - Filter by status (All/ON/OFF)
  - Search bar
- **Appliance Cards**: 
  - Appliance icon and name
  - Device and port information
  - Current status (ON/OFF)
  - Current power consumption
  - Today's consumption
  - Rated power
  - View Details button
- **Add Appliance Button**: 
  - Navigate to add appliance screen

### Filtering and Sorting
- Filter by device
- Filter by status
- Sort by: Name, Power, Consumption
- Search by appliance name

---

## SCREEN 10: APPLIANCE DETAILS SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back              ⋮ Menu     │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🧊 Refrigerator            │  │
│  │                           │  │
│  │ Status: 🟢 ON             │  │
│  │ Device: Main Meter         │  │
│  │ Port: 1                    │  │
│  │ Type: Refrigerator          │  │
│  │                           │  │
│  │ Current: 150 W             │  │
│  │ Rated: 200 W              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Today's Consumption       │  │
│  │                           │  │
│  │ 2.5 kWh                  │  │
│  │ ₱31.25                   │  │
│  │                           │  │
│  │ [Line Chart - 24 hours]  │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Usage Statistics          │  │
│  │                           │  │
│  │ Average Daily: 2.3 kWh   │  │
│  │ This Week: 16.1 kWh       │  │
│  │ This Month: 75.0 kWh     │  │
│  │                           │  │
│  │ Peak Hours: 6-10 PM      │  │
│  │ Average Runtime: 18 hrs  │  │
│  └───────────────────────────┘  │
│                                 │
│  Consumption History            │
│  [Daily] [Weekly] [Monthly]      │
│  ┌───────────────────────────┐  │
│  │ [Bar Chart - Selected]    │  │
│  └───────────────────────────┘  │
│                                 │
│  [View Full Report →]           │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Appliance Header Card**: 
  - Icon, name, status
  - Device and port info
  - Type classification
  - Current and rated power
- **Today's Consumption Card**: 
  - Total kWh and cost
  - 24-hour line chart
- **Usage Statistics Card**: 
  - Average daily consumption
  - Weekly and monthly totals
  - Peak usage hours
  - Average runtime
- **Consumption History**: 
  - Tab selector (Daily/Weekly/Monthly)
  - Bar chart for selected period
  - View full report link

### Menu Options (⋮)
- Edit Appliance
- Delete Appliance
- Set Alert Rules
- View History
- Share Data

---

## SCREEN 11: ADD/EDIT APPLIANCE SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Cancel  Add Appliance  ✓ Save│
│                                 │
│  ┌───────────────────────────┐  │
│  │ Appliance Information      │  │
│  │                           │  │
│  │ Appliance Name *          │  │
│  │ [________________]        │  │
│  │                           │  │
│  │ Device *                  │  │
│  │ [Main Meter ▼]            │  │
│  │                           │  │
│  │ Port Number *             │  │
│  │ [1]                       │  │
│  │                           │  │
│  │ Appliance Type *          │  │
│  │ [Refrigerator ▼]          │  │
│  │                           │  │
│  │ Rated Power (Watts)       │  │
│  │ [200]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  Appliance Types:               │
│  • Light                        │
│  • Fan                          │
│  • Refrigerator                 │
│  • Air Conditioner              │
│  • Television                   │
│  • Other                        │
│                                 │
│  ┌───────────────────────────┐  │
│  │      SAVE APPLIANCE       │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Appliance Name Input**: Required
- **Device Selector**: Dropdown of user's devices
- **Port Number Input**: Required, numeric
- **Appliance Type Selector**: 
  - Dropdown with predefined types
  - Options: Light, Fan, Refrigerator, AC, TV, Other
- **Rated Power Input**: Optional, numeric
- **Save Button**: Submit appliance registration

### Validation
- All required fields must be filled
- Port number must be unique per device
- Port number must be valid (1-10 typically)

---

## SCREEN 12: REPORTS SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back         Reports          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Period Selection          │  │
│  │                           │  │
│  │ [Daily] [Weekly] [Monthly] │  │
│  │                           │  │
│  │ Date Range:               │  │
│  │ [Jan 1, 2024] to          │  │
│  │ [Jan 31, 2024]            │  │
│  │                           │  │
│  │ Device: [All Devices ▼]   │  │
│  │ Appliance: [All ▼]        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Summary                   │  │
│  │                           │  │
│  │ Total Consumption:        │  │
│  │ 150.5 kWh                │  │
│  │                           │  │
│  │ Total Cost:               │  │
│  │ ₱1,881.25                │  │
│  │                           │  │
│  │ Average Daily: 4.8 kWh   │  │
│  │ Peak Day: 8.2 kWh        │  │
│  └───────────────────────────┘  │
│                                 │
│  Consumption Chart              │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Bar/Line Chart]       │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Top Consuming Appliances       │
│  ┌───────────────────────────┐  │
│  │ 1. ❄️ AC       50.2 kWh   │  │
│  │ 2. 🧊 Refrigerator 40.1   │  │
│  │ 3. 📺 TV       25.3 kWh   │  │
│  │ 4. 💡 Lights   20.5 kWh   │  │
│  │ 5. 🌀 Fan     14.4 kWh   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   📄 EXPORT PDF REPORT    │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Period Selector**: 
  - Tabs: Daily, Weekly, Monthly
  - Date range picker
  - Device filter dropdown
  - Appliance filter dropdown
- **Summary Card**: 
  - Total consumption (kWh)
  - Total cost (PHP)
  - Average daily consumption
  - Peak consumption day
- **Consumption Chart**: 
  - Bar chart or line chart
  - Interactive (tap for details)
  - Shows consumption over selected period
- **Top Consuming Appliances**: 
  - Ranked list
  - Consumption per appliance
  - Percentage of total
- **Export PDF Button**: 
  - Generate and download PDF report

### Chart Types
- **Daily**: Line chart showing hourly consumption
- **Weekly**: Bar chart showing daily consumption
- **Monthly**: Bar chart showing weekly consumption

### User Interactions
- Change period → Update all data
- Change date range → Recalculate summary
- Filter by device/appliance → Update charts
- Tap chart → View detailed data point
- Export PDF → Generate and share report

---

## SCREEN 13: NOTIFICATIONS SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back    Notifications         │
│                                 │
│  [All] [Unread] [Alerts]        │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔴 High Power Consumption │  │
│  │                           │  │
│  │ Air Conditioner is        │  │
│  │ consuming more than        │  │
│  │ threshold (1500W)          │  │
│  │                           │  │
│  │ 10:30 AM • Today          │  │
│  │ [Mark as Read]            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚠️ Device Offline          │  │
│  │                           │  │
│  │ Unit 2 Meter has been      │  │
│  │ offline for 15 minutes    │  │
│  │                           │  │
│  │ 9:45 AM • Today           │  │
│  │ [Mark as Read]            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ℹ️ Weekly Report Ready    │  │
│  │                           │  │
│  │ Your weekly consumption   │  │
│  │ report is ready           │  │
│  │                           │  │
│  │ 8:00 AM • Today          │  │
│  │ ✓ Read                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📊 Monthly Summary        │  │
│  │                           │  │
│  │ January consumption:     │  │
│  │ 150.5 kWh • ₱1,881.25   │  │
│  │                           │  │
│  │ 12:00 AM • Jan 31        │  │
│  │ ✓ Read                   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Mark All as Read        │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Header**: 
  - Back button
  - Screen title
- **Filter Tabs**: 
  - All notifications
  - Unread only
  - Alerts only
- **Notification Cards**: 
  - Icon (type indicator)
  - Title (bold)
  - Message (description)
  - Timestamp
  - Read/Unread indicator
  - Action button (Mark as Read)
- **Mark All as Read Button**: 
  - Bulk action for all notifications

### Notification Types
- **Alert** (🔴): High consumption, threshold exceeded
- **Warning** (⚠️): Device offline, errors
- **Info** (ℹ️): Reports ready, system updates
- **Success** (✅): Successful operations

### User Interactions
- Tap notification → View details or navigate to related screen
- Swipe notification → Mark as read/Delete
- Mark All as Read → Bulk action
- Filter tabs → Filter notifications

---

## SCREEN 14: ALERT RULES SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back    Alert Rules    ➕ Add │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚠️ Power Threshold         │  │
│  │                           │  │
│  │ Appliance: Refrigerator    │  │
│  │ Condition: Power > 200W    │  │
│  │ Severity: High             │  │
│  │ Status: ✅ Active          │  │
│  │                           │  │
│  │ [Edit] [Delete]           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚠️ Consumption Limit       │  │
│  │                           │  │
│  │ Appliance: Air Conditioner │  │
│  │ Condition: Daily > 10 kWh │  │
│  │ Severity: Medium          │  │
│  │ Status: ✅ Active          │  │
│  │                           │  │
│  │ [Edit] [Delete]           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚠️ Device Offline          │  │
│  │                           │  │
│  │ Device: Unit 2 Meter      │  │
│  │ Condition: Offline > 10min│  │
│  │ Severity: Low              │  │
│  │ Status: ✅ Active          │  │
│  │                           │  │
│  │ [Edit] [Delete]           │  │
│  └───────────────────────────┘  │
│                                 │
│  [➕ Create New Alert Rule]       │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Header**: 
  - Back button
  - Screen title
  - Add button
- **Alert Rule Cards**: 
  - Alert type icon
  - Rule name/title
  - Target (appliance or device)
  - Condition (threshold and operator)
  - Severity level
  - Active/Inactive status
  - Edit and Delete buttons
- **Create Alert Rule Button**: 
  - Navigate to create alert screen

---

## SCREEN 15: CREATE/EDIT ALERT RULE SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Cancel  New Alert    ✓ Save  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Alert Configuration        │  │
│  │                           │  │
│  │ Alert Type *              │  │
│  │ [Power Threshold ▼]       │  │
│  │                           │  │
│  │ Target *                  │  │
│  │ [Appliance ▼]             │  │
│  │                           │  │
│  │ Appliance/Device *        │  │
│  │ [Refrigerator ▼]          │  │
│  │                           │  │
│  │ Condition *               │  │
│  │ [Power] [>] [200] [W]     │  │
│  │                           │  │
│  │ Severity *                │  │
│  │ [High ▼]                  │  │
│  │                           │  │
│  │ [ ] Active                │  │
│  └───────────────────────────┘  │
│                                 │
│  Alert Types:                   │
│  • Power Threshold              │
│  • Consumption Limit             │
│  • Device Offline                │
│                                 │
│  ┌───────────────────────────┐  │
│  │      SAVE ALERT RULE       │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Alert Type Selector**: 
  - Power Threshold
  - Consumption Limit
  - Device Offline
- **Target Selector**: 
  - Appliance or Device
- **Appliance/Device Selector**: 
  - Dropdown of available options
- **Condition Builder**: 
  - Metric selector (Power/Consumption)
  - Operator selector (>, <, >=, <=)
  - Value input
  - Unit display
- **Severity Selector**: 
  - Low, Medium, High, Critical
- **Active Toggle**: 
  - Enable/disable alert rule
- **Save Button**: 
  - Submit alert rule

---

## SCREEN 16: SETTINGS SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back         Settings         │
│                                 │
│  Account                         │
│  ┌───────────────────────────┐  │
│  │ 👤 Profile Settings        │  │
│  │    John Doe                │  │
│  │    john@example.com        │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔐 Change Password         │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  Notifications                  │
│  ┌───────────────────────────┐  │
│  │ 🔔 Push Notifications      │  │
│  │    [Toggle: ON]            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚠️ Alert Notifications     │  │
│  │    [Toggle: ON]            │  │
│  └───────────────────────────┘  │
│                                 │
│  Data & Privacy                 │
│  ┌───────────────────────────┐  │
│  │ 📊 Data Retention          │  │
│  │    Keep data for 90 days  │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔒 Privacy Settings        │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  App Settings                   │
│  ┌───────────────────────────┐  │
│  │ ⚙️ Units & Currency        │  │
│  │    kWh, PHP               │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔄 Update Frequency       │  │
│  │    Every 5 seconds         │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  About                          │
│  ┌───────────────────────────┐  │
│  │ ℹ️ About NILM              │  │
│  │    Version 1.0.0           │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📖 Help & Support          │  │
│  │    [→]                     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🚪 Logout                  │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Account Section**: 
  - Profile Settings (navigate to profile)
  - Change Password
- **Notifications Section**: 
  - Push Notifications toggle
  - Alert Notifications toggle
- **Data & Privacy Section**: 
  - Data Retention settings
  - Privacy Settings
- **App Settings Section**: 
  - Units & Currency
  - Update Frequency
- **About Section**: 
  - About NILM (version info)
  - Help & Support
- **Logout Button**: 
  - Sign out from account

---

## SCREEN 17: PROFILE SCREEN

### Layout
```
┌─────────────────────────────────┐
│  ← Back         Profile          │
│                                 │
│         [Profile Picture]       │
│         👤                      │
│         [Change Photo]          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Personal Information       │  │
│  │                           │  │
│  │ Full Name                 │  │
│  │ [John Doe        ✏️]      │  │
│  │                           │  │
│  │ Email                     │  │
│  │ [john@example.com  ✏️]    │  │
│  │                           │  │
│  │ Phone Number              │  │
│  │ [+63 912 345 6789  ✏️]    │  │
│  │                           │  │
│  │ Role                      │  │
│  │ [Tenant] (Cannot change)  │  │
│  └───────────────────────────┘  │
│                                 │
│  Account Statistics             │
│  ┌───────────────────────────┐  │
│  │ Devices: 2                 │  │
│  │ Appliances: 8             │  │
│  │ Member Since: Jan 2024    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      SAVE CHANGES         │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Profile Picture**: 
  - Avatar or photo
  - Change photo button
- **Personal Information**: 
  - Editable fields with edit icons
  - Full Name
  - Email (may require verification)
  - Phone Number
  - Role (read-only)
- **Account Statistics**: 
  - Number of devices
  - Number of appliances
  - Member since date
- **Save Button**: 
  - Save profile changes

---

## SCREEN 18: LANDLORD DASHBOARD (For Landlords)

### Layout
```
┌─────────────────────────────────┐
│  ☰ Menu    🔔(5)    👤 Profile  │
│                                 │
│  Property Overview               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Total Building Consumption │  │
│  │                           │  │
│  │      5,250 W              │  │
│  │      ⚡ Active            │  │
│  │                           │  │
│  │ Today: 42.5 kWh           │  │
│  │ Cost: ₱531.25             │  │
│  └───────────────────────────┘  │
│                                 │
│  Units Overview                 │
│  ┌───────────────────────────┐  │
│  │ Unit 1: 1,250 W  🟢        │  │
│  │ Unit 2: 1,500 W  🟢        │  │
│  │ Unit 3: 2,500 W  🟢        │  │
│  │ Unit 4: 0 W      🔴        │  │
│  └───────────────────────────┘  │
│                                 │
│  Consumption by Unit            │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Bar Chart]            │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Top Consuming Units            │
│  ┌───────────────────────────┐  │
│  │ 1. Unit 3    15.2 kWh      │  │
│  │ 2. Unit 2    12.5 kWh      │  │
│  │ 3. Unit 1    10.8 kWh      │  │
│  └───────────────────────────┘  │
│                                 │
│  [View All Units →]             │
│  [Generate Report →]            │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Total Building Consumption Card**: 
  - Aggregate power for all units
  - Total consumption and cost
- **Units Overview**: 
  - List of all units
  - Current power per unit
  - Status indicator
- **Consumption by Unit Chart**: 
  - Bar chart comparing units
- **Top Consuming Units**: 
  - Ranked list
- **Action Buttons**: 
  - View All Units
  - Generate Report

---

## SCREEN 19: UNIT DETAILS (Landlord View)

### Layout
```
┌─────────────────────────────────┐
│  ← Back         Unit 1           │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Unit 1                     │  │
│  │                           │  │
│  │ Status: 🟢 Online         │  │
│  │ Tenant: John Doe          │  │
│  │ Device: Main Meter        │  │
│  │                           │  │
│  │ Current: 1,250 W          │  │
│  │ Today: 5.2 kWh           │  │
│  │ Cost: ₱65.00             │  │
│  └───────────────────────────┘  │
│                                 │
│  Consumption History            │
│  [Daily] [Weekly] [Monthly]     │
│  ┌───────────────────────────┐  │
│  │ [Chart]                    │  │
│  └───────────────────────────┘  │
│                                 │
│  Appliances in Unit             │
│  ┌───────────────────────────┐  │
│  │ 🧊 Refrigerator   150 W   │  │
│  │ ❄️ AC           1000 W   │  │
│  │ 📺 TV             80 W    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   📄 GENERATE BILL        │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Unit Header Card**: 
  - Unit identifier
  - Status
  - Tenant name
  - Device information
  - Current consumption
- **Consumption History**: 
  - Tabs for different periods
  - Chart visualization
- **Appliances List**: 
  - All appliances in unit
  - Current power consumption
- **Generate Bill Button**: 
  - Create billing statement

---

## SCREEN 20: CHART DETAIL VIEW

### Layout
```
┌─────────────────────────────────┐
│  ← Back    Consumption Chart    │
│                                 │
│  [Daily] [Weekly] [Monthly]      │
│  Period: Jan 1-31, 2024         │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │                           │  │
│  │    [Interactive Chart]   │  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Statistics                     │
│  ┌───────────────────────────┐  │
│  │ Total: 150.5 kWh          │  │
│  │ Average: 4.8 kWh/day       │  │
│  │ Peak: 8.2 kWh (Jan 15)    │  │
│  │ Lowest: 2.1 kWh (Jan 3)   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   📊 EXPORT CHART         │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Components
- **Period Tabs**: 
  - Switch between Daily/Weekly/Monthly
- **Date Range Display**: 
  - Selected period
- **Interactive Chart**: 
  - Large, detailed chart
  - Tap data points for details
  - Pinch to zoom
  - Swipe to navigate
- **Statistics Card**: 
  - Total consumption
  - Average consumption
  - Peak consumption
  - Lowest consumption
- **Export Button**: 
  - Export chart as image

---

## UI COMPONENTS SPECIFICATION

### Color Scheme

**Primary Colors**:
- Primary: #2196F3 (Blue)
- Primary Dark: #1976D2
- Primary Light: #BBDEFB

**Accent Colors**:
- Success: #4CAF50 (Green)
- Warning: #FF9800 (Orange)
- Error: #F44336 (Red)
- Info: #2196F3 (Blue)

**Status Colors**:
- Online: #4CAF50 (Green)
- Offline: #F44336 (Red)
- Error: #FF9800 (Orange)

**Background Colors**:
- Background: #F5F5F5 (Light Gray)
- Surface: #FFFFFF (White)
- Card: #FFFFFF (White)

**Text Colors**:
- Primary Text: #212121 (Dark Gray)
- Secondary Text: #757575 (Medium Gray)
- Disabled Text: #BDBDBD (Light Gray)

---

### Typography

**Headings**:
- H1: 24px, Bold
- H2: 20px, Bold
- H3: 18px, Semi-bold
- H4: 16px, Semi-bold

**Body Text**:
- Large: 16px, Regular
- Medium: 14px, Regular
- Small: 12px, Regular
- Tiny: 10px, Regular

**Special**:
- Power Display: 32px, Bold
- Statistics: 18px, Semi-bold
- Labels: 12px, Medium

---

### Component Specifications

#### Buttons

**Primary Button**:
- Background: Primary color
- Text: White
- Height: 48px
- Border Radius: 8px
- Padding: 12px 24px

**Secondary Button**:
- Background: Transparent
- Border: 1px solid primary color
- Text: Primary color
- Height: 48px

**Icon Button**:
- Size: 40x40px
- Circular or square
- Icon only, no text

#### Cards

**Standard Card**:
- Background: White
- Border Radius: 12px
- Shadow: Elevation 2
- Padding: 16px
- Margin: 8px

**Status Card**:
- Colored border (left side)
- Status indicator icon
- Highlighted background for active states

#### Input Fields

**Text Input**:
- Height: 48px
- Border: 1px solid #E0E0E0
- Border Radius: 8px
- Padding: 12px 16px
- Focus: Border color changes to primary

**Dropdown/Selector**:
- Same as text input
- Dropdown arrow icon
- Modal or bottom sheet for selection

#### Lists

**List Item**:
- Height: 64px (minimum)
- Padding: 16px
- Divider between items
- Tap feedback (ripple effect)

#### Charts

**Line Chart**:
- Line color: Primary
- Fill color: Primary with opacity
- Grid lines: Light gray
- Data points: Interactive

**Bar Chart**:
- Bar color: Primary gradient
- Spacing between bars
- Value labels on top

---

## NAVIGATION FLOW

### Main Navigation (Bottom Tabs)

```
Dashboard ← → Devices ← → Reports ← → Notifications ← → Profile
```

### Authentication Flow

```
Splash → Login → Dashboard
       ↓
    Register → Dashboard
       ↓
    Forgot Password → Reset → Login
```

### Dashboard Flow

```
Dashboard → Device Details → Appliance Details
         → Reports → Chart Detail
         → Notifications → Notification Detail
```

### Settings Flow

```
Profile → Settings → Profile Edit
                  → Change Password
                  → Privacy Settings
                  → Units & Currency
                  → Help & Support
```

---

## USER INTERACTIONS

### Gestures

1. **Tap**: Primary interaction
   - Buttons, cards, list items
   - Navigate, select, activate

2. **Long Press**: Secondary action
   - Context menu
   - Quick actions

3. **Swipe**: Quick actions
   - Swipe left: Delete/Archive
   - Swipe right: Favorite/Mark read

4. **Pull to Refresh**: Data update
   - Dashboard, lists, charts
   - Show loading indicator

5. **Pinch to Zoom**: Chart interaction
   - Zoom in/out on charts
   - Pan when zoomed

### Loading States

**Skeleton Screens**:
- Show placeholder while loading
- Maintain layout structure

**Loading Indicators**:
- Spinner for short operations
- Progress bar for long operations
- Shimmer effect for content loading

**Empty States**:
- Friendly message
- Illustration or icon
- Action button if applicable

**Error States**:
- Error message
- Retry button
- Contact support option

---

## RESPONSIVE DESIGN

### Screen Sizes

**Small (320-480px)**:
- Single column layout
- Stacked cards
- Compact spacing

**Medium (481-768px)**:
- Two column where appropriate
- Larger cards
- More spacing

**Large (769px+)**:
- Multi-column layouts
- Side-by-side content
- Maximum content width

### Orientation

**Portrait** (Primary):
- Vertical scrolling
- Full-width cards
- Bottom navigation

**Landscape**:
- Optimized layouts
- Side-by-side charts
- Adjusted navigation

---

## ACCESSIBILITY

### Features

1. **Text Scaling**: Support system font size
2. **Color Contrast**: WCAG AA compliant
3. **Touch Targets**: Minimum 44x44px
4. **Screen Reader**: Proper labels
5. **Keyboard Navigation**: Full keyboard support
6. **High Contrast Mode**: Support system settings

---

## ANIMATIONS

### Transitions

1. **Screen Transitions**: Slide or fade
2. **Card Animations**: Fade in, slide up
3. **Loading Animations**: Smooth spinners
4. **Data Updates**: Smooth number transitions
5. **Chart Animations**: Animated drawing

### Micro-interactions

1. **Button Press**: Scale down effect
2. **Card Tap**: Elevation change
3. **Toggle Switch**: Smooth slide
4. **Refresh**: Pull animation
5. **Success**: Checkmark animation

---

## DATA VISUALIZATION

### Chart Types

1. **Line Chart**: Time-series data
   - Hourly consumption
   - Daily trends
   - Real-time updates

2. **Bar Chart**: Comparative data
   - Daily consumption
   - Appliance comparison
   - Unit comparison

3. **Pie Chart**: Proportional data
   - Appliance consumption share
   - Cost breakdown

4. **Area Chart**: Cumulative data
   - Total consumption over time
   - Energy accumulation

### Chart Features

- Interactive tooltips
- Zoom and pan
- Data point selection
- Export functionality
- Multiple series support

---

## NOTIFICATION SYSTEM

### Notification Types

1. **Push Notifications**:
   - High consumption alerts
   - Device offline
   - Report ready
   - System updates

2. **In-App Notifications**:
   - Notification center
   - Badge counts
   - Toast messages

3. **Alert Styles**:
   - Banner (top)
   - Modal (center)
   - Toast (bottom)

---

## OFFLINE FUNCTIONALITY

### Offline Features

1. **Cached Data**: 
   - Last known readings
   - Historical data (limited)
   - User preferences

2. **Offline Indicators**:
   - Connection status icon
   - "Offline" badge
   - Sync status

3. **Sync Behavior**:
   - Auto-sync when online
   - Manual refresh option
   - Conflict resolution

---

## SECURITY FEATURES

### UI Security Indicators

1. **Authentication**:
   - Secure login screen
   - Session timeout warning
   - Biometric authentication option

2. **Data Privacy**:
   - Privacy settings visible
   - Data encryption indicators
   - Secure connection indicators (HTTPS)

3. **Access Control**:
   - Role-based UI elements
   - Hidden features for unauthorized users
   - Clear permission indicators

---

## PERFORMANCE OPTIMIZATIONS

### UI Performance

1. **Lazy Loading**: 
   - Load images on demand
   - Virtualize long lists
   - Defer heavy computations

2. **Caching**:
   - Cache chart data
   - Cache images
   - Cache user preferences

3. **Optimization**:
   - Minimize re-renders
   - Use FlatList for long lists
   - Optimize chart rendering

---

## IMPLEMENTATION NOTES

### React Native Components

**Navigation**:
- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/stack`

**UI Components**:
- `react-native-paper` (Material Design)
- Custom components as needed

**Charts**:
- `react-native-chart-kit` or `victory-native`
- Custom chart components

**Forms**:
- `react-hook-form` for form management
- Custom input components

**State Management**:
- React Context API or Redux
- Firebase real-time listeners

---

## SCREEN SUMMARY

**Total Screens**: 20+

1. Splash Screen
2. Login Screen
3. Registration Screen
4. Forgot Password Screen
5. Main Dashboard
6. Devices Screen
7. Device Details Screen
8. Add/Edit Device Screen
9. Appliances Screen
10. Appliance Details Screen
11. Add/Edit Appliance Screen
12. Reports Screen
13. Notifications Screen
14. Alert Rules Screen
15. Create/Edit Alert Rule Screen
16. Settings Screen
17. Profile Screen
18. Landlord Dashboard
19. Unit Details (Landlord View)
20. Chart Detail View

**Additional Screens** (if needed):
- Help & Support
- About Screen
- Privacy Settings
- Change Password
- Terms & Conditions

---

**Note**: This is a comprehensive UI specification. Use this as a reference for:
- UI/UX design phase
- Development implementation
- Thesis documentation
- Presentation to advisers

Customize colors, spacing, and components based on your design preferences and brand guidelines.

