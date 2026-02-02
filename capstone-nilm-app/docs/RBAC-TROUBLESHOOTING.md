# RBAC Troubleshooting Guide

## Issue: "auth/admin-restricted-operation" during landlord registration

### Error
```
FirebaseError: auth/admin-restricted-operation
```

### Cause
This error occurs when Firebase Security Rules are preventing the user document creation with a specific role.

### Solution

Update your Firebase Security Rules to allow role assignment during registration:

#### Navigate to Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project
3. Go to **Firestore Database** → **Rules**

#### Update Rules

Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Anyone can create their own user document during registration
      allow create: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.role in ['tenant', 'landlord']; // Allow tenant or landlord
      
      // Users can read their own document
      allow read: if request.auth != null 
        && request.auth.uid == userId;
      
      // Users can update their own document, but NOT the role
      allow update: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.role == resource.data.role; // Can't change own role
    }
    
    // Admin can manage any user
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Devices collection
    match /devices/{deviceId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // Landlords and admins can create/update/delete
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['landlord', 'admin'];
    }
    
    // Appliances collection
    match /appliances/{applianceId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // Users can manage appliances on their own device
      allow write: if request.auth != null 
        && (resource.data.userId == request.auth.uid 
            || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['landlord', 'admin']);
    }
    
    // Real-time readings collection
    match /realTimeReadings/{readingId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // System can write (device sends data)
      allow write: if request.auth != null;
    }
    
    // Consumption summaries collection
    match /consumptionSummaries/{summaryId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // System can write
      allow write: if request.auth != null;
    }
    
    // Electricity rates collection
    match /electricityRates/{rateId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // Landlords and admins can manage rates
      allow write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['landlord', 'admin'];
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Users can read their own notifications
      allow read: if request.auth != null 
        && resource.data.userId == request.auth.uid;
      
      // System can write
      allow write: if request.auth != null;
    }
    
    // Alert rules collection
    match /alertRules/{ruleId} {
      // Users can manage their own alert rules
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Properties collection (landlords)
    match /properties/{propertyId} {
      // Landlords can read their own properties
      allow read: if request.auth != null 
        && resource.data.landlordId == request.auth.uid;
      
      // Landlords can create/update their own properties
      allow create, update: if request.auth != null 
        && request.resource.data.landlordId == request.auth.uid;
      
      // Admins can read/write any property
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Key Rule Explanations

1. **User Creation**:
   ```javascript
   allow create: if request.auth != null 
     && request.auth.uid == userId
     && request.resource.data.role in ['tenant', 'landlord'];
   ```
   - Users can create their own document
   - Can choose tenant or landlord role
   - Admin role requires manual database update

2. **Role Protection**:
   ```javascript
   allow update: if request.auth != null 
     && request.auth.uid == userId
     && request.resource.data.role == resource.data.role;
   ```
   - Users can't change their own role
   - Only admins can change user roles

3. **Admin Privileges**:
   ```javascript
   allow read, write: if request.auth != null 
     && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
   ```
   - Admins have full access to all users

### After Updating Rules

1. **Save** the rules in Firebase Console
2. **Wait** 10-30 seconds for rules to propagate
3. **Try registering** as landlord again

### Testing

```typescript
// Should work now:
await register({
  email: 'landlord@test.com',
  password: 'test123',
  firstName: 'John',
  lastName: 'Landlord',
  role: 'landlord', // ✅ Now allowed
});
```

---

## Alternative: Development Mode (Temporary)

If you need to test quickly, you can temporarily use open rules:

⚠️ **WARNING: Only for development! Never use in production!**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Remember to revert to secure rules before deployment!**

---

## Creating Admin Users

Since users can't register as admin (security), create admin users manually:

### Option 1: Firebase Console

1. Register normally as tenant
2. Go to Firestore Database
3. Find your user document in `users` collection
4. Edit the `role` field → Change to `admin`
5. Refresh app

### Option 2: Firebase Admin SDK (Backend)

If you have a Node.js backend:

```typescript
import { getFirestore } from 'firebase-admin/firestore';

async function makeAdmin(userId: string) {
  await getFirestore()
    .collection('users')
    .doc(userId)
    .update({ role: 'admin' });
}
```

---

## Verification

After fixing, verify roles work:

```typescript
import { useRBAC } from '@/contexts/RBACContext';

function TestScreen() {
  const { role, permissions } = useRBAC();
  
  console.log('Current role:', role);
  console.log('Can manage multiple units:', permissions.canViewAllTenantDevices);
  
  return <Text>Role: {role}</Text>;
}
```

---

## Common Errors

### "Missing or insufficient permissions"
- **Cause**: Firebase rules too restrictive
- **Fix**: Update rules as shown above

### "Role undefined"
- **Cause**: User document doesn't have role field
- **Fix**: Log out and register again, or manually add role in Firestore

### "Permission denied"
- **Cause**: Trying to access data you don't have permission for
- **Fix**: Check if role has required permission in RBAC matrix

---

## Need Help?

Check these files:
- `docs/RBAC-IMPLEMENTATION-COMPLETE.md` - Full RBAC documentation
- `utils/rbac.ts` - Permission definitions
- Firebase Console → Firestore → Rules - Your current rules

---

**After following this guide, landlord registration should work! 🎉**
