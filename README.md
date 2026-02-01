# NILM System - Non-Intrusive Load Monitoring for Residential Appliances

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-49.0-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive IoT-based energy monitoring system that enables real-time classification and tracking of residential appliance consumption. The system features a mobile application built with React Native and Expo, providing users with detailed energy analytics, consumption reports, and intelligent alerting.

## 🎓 Project Information

- **Project Type**: BSIT Capstone/Thesis Project
- **Collaboration**: Software Development (BSIT) + Hardware Development (Electrical Engineering)
- **Academic Year**: 2024

## ✨ Features

- 🔌 **Real-Time Monitoring** - Live electrical parameter tracking (Voltage, Current, Power, Power Factor)
- 📱 **Mobile Application** - Cross-platform React Native app with Expo Go
- 📊 **Consumption Analytics** - Daily, weekly, and monthly consumption reports with charts
- 🏠 **Appliance Classification** - Automatic identification of appliances (Refrigerator, AC, TV, Lights, etc.)
- 💰 **Cost Calculation** - Real-time electricity cost estimation based on consumption
- 🔔 **Smart Alerts** - Configurable thresholds for power consumption and device status
- 📈 **Historical Data** - Time-series data storage and visualization
- 👥 **Multi-User Support** - Support for tenants, landlords, and administrators
- 🔐 **Secure Authentication** - Firebase Authentication with session management
- 📝 **Audit Logging** - Complete audit trail for all user actions

## 🛠️ Technology Stack

### Frontend
- **React Native** - Mobile app framework
- **Expo Go** - Development and testing platform
- **React Navigation** - Navigation library
- **React Native Chart Kit** - Data visualization

### Backend
- **Firebase Cloud Functions** - Serverless backend API
- **Firebase Firestore** - NoSQL real-time database
- **Firebase Authentication** - User authentication
- **Cloudinary** - File storage

### Hardware Integration
- **Microcontroller**: ESP32/ESP8266/Arduino
- **Communication**: HTTP REST API
- **Sensors**: Voltage and Current sensors for NILM

## 📁 Project Structure

```
NILM-Planning/
├── Documentation/
│   ├── database-design/          # Database schema, ERD, and documentation
│   ├── thesis-documentation/      # Thesis chapters and research documentation
│   └── mobile-app-prototype/      # HTML/CSS prototype mockups
└── README.md                      # This file
```

## 📚 Documentation

### Database Design
- **[Database Design README](Documentation/database-design/README.md)** - Complete database documentation
- **[ERD](Documentation/database-design/ERD.md)** - Entity Relationship Diagram
- **[Database Schemas](Documentation/database-design/)** - MySQL, PostgreSQL, and Firestore schemas
- **[API Documentation](Documentation/database-design/API-endpoints-reference.md)** - REST API endpoints
- **[IoT Integration Guide](Documentation/database-design/IOT-COMMUNICATION-GUIDE.md)** - Hardware integration guide

### Thesis Documentation
- **[Chapter 1](Documentation/thesis-documentation/CHAPTER-1-IMPROVED.md)** - Problem and Introduction
- **[Chapter 2](Documentation/thesis-documentation/CHAPTER-2-LITERATURE-REVIEW.md)** - Literature Review
- **[Chapter 3](Documentation/thesis-documentation/CHAPTER-3-RESEARCH-DESIGN.md)** - Research Design and Methodology
- **[Chapter 4](Documentation/thesis-documentation/CHAPTER-4-ANALYSIS-FRAMEWORK.md)** - Analysis Framework
- **[Survey Questionnaires](Documentation/thesis-documentation/SURVEY-QUESTIONNAIRES.md)** - Research instruments
- **[Thesis Structure Guide](Documentation/thesis-documentation/THESIS-STRUCTURE-GUIDE.md)** - Complete thesis guide

### Mobile App
- **[UI Specification](Documentation/thesis-documentation/MOBILE-APP-UI-SPECIFICATION.md)** - Complete UI/UX specification
- **[Prototype](Documentation/mobile-app-prototype/)** - HTML/CSS prototype mockups

## 🗄️ Database Design

- **11 Core Tables** - Normalized database design (3NF)
- **Real-Time Data** - Optimized for time-series IoT data
- **Scalable Architecture** - Supports multiple users and devices
- **Complete ERD** - Entity Relationship Diagram included

See [Documentation/database-design/](Documentation/database-design/) for complete database documentation.

## 📱 Mobile App Features

- **Dashboard** - Real-time power consumption overview
- **Device Management** - Register and monitor IoT devices
- **Appliance Tracking** - View and manage appliances
- **Reports & Analytics** - Consumption charts and summaries
- **Notifications** - Alert system for threshold violations
- **Settings** - User preferences and configuration

See [Documentation/mobile-app-prototype/](Documentation/mobile-app-prototype/) for UI mockups.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Firebase account
- React Native development environment

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nilm-system.git

# Navigate to project directory
cd nilm-system

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

## 📖 Quick Links

### For Developers
- [Database Design Documentation](Documentation/database-design/README.md)
- [API Endpoints Reference](Documentation/database-design/API-endpoints-reference.md)
- [IoT Communication Guide](Documentation/database-design/IOT-COMMUNICATION-GUIDE.md)
- [Tech Stack Recommendations](Documentation/database-design/tech-stack-recommendations.md)

### For Researchers
- [Thesis Documentation](Documentation/thesis-documentation/)
- [Survey Questionnaires](Documentation/thesis-documentation/SURVEY-QUESTIONNAIRES.md)
- [Accuracy Testing Protocol](Documentation/thesis-documentation/ACCURACY-TESTING-PROTOCOL.md)

### For Designers
- [Mobile App UI Specification](Documentation/thesis-documentation/MOBILE-APP-UI-SPECIFICATION.md)
- [Prototype Mockups](Documentation/mobile-app-prototype/)

## 🎯 Project Goals

1. **Real-Time Monitoring** - Provide accurate real-time energy consumption data
2. **Appliance Classification** - Automatically identify and classify appliances
3. **User-Friendly Interface** - Intuitive mobile app for energy management
4. **Cost Awareness** - Help users understand and reduce energy costs
5. **Scalable Solution** - Support multiple users and devices

## 📊 System Architecture

```
Hardware (Sensors) 
    ↓
Microcontroller (ESP32/Arduino)
    ↓
WiFi/Internet
    ↓
Backend API (Firebase Cloud Functions)
    ↓
Database (Firebase Firestore)
    ↓
Mobile App (React Native + Expo)
```

## 👥 Contributors

- **Software Team** - BSIT Students
- **Hardware Team** - Electrical Engineering Students

## 📄 License

This project is part of an academic capstone/thesis project. The system is designed for educational and research purposes.

## 📧 Contact

For questions or inquiries about this project, please contact the development team.

---

**Note**: This is an academic capstone/thesis project. The system is designed for educational and research purposes.

**Status**: 🚧 In Development  
**Last Updated**: 2024
