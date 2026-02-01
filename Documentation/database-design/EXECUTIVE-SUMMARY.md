# NILM System - Executive Summary for Initial Paper Submission

## Project Overview
**System Name:** Non-Intrusive Load Monitoring (NILM) System for Residential Appliances  
**Platform:** Mobile Application (React Native + Expo Go)  
**Collaboration:** BSIT (Software) + Electrical Engineering (Hardware)

---

## Database Design Summary

### Design Philosophy
The database design follows a **streamlined, robust approach** suitable for a capstone project. It balances completeness with simplicity, ensuring all core requirements are met without unnecessary complexity.

### Key Statistics
- **Total Tables:** 11 core tables (including audit_logs)
- **Design Approach:** Normalized (3NF)
- **Optimization:** Strategic indexes for time-series data
- **Scalability:** Supports multiple users, devices, and appliances
- **Database Options:** SQL (PostgreSQL/MySQL) or NoSQL (Firestore)

---

## Core Database Entities

### 1. User Management (2 tables)
- **users** - User accounts, authentication, roles
- **user_sessions** - Session management for mobile app

### 2. Device Management (2 tables)
- **devices** - IoT device registration and status
- **appliances** - Appliance configuration per device

### 3. Data Collection (1 table)
- **real_time_readings** - Time-series electrical measurements
  - Voltage RMS, Current RMS, Power (W), Apparent Power (VA), Power Factor, Energy (kWh)

### 4. Consumption & Billing (2 tables)
- **consumption_summaries** - Aggregated consumption data (daily/weekly/monthly)
- **electricity_rates** - Billing rates for cost calculation

### 5. Notifications & Alerts (2 tables)
- **notifications** - User notifications and alerts
- **alert_rules** - Configurable alert thresholds

### 6. Audit & Logging (1 table)
- **audit_logs** - User action tracking and system audit trail

### 7. System Configuration (1 table)
- **system_settings** - System-wide configuration

---

## Key Features

✅ **Real-Time Monitoring** - Optimized for high-frequency data insertion  
✅ **Historical Tracking** - Time-series data with efficient querying  
✅ **Multi-Level Aggregation** - Appliance, device, and user-level summaries  
✅ **Flexible Billing** - Configurable electricity rates  
✅ **Alert System** - Configurable thresholds with notifications  
✅ **Scalable Design** - Supports growth in users and devices  

---

## Design Improvements Made

### Removed Unnecessary Complexity
- ❌ Removed `tbl_flow_steps` - Not relevant to NILM
- ❌ Removed `tbl_notification_reads` - Simplified to single table
- ✅ **Kept `audit_logs`** - Required for capstone project
- ❌ Removed `tbl_login_attempts` - Can be handled in application
- ❌ Removed `tbl_device_sync_logs` - Using timestamp field instead
- ❌ Simplified `tbl_roles` - Using enum instead of separate table

### Result
- **27% reduction** in table count (15 → 11 tables)
- **Simpler queries** with fewer joins
- **Better performance** with strategic indexes
- **Easier implementation** for capstone project
- **Meets all requirements** including audit logging

---

## System Architecture

```
Hardware (Sensors) 
    ↓
Microcontroller (ESP32/Arduino)
    ↓
WiFi/Internet
    ↓
Backend API (Node.js/Express)
    ↓
Database (PostgreSQL/MySQL)
    ↓
Mobile App (React Native + Expo)
```

---

## Technology Stack Recommendations

### Mobile App
- **Framework:** React Native + Expo Go
- **Navigation:** React Navigation
- **Charts:** react-native-chart-kit or victory-native
- **State Management:** Redux or Context API

### Database Options

#### Option 1: Firebase Firestore (Recommended) ⭐
- **Why:** Perfect for real-time IoT monitoring
- **Features:** Built-in real-time listeners, offline support, easy integration
- **Free Tier:** 50K reads, 20K writes/day, 1GB storage
- **Setup:** See `schema-firestore.md` for complete guide

#### Option 2: SQL Database (PostgreSQL/MySQL)
- **Why:** Traditional relational database
- **Features:** Complex queries, ACID transactions, time-series optimization
- **Hosting:** Supabase, PlanetScale, Railway (all have free tiers)

### Backend API

#### With Firestore:
- **Framework:** Firebase Cloud Functions (serverless)
- **Authentication:** Firebase Authentication
- **Real-Time:** Firestore real-time listeners (built-in)

#### With SQL:
- **Framework:** Node.js + Express or Python + FastAPI
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time:** WebSockets (Socket.io) or MQTT

