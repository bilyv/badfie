/**
 * Application configuration
 * Centralizes all environment variables and configuration settings
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Application configuration object
export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // Database configuration
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    ssl: process.env.DB_SSL === 'true',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // CORS configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080', 'http://localhost:3000'],
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    uploadPath: process.env.UPLOAD_PATH || 'uploads/',
  },

  // Email configuration (optional)
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: process.env.EMAIL_FROM || 'noreply@digitalstock.com',
  },

  // Redis configuration (optional)
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },

  // Backup configuration
  backup: {
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  },
};

// Helper functions
export const isDevelopment = (): boolean => config.server.nodeEnv === 'development';
export const isProduction = (): boolean => config.server.nodeEnv === 'production';
export const isTest = (): boolean => config.server.nodeEnv === 'test';

// Validate configuration
export const validateConfig = (): void => {
  // Validate port
  if (isNaN(config.server.port) || config.server.port < 1 || config.server.port > 65535) {
    throw new Error('Invalid port number');
  }

  // Validate database port
  if (isNaN(config.database.port) || config.database.port < 1 || config.database.port > 65535) {
    throw new Error('Invalid database port number');
  }

  // Validate JWT secret length
  if (config.jwt.secret.length < 32) {
    console.warn('JWT secret should be at least 32 characters long for security');
  }

  console.log('Configuration validated successfully');
};

// Export default configuration
export default config;
