/**
 * Authentication middleware
 * Handles JWT token verification and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { query } from '../config/database.js';
import { CustomError, catchAsync } from './errorHandler.js';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        userType?: string;
      };
    }
  }
}

// JWT payload interface
interface JWTPayload {
  id: string;
  email: string;
  role: string;
  userType?: string;
  iat: number;
  exp: number;
}

/**
 * Extract token from request headers
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check for token in cookies (optional)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
};

/**
 * Verify JWT token
 */
const verifyToken = (token: string): Promise<JWTPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JWTPayload);
      }
    });
  });
};

/**
 * Get user from database (admin or worker)
 */
const getUserById = async (userId: string, userType?: string): Promise<any> => {
  let result;

  if (userType === 'admin') {
    result = await query(
      'SELECT id, email, first_name, last_name, is_active, \'admin\' as role, \'admin\' as user_type FROM admin WHERE id = $1',
      [userId]
    );
  } else {
    // Try workers table first
    result = await query(
      'SELECT id, email, first_name, last_name, role, is_active, \'worker\' as user_type FROM workers WHERE id = $1',
      [userId]
    );

    // If not found in workers, try admin table
    if (!result.rows[0]) {
      result = await query(
        'SELECT id, email, first_name, last_name, is_active, \'admin\' as role, \'admin\' as user_type FROM admin WHERE id = $1',
        [userId]
      );
    }
  }

  return result.rows[0];
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Extract token from request
  const token = extractToken(req);

  if (!token) {
    throw new CustomError('Access token is required', 401);
  }

  try {
    // Verify token
    const decoded = await verifyToken(token);

    // Get user from database
    const user = await getUserById(decoded.id, decoded.userType);

    if (!user) {
      throw new CustomError('User not found', 401);
    }

    if (!user.is_active) {
      throw new CustomError('User account is deactivated', 401);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
      userType: user.user_type,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError('Invalid token', 401);
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new CustomError('Token expired', 401);
    } else {
      throw error;
    }
  }
});

/**
 * Role-based authorization middleware
 * Checks if user has required role
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError('Insufficient permissions', 403);
    }

    next();
  };
};

/**
 * Admin only middleware
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new CustomError('Authentication required', 401);
  }

  if (req.user.userType !== 'admin') {
    throw new CustomError('Admin access required', 403);
  }

  next();
};

/**
 * Manager or Admin middleware
 */
export const requireManagerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new CustomError('Authentication required', 401);
  }

  if (req.user.userType === 'admin' || req.user.role === 'manager') {
    next();
  } else {
    throw new CustomError('Manager or Admin access required', 403);
  }
};

/**
 * Staff or higher middleware
 */
export const requireStaffOrHigher = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new CustomError('Authentication required', 401);
  }

  if (req.user.userType === 'admin' || ['manager', 'staff'].includes(req.user.role)) {
    next();
  } else {
    throw new CustomError('Staff level access or higher required', 403);
  }
};

/**
 * Optional authentication middleware
 * Attaches user to request if token is provided, but doesn't require it
 */
export const optionalAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = await verifyToken(token);
      const user = await getUserById(decoded.id, decoded.userType);

      if (user && user.is_active) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
        };
      }
    } catch (error) {
      // Ignore token errors for optional auth
      console.warn('Optional auth token error:', error.message);
    }
  }

  next();
});

/**
 * Generate JWT token
 */
export const generateToken = (payload: { id: string; email: string; role: string; userType?: string }): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.refreshSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export default authMiddleware;
