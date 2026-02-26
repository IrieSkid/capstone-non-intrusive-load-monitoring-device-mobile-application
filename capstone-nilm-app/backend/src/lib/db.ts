/**
 * Re-use the existing server-side MySQL pool/query helpers in `config/database.server.ts`.
 *
 * We use `require()` here to avoid TypeScript build errors about importing files
 * outside the backend `rootDir` while still sharing the same config at runtime.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../../config/database.server');

export const query: (sql: string, params?: any[]) => Promise<any> = db.query;
export const getConnection: () => Promise<any> = db.getConnection;

