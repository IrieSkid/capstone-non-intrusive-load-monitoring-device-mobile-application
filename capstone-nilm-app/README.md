# 📱 NILM Mobile Application

**Non-Intrusive Load Monitoring System** - Real-time energy consumption monitoring with appliance-level tracking.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🎯 Overview

A mobile application for monitoring and analyzing household energy consumption in real-time. Features include:

- 📊 **Real-Time Dashboard** - Live power monitoring with appliance control
- 📈 **Comprehensive Reports** - Daily, weekly, and monthly analytics
- 🔔 **Smart Alerts** - Configurable notifications for power thresholds
- 🏠 **Device Management** - Multi-device support with IoT integration
- ⚡ **Appliance Tracking** - Per-appliance consumption and cost analysis
- 💾 **Cloud Database** - All data synced with Firebase Firestore

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on device
npx expo start --android  # Android
npx expo start --ios      # iOS
```

**First time?** See [Setup Guide](./docs/SETUP-GUIDE.md) for complete instructions.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**Setup Guide**](./docs/SETUP-GUIDE.md) | Installation and configuration |
| [**Current Features**](./docs/CURRENT-FEATURES.md) | Complete feature list and usage |
| [**Development History**](./docs/DEVELOPMENT-HISTORY.md) | Project timeline and milestones |
| [**Firebase Setup**](./docs/FIREBASE-SETUP.md) | Firebase configuration guide |
| [**Firestore Indexes**](./docs/FIRESTORE-INDEXES.md) | Required database indexes |

---

## ✨ Key Features

### Real-Time Monitoring
- Live power consumption updates every 3 seconds
- Interactive appliance control with ON/OFF toggles
- Voltage, current, power factor, and frequency tracking
- Cumulative energy consumption (kWh)

### Appliance Management
- Add unlimited appliances per device
- Configure name, category, rated power, icon, and port number
- Track usage time and last detected timestamp
- View real-time power consumption per appliance

### Reports & Analytics
- **Daily Reports**: Hourly breakdown with 24-hour data
- **Weekly Reports**: Daily aggregates for last 7 days
- **Monthly Reports**: Full month analysis with projections
- **Cost Analysis**: Time-of-day breakdown (morning/afternoon/evening/night)
- **Appliance Breakdown**: Per-appliance consumption, costs, and runtime
- Export to CSV or copy to clipboard

### Smart Alerts
- Configurable alert rules (Power Threshold, Consumption Limit, Budget, etc.)
- Automatic notification triggering
- Priority levels (High/Medium/Low)
- 1-hour cooldown to prevent spam

### Device Management
- 4-step device registration wizard
- Multiple device support per user
- Device status monitoring (online/offline)
- Connection testing and diagnostics

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **UI**: Custom components with theme support
- **Charts**: Custom React Native visualizations

---

## 📁 Project Structure

```
capstone-nilm-app/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   └── *.tsx              # Modal screens
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard widgets
│   ├── reports/           # Report charts
│   └── ui/               # UI primitives
├── services/             # Business logic layer
│   ├── authService.ts
│   ├── deviceService.ts
│   ├── firestoreApplianceService.ts
│   ├── readingService.ts
│   ├── reportService.ts
│   └── realtimeDataService.ts
├── contexts/             # React Context providers
├── types/                # TypeScript interfaces
├── config/               # Firebase configuration
├── docs/                 # Documentation
└── utils/                # Helper functions
```

---

## 🔥 Firebase Collections

The app uses 8 Firestore collections:

1. **users** - User profiles and preferences
2. **devices** - IoT device registrations
3. **appliances** - Appliance configurations
4. **realTimeReadings** - Power readings with per-appliance data
5. **consumptionSummaries** - Aggregated consumption data
6. **notifications** - User notifications
7. **alertRules** - Alert configurations
8. **electricityRates** - Electricity rate plans

All collections are auto-created on first use!

---

## 📊 Data Flow

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

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Clear cache
npx expo start --clear
```

See [Setup Guide](./docs/SETUP-GUIDE.md#testing-the-app) for detailed testing instructions.

---

## 🔐 Security

- Firebase Authentication with email/password
- Firestore security rules for user data isolation
- Protected routes with auth guards
- Secure credential storage
- Input validation on all forms

---

## 📱 Screenshots

| Dashboard | Reports | Appliances | Alerts |
|-----------|---------|------------|--------|
| Real-time monitoring | Analytics & charts | Device management | Smart notifications |

---

## 🚀 Deployment

### Android APK
```bash
eas build --platform android --profile preview
```

### iOS IPA
```bash
eas build --platform ios --profile preview
```

See [Expo EAS Build](https://docs.expo.dev/build/introduction/) for details.

---

## 🤝 Contributing

This is a capstone project for academic purposes. For questions or suggestions, please contact the development team.

---

## 📄 License

This project is developed as part of a capstone thesis for educational purposes.

---

## 👥 Development Team

**Capstone Project** - Non-Intrusive Load Monitoring System  
**Institution**: [Your University]  
**Year**: 2025-2026

---

## 📞 Support

- 📖 **Documentation**: [docs/](./docs/)
- 🐛 **Issues**: Check Firebase Console logs
- 💬 **Questions**: Review [Setup Guide](./docs/SETUP-GUIDE.md)

---

## 🎓 Academic Context

This application is part of a capstone thesis on Non-Intrusive Load Monitoring (NILM) systems. The goal is to provide households with detailed insights into their energy consumption patterns to promote energy conservation and cost savings.

**Key Research Areas:**
- Real-time energy monitoring
- Appliance-level disaggregation
- User behavior analysis
- Cost optimization strategies

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
