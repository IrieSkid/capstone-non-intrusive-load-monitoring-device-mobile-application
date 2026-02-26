# Firebase to MySQL Migration Guide

This document outlines the migration from Firebase/Firestore to MySQL database.

## Changes Made

### 1. Database Configuration
- **Removed**: `config/firebase.ts` and `config/firebase.server.ts`
- **Added**: `config/database.ts` and `config/database.server.ts`
  - Uses `mysql2` package for MySQL connections
  - Connection pool configuration for efficient database access

### 2. Authentication
- **Removed**: Firebase Authentication
- **Added**: JWT-based authentication with MySQL
  - Password hashing using `bcryptjs`
  - JWT tokens stored in AsyncStorage
  - User data stored in `tblusers` table

### 3. Services Converted
All services have been converted from Firestore to MySQL:

- ✅ `auth.service.ts` - MySQL-based authentication
- ✅ `deviceService.ts` - Uses `tbldevices` table
- ✅ `applianceService.ts` - Uses `tblappliance_types` and related tables
- ✅ `readingService.ts` - Uses `tblreading_headers` and `tblreading_details`
- ✅ `electricityRateService.ts` - Uses `tblrooms.room_rate_per_kwh` and `tblsystem_settings`
- ✅ `alertService.ts` - Uses `tblalerts` table
- ✅ `reportService.ts` - Updated to use MySQL reading service
- ✅ `realtimeDataService.ts` - Updated to use MySQL appliance service

### 4. Package Dependencies
**Removed:**
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`
- `firebase`

**Added:**
- `mysql2` - MySQL database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

### 5. Context Updates
- `AuthContext.tsx` - Updated to use MySQL authentication with JWT tokens

## Database Schema

The migration uses the MySQL schema defined in `capstone-nilm-app-prototype-db.sql`. Key tables:

- `tblusers` - User accounts
- `tblroles` - User roles (admin, landlord, tenant)
- `tbluser_status` - User status (active, inactive, suspended)
- `tbldevices` - IoT devices
- `tblrooms` - Rooms linked to devices and tenants
- `tblappliance_types` - Appliance type definitions
- `tblappliance_categories` - Appliance categories
- `tblreading_headers` - Reading session headers
- `tblreading_details` - Individual sensor readings
- `tblappliance_detection_headers` - Appliance detection sessions
- `tblappliance_detection_details` - Appliance detection results
- `tblalerts` - System alerts
- `tblsystem_settings` - System configuration

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Import the SQL schema: `capstone-nilm-app-prototype-db.sql`
   - Update database connection in `config/database.ts`:
     ```typescript
     const dbConfig = {
       host: process.env.DB_HOST || 'localhost',
       port: parseInt(process.env.DB_PORT || '3306'),
       user: process.env.DB_USER || 'root',
       password: process.env.DB_PASSWORD || '',
       database: process.env.DB_NAME || 'nilm_capstone',
     };
     ```

3. **Environment Variables** (Optional)
   Create a `.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=nilm_capstone
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Test Connection**
   The database connection is tested automatically on first use. Check console for connection errors.

## Breaking Changes

1. **Authentication Flow**
   - Old: Firebase Auth with automatic session management
   - New: JWT tokens stored in AsyncStorage, manual token verification

2. **Service Imports**
   - `firestoreApplianceService` is now aliased from `applianceService` for backward compatibility
   - All Firebase imports should be removed

3. **Real-time Updates**
   - Firestore real-time listeners are no longer available
   - Consider implementing WebSocket or polling for real-time updates

## Notes

- The `firestoreApplianceService` export is maintained for backward compatibility but points to the new `applianceService`
- Some services like `consumptionSummaryService` and `notificationService` may need additional MySQL table creation
- The migration maintains the same interface where possible to minimize code changes

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Database**
   - Import `capstone-nilm-app-prototype-db.sql` into MySQL
   - Configure connection in `config/database.ts`

3. **Test the Migration**
   - Test all authentication flows
   - Verify device and appliance management
   - Test reading storage and retrieval
   - Verify alert generation and management
   - Test report generation

4. **Production Considerations**
   - ⚠️ **Important:** For React Native mobile apps, consider creating a backend API
   - `mysql2` works for web/Node.js but may not work in native iOS/Android builds
   - See `SETUP-MYSQL.md` for detailed setup and production recommendations

5. **Future Improvements**
   - Add database migrations for schema changes
   - Implement connection pooling optimization
   - Add query performance monitoring
   - Consider adding a REST API layer for mobile apps
