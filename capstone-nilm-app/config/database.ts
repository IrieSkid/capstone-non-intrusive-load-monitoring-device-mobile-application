/**
 * Database client shim (Expo / React Native)
 *
 * IMPORTANT:
 * - `mysql2` is a Node.js library and cannot run inside the Expo/React Native runtime.
 * - If you import `mysql2` in app code, Metro will crash (like the NODE_DEBUG error you saw).
 *
 * What to do instead:
 * - Run a backend API (Node/Express) that talks to MySQL.
 * - Have the mobile app call that API via HTTP.
 *
 * See `SETUP-MYSQL.md` for details.
 */

export const pool = null;

function notSupported(): never {
  throw new Error(
    'Direct MySQL connections are not supported in the Expo app runtime. ' +
      'Use a backend API (Node/Express) to access MySQL. See SETUP-MYSQL.md.'
  );
}

/**
 * Placeholder: kept so existing service code compiles.
 * Replace services to call your backend API instead of calling `query()` in-app.
 */
export async function query(_sql: string, _params?: any[]): Promise<any> {
  return notSupported();
}

/**
 * Placeholder: transactions are server-only.
 */
export async function getConnection() {
  return notSupported();
}

/**
 * Placeholder: connection tests are server-only.
 */
export async function testConnection(): Promise<boolean> {
  notSupported();
}

export default pool;
