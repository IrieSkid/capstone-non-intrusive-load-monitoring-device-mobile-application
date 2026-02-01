# NILM Project Structure Guide

## Recommended Folder Structure

```
NILM-Planning/
├── Documentation/                    # All documentation (current)
│   ├── database-design/
│   ├── thesis-documentation/
│   └── mobile-app-prototype/
│
├── mobile-app/                      # React Native + Expo App (NEW)
│   ├── .expo/
│   ├── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── services/
│   │   ├── utils/
│   │   └── constants/
│   ├── App.js
│   ├── app.json
│   ├── package.json
│   └── node_modules/
│
├── backend/                         # Backend API (Optional - if not using Firebase Cloud Functions)
│   ├── functions/
│   ├── package.json
│   └── ...
│
└── README.md                        # Main project README
```

## Setting Up React Native + Expo in This Folder

### Option 1: Create Expo App in Subfolder (Recommended)

```bash
# Navigate to project root
cd "d:\Development\NILM Planning"

# Create Expo app in mobile-app folder
npx create-expo-app mobile-app

# Or use Expo CLI
expo init mobile-app
```

### Option 2: Initialize Expo in Current Folder (Not Recommended)

This would mix documentation with code. Better to keep them separate.

## Benefits of This Structure

✅ **Separation of Concerns**
- Documentation stays separate from code
- Easy to navigate and maintain
- Clear project organization

✅ **Version Control**
- All files in one repository
- Easy to track changes
- Single source of truth

✅ **Team Collaboration**
- Documentation team works in `Documentation/`
- Developers work in `mobile-app/`
- Hardware team references `Documentation/database-design/`

✅ **Deployment Ready**
- Mobile app can be deployed independently
- Documentation remains accessible
- Backend can be separate or integrated

## Next Steps

1. **Create the mobile-app folder:**
   ```bash
   npx create-expo-app mobile-app
   ```

2. **Update .gitignore:**
   Add mobile-app specific ignores:
   ```
   mobile-app/node_modules/
   mobile-app/.expo/
   mobile-app/dist/
   mobile-app/*.log
   ```

3. **Update README.md:**
   Add mobile-app setup instructions

4. **Start Development:**
   ```bash
   cd mobile-app
   npm start
   ```

## Alternative: Monorepo Structure

If you want a more advanced setup, you could use:
- **Nx** - Monorepo tool
- **Turborepo** - High-performance monorepo
- **Yarn Workspaces** - Simple monorepo solution

But for a capstone project, the simple folder structure above is recommended.
