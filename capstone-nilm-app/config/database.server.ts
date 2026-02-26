/**
 * MySQL Database Configuration (Server-side)
 * For use in Node.js scripts (no React Native dependencies)
 */

import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nilm_capstone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

/**
 * Execute a query with error handling
 */
export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single connection from the pool (for transactions)
 */
export async function getConnection() {
  return await pool.getConnection();
}

export default pool;