### Cloud Services (Free Tier Options)
- **Firebase:** Firestore, Cloud Functions, Authentication (all free tier)
- **SQL Hosting:** Railway, Render, Vercel
- **SQL Database:** Supabase (PostgreSQL), PlanetScale (MySQL)

---

## Data Flow

1. **Device Registration:** User registers IoT device → `devices` table
2. **Appliance Setup:** User configures appliances → `appliances` table
3. **Data Collection:** Hardware sends readings → `real_time_readings` table
4. **Consumption Calculation:** System aggregates data → `consumption_summaries` table
5. **Billing:** System calculates cost using rates → Display in mobile app
6. **Alerts:** System checks thresholds → Creates `notifications` if exceeded

---

## Database Schema Highlights

### Normalization
- All tables properly normalized to 3NF
- No data redundancy
- Proper foreign key relationships

### Performance Optimization
- **Indexes on time-series data** for fast queries
- **Composite indexes** for common query patterns
- **Unique constraints** to prevent duplicate data

### Data Integrity
- **Foreign key constraints** with CASCADE deletes
- **Check constraints** for enum values
- **NOT NULL constraints** for required fields

---

## API Endpoints Overview

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Device Management
- `GET /devices` - List user devices
- `POST /devices` - Register new device
- `GET /devices/:id` - Get device details

### Real-Time Data
- `POST /devices/:id/readings` - Submit readings (IoT device)
- `GET /devices/:id/readings/realtime` - Get latest readings
- `GET /devices/:id/readings/history` - Get historical data

### Consumption & Reports
- `GET /consumption/summary` - Get consumption summary
- `GET /consumption/chart` - Get chart data

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read

### Alerts
- `GET /alert-rules` - Get alert rules
- `POST /alert-rules` - Create alert rule

---

## Implementation Phases

### Phase 1: Core Setup
1. Set up database (PostgreSQL/MySQL)
2. Create tables using provided schema
3. Set up backend API (Node.js/Express)
4. Implement authentication endpoints

### Phase 2: Device Integration
1. Implement device registration
2. Implement appliance management
3. Create IoT data submission endpoint
4. Test with hardware device

### Phase 3: Mobile App Development
1. Set up React Native + Expo project
2. Implement authentication screens
3. Create dashboard for real-time monitoring
4. Implement device management screens

### Phase 4: Data Visualization
1. Implement consumption reports
2. Add charts and graphs
3. Implement historical data viewing
4. Add export functionality

### Phase 5: Advanced Features
1. Implement alert system
2. Add notifications
3. Implement billing calculations
4. Add user settings

---

## Expected Outcomes

### Functional Requirements Met
✅ Real-time load monitoring  
✅ Appliance identification (ON/OFF status)  
✅ Voltage, Current, Power, Apparent Power, Power Factor display  
✅ Historical consumption tracking  
✅ Weekly and monthly reports  
✅ Estimated monthly bills  

### Non-Functional Requirements
✅ Scalable database design  
✅ Efficient query performance  
✅ Secure authentication  
✅ Mobile-responsive interface  
✅ Real-time data updates  

---

## Documentation Provided

1. **ERD.md** - Complete Entity Relationship Diagram with Mermaid notation
2. **system-flowchart.md** - System flowcharts and data flow diagrams
3. **schema.sql** - Ready-to-use MySQL database schema
4. **schema-postgresql.sql** - Ready-to-use PostgreSQL database schema
5. **schema-firestore.md** - Complete Firestore schema and implementation guide ⭐
6. **API-endpoints-reference.md** - Complete API documentation
7. **tech-stack-recommendations.md** - Technology recommendations (updated with Firestore)
8. **IMPROVEMENTS.md** - Detailed explanation of design improvements

---

## Academic Suitability

This database design is:
- ✅ **Appropriate for Capstone Project** - Not over-engineered
- ✅ **Professional** - Follows database design best practices
- ✅ **Complete** - Covers all required functionality
- ✅ **Well-Documented** - Suitable for thesis submission
- ✅ **Implementable** - Realistic scope for BSIT capstone

---

## Next Steps

1. **Review with Academic Adviser** - Present ERD and flowcharts
2. **Get Approval** - Confirm design meets requirements
3. **Set Up Development Environment** - Install required tools
4. **Create Database** - Use provided SQL schema
5. **Begin Backend Development** - Start with authentication
6. **Begin Mobile App Development** - Start with basic screens

---

## Contact & Support

For questions or modifications to the database design:
- Review the detailed documentation in each file
- Check `IMPROVEMENTS.md` for design rationale
- Refer to `API-endpoints-reference.md` for implementation details

---

**Prepared for:** BSIT Capstone Project - Initial Paper Submission  
**Date:** 2024  
**Status:** Ready for Academic Review

