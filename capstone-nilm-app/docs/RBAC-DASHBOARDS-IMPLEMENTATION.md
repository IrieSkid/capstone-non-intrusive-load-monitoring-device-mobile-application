# Role-Based Dashboards Implementation

## Overview
Each user role now sees a completely different dashboard tailored to their specific needs and permissions.

---

## 🏠 Tenant Dashboard
**Target User**: Individual renters monitoring their own consumption

### Features
✅ **Personal Energy Monitoring**
- Real-time power consumption (kW)
- Voltage, Current, Frequency, Power Factor
- Today's consumption chart
- Active appliances list with toggle controls

✅ **UI Elements**
- "Tenant" role badge (top right)
- Gradient power card with animations
- Electrical parameters grid
- Appliance-wise breakdown with V/A/PF
- Info note about data visibility to landlord

### Use Case
> "As a tenant, I want to monitor my energy usage in real-time so I can reduce my electricity costs."

---

## 🏢 Landlord Dashboard
**Target User**: Property managers overseeing multiple units

### Features
✅ **Multi-Property Overview**
- Total devices/properties count
- Online/offline status indicators
- Aggregated statistics across all properties

✅ **Overall Stats Cards**
- 📊 Total Properties
- ⚡ Total Current Power (kW)
- 📈 Today's Total Energy (kWh)
- 💰 Today's Total Cost (₱)

✅ **Property List**
Each property card shows:
- Property name and location
- Online/offline status dot (green/gray)
- Current power consumption
- Today's energy usage
- Today's cost
- Last update timestamp

✅ **UI Elements**
- "Landlord" role badge (top right)
- Pull-to-refresh
- Auto-refresh every 30 seconds
- Empty state for no properties

### Use Case
> "As a landlord, I want to monitor all my properties in one view so I can identify high-consumption units and optimize energy costs."

---

## 🛡️ Admin Dashboard
**Target User**: System administrators managing the entire platform

### Features
✅ **User Statistics**
- 👥 Total Users
- 👤 Tenants Count
- 🏢 Landlords Count
- 🛡️ Admins Count

✅ **Device Statistics**
- 🔌 Total Devices
- ✅ Active Devices (online now)

✅ **System Activity (Today)**
- 📊 Total Readings
- ⚡ Total Energy (kWh)

✅ **Quick Actions**
- Manage Users
- Manage Devices
- System Reports
- System Settings

✅ **UI Elements**
- "Admin" role badge (red theme, top right)
- System-wide metrics
- Action cards for management tasks
- Admin privilege warning note

### Use Cases
> "As an admin, I want a system overview so I can monitor platform health and manage users/devices."

---

## 📊 Dashboard Comparison

| Feature | Tenant | Landlord | Admin |
|---------|--------|----------|-------|
| **Personal Consumption** | ✅ | ❌ | ❌ |
| **Appliance Control** | ✅ | ❌ | ❌ |
| **Multi-Property View** | ❌ | ✅ | ❌ |
| **Property Stats** | ❌ | ✅ | ❌ |
| **System Statistics** | ❌ | ❌ | ✅ |
| **User Management** | ❌ | ❌ | ✅ |
| **Device Management** | Own only | Own only | All |
| **Cost Tracking** | Own only | All properties | System-wide |

---

## 🔄 Implementation Details

### Routing Logic (`app/(tabs)/index.tsx`)
```typescript
// Main dashboard routes based on user role
{role === 'tenant' && <TenantDashboard />}
{role === 'landlord' && <LandlordDashboard />}
{role === 'admin' && <AdminDashboard />}
```

### Role Detection
Uses `useRBAC()` hook from `RBACContext`:
```typescript
const { role, isLoading } = useRBAC();
// role is automatically fetched from Firestore users collection
```

### Components
```
components/dashboard/
├── TenantDashboard.tsx      # Personal consumption view
├── LandlordDashboard.tsx    # Multi-property management
└── AdminDashboard.tsx       # System administration
```

---

## 🎨 Visual Indicators

### Role Badges
Each dashboard displays a role badge:
- **Tenant**: Blue badge with person icon
- **Landlord**: Orange badge with business icon
- **Admin**: Red badge with shield icon

