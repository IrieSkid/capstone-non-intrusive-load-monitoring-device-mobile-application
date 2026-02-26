"use strict";
/**
 * MySQL Database Configuration (Server-side)
 * For use in Node.js scripts (no React Native dependencies)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
exports.getConnection = getConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
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
exports.pool = promise_1.default.createPool(dbConfig);
/**
 * Execute a query with error handling
 */
async function query(sql, params) {
    try {
        const [results] = await exports.pool.execute(sql, params);
        return results;
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
/**
 * Get a single connection from the pool (for transactions)
 */
async function getConnection() {
    return await exports.pool.getConnection();
}
exports.default = exports.pool;
