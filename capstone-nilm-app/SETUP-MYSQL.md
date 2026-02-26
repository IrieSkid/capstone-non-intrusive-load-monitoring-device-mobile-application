# MySQL Setup Instructions

## Prerequisites

1. MySQL Server installed and running
2. Node.js and npm installed

## Installation Steps

### 1. Install Dependencies

After updating `package.json`, run:

```bash
npm install
```

This will install:
- `mysql2` - MySQL database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `@types/bcryptjs` - TypeScript types for bcryptjs
- `@types/jsonwebtoken` - TypeScript types for jsonwebtoken

### 2. Database Setup

1. **Create the database:**
   ```sql
   mysql -u root -p < capstone-nilm-app-prototype-db.sql
   ```

   Or manually:
   ```sql
   mysql -u root -p
   source capstone-nilm-app-prototype-db.sql
   ```

2. **Verify the database:**
   ```sql
   USE nilm_capstone;
   SHOW TABLES;
   ```

### 3. Configure Database Connection

Update `config/database.ts` with your MySQL credentials:

```typescript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nilm_capstone',
  // ... other config
};
```

### 4. Environment Variables (Optional but Recommended)

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nilm_capstone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Note:** For React Native/Expo apps, you may need to use `expo-constants` to access environment variables, or use a different configuration approach.

## Backend API (Required for Mobile)

The Expo app **cannot** connect to MySQL directly. Run the Node/Express API in `backend/` and point the app to it.

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Apply the migration for per-device appliances

Apply `backend/migrations/001_add_tblappliances.sql`:

```bash
mysql -u root -p nilm_capstone < backend/migrations/001_add_tblappliances.sql
```

### 3. Configure backend environment variables

Use `backend/env.example` as your reference and set:

- `API_PORT` (default `3001`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`

### 4. Start the API

```bash
cd backend
npm run dev
```

### 5. Point the Expo app to the API

Set `EXPO_PUBLIC_API_URL` (use your machine’s LAN IP for mobile devices):

- Example: `EXPO_PUBLIC_API_URL=http://192.168.1.10:3001`

Restart Expo after changing it.

### 5. Test the Connection

The database connection will be tested automatically when services are first used. Check the console for any connection errors.

## Important Notes

### React Native Compatibility

⚠️ **Important:** `mysql2` is a Node.js package and may not work directly in React Native mobile environments. You have two options:

1. **Backend API Approach (Recommended):**
   - Create a separate Node.js/Express backend API
   - Mobile app makes HTTP requests to the API
   - API handles all MySQL operations
   - This is the standard approach for mobile apps

2. **Direct Connection (Development Only):**
   - Works for web builds and development
   - May not work for iOS/Android native builds
   - Consider this for prototyping only

### For Production

For a production React Native app, you should:

1. Create a REST API backend (Node.js/Express, Python/Flask, etc.)
2. Update services to make HTTP requests instead of direct DB calls
3. Implement proper authentication middleware
4. Add rate limiting and security measures

Example service structure for API approach:
```typescript
// Instead of direct DB query:
const result = await query('SELECT * FROM users');

// Use API call:
const response = await fetch('https://api.yourapp.com/users');
const result = await response.json();
```

## Troubleshooting

### Connection Errors

If you see connection errors:

1. Verify MySQL is running:
   ```bash
   mysqladmin -u root -p ping
   ```

2. Check firewall settings
3. Verify credentials in `config/database.ts`
4. Ensure database exists: `SHOW DATABASES;`

### TypeScript Errors

If you see TypeScript errors about missing types:

```bash
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### Module Not Found Errors

If packages aren't found:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up MySQL database
3. ✅ Configure connection settings
4. ✅ Test database connection
5. ⚠️ Consider backend API for production mobile app
