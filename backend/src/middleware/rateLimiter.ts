/**
 * Rate limiting middleware
 * Protects API endpoints from abuse and excessive requests
 */

import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { config } from '../config/index.js';
import { CustomError } from './errorHandler.js';

// Rate limiter configurations
const rateLimiters = {
  // General API rate limiter
  general: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: config.rateLimit.maxRequests, // Number of requests
    duration: Math.floor(config.rateLimit.windowMs / 1000), // Per duration in seconds
    blockDuration: 60, // Block for 60 seconds if limit exceeded
  }),

  // Strict rate limiter for authentication endpoints
  auth: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 5, // 5 attempts
    duration: 900, // Per 15 minutes
    blockDuration: 900, // Block for 15 minutes
  }),

  // Password reset rate limiter
  passwordReset: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 3, // 3 attempts
    duration: 3600, // Per hour
    blockDuration: 3600, // Block for 1 hour
  }),

  // File upload rate limiter
  upload: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 10, // 10 uploads
    duration: 3600, // Per hour
    blockDuration: 300, // Block for 5 minutes
  }),

  // Report generation rate limiter
  reports: new RateLimiterMemory({
    keyGenerator: (req: Request) => req.ip,
    points: 5, // 5 reports
    duration: 3600, // Per hour
    blockDuration: 600, // Block for 10 minutes
  }),
};

/**
 * Create rate limiter middleware
 */
const createRateLimiter = (limiter: RateLimiterMemory, errorMessage?: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch (rateLimiterRes) {
      const result = rateLimiterRes as RateLimiterRes;
      
      // Calculate remaining time
      const remainingTime = Math.round(result.msBeforeNext / 1000);
      const remainingMinutes = Math.ceil(remainingTime / 60);
      
      // Set rate limit headers
      res.set({
        'Retry-After': String(remainingTime),
        'X-RateLimit-Limit': String(limiter.points),
        'X-RateLimit-Remaining': String(result.remainingHits || 0),
        'X-RateLimit-Reset': String(new Date(Date.now() + result.msBeforeNext)),
      });

      const message = errorMessage || 
        `Too many requests. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`;

      throw new CustomError(message, 429);
    }
  };
};

/**
 * General rate limiter middleware
 */
export const rateLimiter = createRateLimiter(
  rateLimiters.general,
  'Too many requests from this IP. Please try again later.'
);

/**
 * Authentication rate limiter middleware
 */
export const authRateLimiter = createRateLimiter(
  rateLimiters.auth,
  'Too many authentication attempts. Please try again in 15 minutes.'
);

/**
 * Password reset rate limiter middleware
 */
export const passwordResetRateLimiter = createRateLimiter(
  rateLimiters.passwordReset,
  'Too many password reset attempts. Please try again in 1 hour.'
);

/**
 * File upload rate limiter middleware
 */
export const uploadRateLimiter = createRateLimiter(
  rateLimiters.upload,
  'Too many file uploads. Please try again in a few minutes.'
);

/**
 * Report generation rate limiter middleware
 */
export const reportsRateLimiter = createRateLimiter(
  rateLimiters.reports,
  'Too many report generation requests. Please try again in 10 minutes.'
);

/**
 * User-specific rate limiter
 * Uses user ID instead of IP for authenticated requests
 */
export const userRateLimiter = (points: number = 100, duration: number = 3600) => {
  const limiter = new RateLimiterMemory({
    keyGenerator: (req: Request) => req.user?.id || req.ip,
    points,
    duration,
    blockDuration: 300, // Block for 5 minutes
  });

  return createRateLimiter(limiter, 'User rate limit exceeded. Please try again later.');
};

/**
 * Endpoint-specific rate limiter
 * Creates a rate limiter for specific endpoints
 */
export const endpointRateLimiter = (
  endpoint: string,
  points: number = 20,
  duration: number = 3600
) => {
  const limiter = new RateLimiterMemory({
    keyGenerator: (req: Request) => `${req.ip}:${endpoint}`,
    points,
    duration,
    blockDuration: 300,
  });

  return createRateLimiter(
    limiter,
    `Too many requests to ${endpoint}. Please try again later.`
  );
};

/**
 * Skip rate limiting for certain conditions
 */
export const skipRateLimit = (req: Request): boolean => {
  // Skip rate limiting for health checks
  if (req.path === '/health') {
    return true;
  }

  // Skip for admin users (optional)
  if (req.user && req.user.role === 'admin') {
    return true;
  }

  // Skip for localhost in development (optional)
  if (process.env.NODE_ENV === 'development' && req.ip === '127.0.0.1') {
    return true;
  }

  return false;
};

/**
 * Conditional rate limiter
 * Applies rate limiting only if conditions are met
 */
export const conditionalRateLimiter = (limiter: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (skipRateLimit(req)) {
      return next();
    }
    
    return limiter(req, res, next);
  };
};

export default rateLimiter;
