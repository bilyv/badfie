/**
 * Global error handling middleware
 * Provides centralized error handling for the Express application
 */

import { Request, Response, NextFunction } from 'express';
import { isDevelopment } from '../config/index.js';

// Custom error interface
export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: string;
  path?: string;
  value?: any;
  errors?: any;
}

/**
 * Create a custom application error
 */
export class CustomError extends Error implements AppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle database errors
 */
const handleDatabaseError = (error: any): AppError => {
  let message = 'Database operation failed';
  let statusCode = 500;

  // PostgreSQL specific error codes
  switch (error.code) {
    case '23505': // Unique violation
      message = 'Duplicate entry. This record already exists.';
      statusCode = 409;
      break;
    case '23503': // Foreign key violation
      message = 'Cannot delete record. It is referenced by other records.';
      statusCode = 409;
      break;
    case '23502': // Not null violation
      message = 'Required field is missing.';
      statusCode = 400;
      break;
    case '23514': // Check violation
      message = 'Invalid data provided.';
      statusCode = 400;
      break;
    case '42P01': // Undefined table
      message = 'Database table not found.';
      statusCode = 500;
      break;
    case '42703': // Undefined column
      message = 'Database column not found.';
      statusCode = 500;
      break;
    case 'ECONNREFUSED':
      message = 'Database connection refused.';
      statusCode = 503;
      break;
    case 'ENOTFOUND':
      message = 'Database host not found.';
      statusCode = 503;
      break;
    default:
      if (error.message) {
        message = error.message;
      }
  }

  return new CustomError(message, statusCode);
};

/**
 * Handle JWT errors
 */
const handleJWTError = (error: any): AppError => {
  let message = 'Authentication failed';
  let statusCode = 401;

  if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again.';
  } else if (error.name === 'TokenExpiredError') {
    message = 'Token expired. Please log in again.';
  } else if (error.name === 'NotBeforeError') {
    message = 'Token not active. Please log in again.';
  }

  return new CustomError(message, statusCode);
};

/**
 * Handle validation errors
 */
const handleValidationError = (error: any): AppError => {
  let message = 'Validation failed';
  let statusCode = 400;

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    message = `Validation failed: ${errors.join(', ')}`;
  } else if (error.name === 'ZodError') {
    const errors = error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`);
    message = `Validation failed: ${errors.join(', ')}`;
  }

  return new CustomError(message, statusCode);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default error properties
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  let error = { ...err };
  error.message = err.message;

  // Database errors
  if (err.code && (err.code.startsWith('23') || err.code.startsWith('42') || err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
    error = handleDatabaseError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
    error = handleJWTError(err);
  }

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    error = handleValidationError(err);
  }

  // Send error response based on environment
  if (isDevelopment()) {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Async error wrapper
 * Catches async errors and passes them to the error handler
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Create a 404 error
 */
export const createNotFoundError = (resource: string = 'Resource'): AppError => {
  return new CustomError(`${resource} not found`, 404);
};

/**
 * Create a validation error
 */
export const createValidationError = (message: string): AppError => {
  return new CustomError(message, 400);
};

/**
 * Create an unauthorized error
 */
export const createUnauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return new CustomError(message, 401);
};

/**
 * Create a forbidden error
 */
export const createForbiddenError = (message: string = 'Forbidden'): AppError => {
  return new CustomError(message, 403);
};

export default errorHandler;
