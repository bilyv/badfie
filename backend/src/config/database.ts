/**
 * Database configuration and connection management
 * Handles PostgreSQL database connections using pg library
 */

import { Pool, PoolConfig } from 'pg';
import { config } from './index.js';

// Database configuration interface
interface DatabaseConfig extends PoolConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | object;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Create database configuration from environment variables
const dbConfig: DatabaseConfig = {
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
let pool: Pool | null = null;

/**
 * Get database connection pool
 * Creates a new pool if one doesn't exist
 */
export const getPool = (): Pool => {
  if (!pool) {
    pool = new Pool(dbConfig);
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    // Handle pool connection events
    pool.on('connect', (client) => {
      console.log('New client connected to database');
    });

    pool.on('remove', (client) => {
      console.log('Client removed from pool');
    });
  }
  
  return pool;
};

/**
 * Test database connection
 * Returns true if connection is successful, false otherwise
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await getPool().connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

/**
 * Execute a query with parameters
 * Provides a convenient wrapper around pool.query
 */
export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  
  try {
    const result = await getPool().query(text, params);
    const duration = Date.now() - start;
    
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', { text, error });
    throw error;
  }
};

/**
 * Execute a transaction
 * Provides automatic rollback on error
 */
export const transaction = async (callback: (client: any) => Promise<any>): Promise<any> => {
  const client = await getPool().connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Close database connection pool
 * Should be called when shutting down the application
 */
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
};

// Export the pool for direct access if needed
export { pool };

// Default export
export default {
  getPool,
  testConnection,
  query,
  transaction,
  closePool,
};