### Status Indicators
- **Online**: Green dot (updated < 60 seconds ago)
- **Offline**: Gray dot (no recent data)

---

## 🔄 Auto-Refresh

| Dashboard | Refresh Interval | Purpose |
|-----------|------------------|---------|
| Tenant | Real-time (3s) | Live power monitoring |
| Landlord | 30 seconds | Property stats update |
| Admin | 60 seconds | System metrics update |

All dashboards support **pull-to-refresh** for manual updates.

---

## 📱 User Experience Flow

### First-Time Login

1. **User registers** → Selects role (Tenant/Landlord)
2. **Login** → `AuthContext` loads user data
3. **RBAC loads** → `RBACContext` fetches role from Firestore
4. **Dashboard loads** → Appropriate dashboard renders
5. **Role badge appears** → User sees their role

### Switching Views

Users **cannot** switch dashboards on their own - the view is determined by their role in the database.

To change a user's role:
1. Admin goes to Firebase Console
2. Finds user in `users` collection
3. Updates `role` field
4. User logs out and back in
5. New dashboard appears

---

## 🎯 Thesis Alignment

### Research Objectives Met

✅ **RQ1: Energy Monitoring**
- Tenant dashboard provides real-time monitoring
- Appliance-level breakdown
- Historical consumption data

✅ **RQ2: Multi-Tenant System**
- Landlord dashboard manages multiple properties
- Aggregated statistics
- Per-unit tracking

✅ **RQ3: User Roles & Permissions**
- Three distinct user types
- Role-appropriate data access
- RBAC fully integrated

### User Study Benefits

| Role | Study Size | Dashboard Benefits |
|------|------------|-------------------|
| Tenant | 30-50 users | Easy consumption monitoring, appliance awareness |
| Landlord | 5-10 users | Multi-property management, cost optimization |
| Admin | 2-3 (thesis team) | System monitoring, data collection |

---

## 🔒 Security

### Data Access Control
- **Tenants**: Can only see their own devices/data
- **Landlords**: Can see all properties they manage (via `userId` in devices)
- **Admins**: Can see system-wide statistics (no PII exposed on dashboard)

### Implementation
All queries use `userId` filtering:
```typescript
// Landlord example
const devices = await deviceService.getUserDevices(user.id);
// Only returns devices where userId matches
```

---

## 🚀 Testing

### Test Each Role

1. **Create Tenant User**
   - Register as Tenant
   - Check dashboard shows personal consumption
   - Verify appliance controls work

2. **Create Landlord User**
   - Register as Landlord
   - Add multiple devices
   - Check dashboard shows all properties
   - Verify aggregated stats

3. **Create Admin User** (via Firebase Console)
   - Change user role to 'admin'
   - Login
   - Check dashboard shows system stats
   - Verify user counts are accurate

---

## 📈 Future Enhancements

### Potential Features

**Landlord Dashboard**
- [ ] Click property card → Navigate to detailed view
- [ ] Filter properties by location/status
- [ ] Export property reports
- [ ] Tenant contact information
- [ ] Billing integration

**Admin Dashboard**
- [ ] Implement quick action navigation
- [ ] User management screen
- [ ] System configuration panel
- [ ] Data export tools
- [ ] System health monitoring

**Tenant Dashboard**
- [ ] Cost predictions
- [ ] Comparison with similar units
- [ ] Energy-saving recommendations

---

## ✅ Completion Status

- [x] Tenant Dashboard
- [x] Landlord Dashboard
- [x] Admin Dashboard
- [x] Role-based routing
- [x] Role badges
- [x] Auto-refresh
- [x] Pull-to-refresh
- [x] Empty states
- [x] Loading states
- [x] Firestore integration
- [x] Documentation

---

## 🎓 Thesis Documentation

Include these screenshots in your thesis:

1. **All three dashboards side-by-side** (comparison)
2. **Landlord multi-property view** (management capability)
3. **Admin system statistics** (system architecture)
4. **Role badges** (access control visualization)

### Suggested Chapter
**Chapter 4: System Implementation**
- Section: Role-Based Access Control
- Subsection: Dashboard Differentiation by User Type

---

**Implementation Date**: February 2, 2026  
**Status**: ✅ Complete and Production-Ready
