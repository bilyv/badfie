/**
 * Authentication routes
 * Handles user registration, login, logout, and token refresh
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../config/database.js';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  authMiddleware
} from '../middleware/auth.js';
import {
  CustomError,
  catchAsync,
  createValidationError
} from '../middleware/errorHandler.js';
import { authRateLimiter, passwordResetRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', authRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { email, password, firstName, lastName, phone } = validationResult.data;

  // Check if worker already exists
  const existingWorker = await query(
    'SELECT id FROM workers WHERE email = $1',
    [email.toLowerCase()]
  );

  if (existingWorker.rows.length > 0) {
    throw new CustomError('Worker with this email already exists', 409);
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create worker (Note: This endpoint should probably be restricted to admins only)
  const result = await query(
    `INSERT INTO workers (email, password_hash, first_name, last_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, first_name, last_name, role, created_at`,
    [email.toLowerCase(), passwordHash, firstName, lastName, phone, 'worker']
  );

  const worker = result.rows[0];

  // Generate tokens
  const token = generateToken({
    id: worker.id,
    email: worker.email,
    role: worker.role,
    userType: 'worker',
  });

  const refreshToken = generateRefreshToken({
    id: worker.id,
    email: worker.email,
  });

  res.status(201).json({
    status: 'success',
    message: 'Worker registered successfully',
    data: {
      user: {
        id: worker.id,
        email: worker.email,
        firstName: worker.first_name,
        lastName: worker.last_name,
        role: worker.role,
        userType: 'worker',
        createdAt: worker.created_at,
      },
      token,
      refreshToken,
    },
  });
}));

/**
 * POST /api/v1/auth/admin/login
 * Admin login endpoint
 */
router.post('/admin/login', authRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { email, password } = validationResult.data;

  // Find admin by email
  const result = await query(
    'SELECT id, email, password_hash, first_name, last_name, is_active, is_super_admin FROM admin WHERE email = $1',
    [email.toLowerCase()]
  );

  const admin = result.rows[0];

  if (!admin) {
    throw new CustomError('Invalid email or password', 401);
  }

  if (!admin.is_active) {
    throw new CustomError('Account is deactivated', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Update last login
  await query(
    'UPDATE admin SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [admin.id]
  );

  // Generate tokens
  const token = generateToken({
    id: admin.id,
    email: admin.email,
    role: 'admin',
    userType: 'admin',
  });

  const refreshToken = generateRefreshToken({
    id: admin.id,
    email: admin.email,
  });

  res.json({
    status: 'success',
    message: 'Admin login successful',
    data: {
      user: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: 'admin',
        userType: 'admin',
        isSuperAdmin: admin.is_super_admin,
      },
      token,
      refreshToken,
    },
  });
}));

/**
 * POST /api/v1/auth/worker/login
 * Worker login endpoint
 */
router.post('/worker/login', authRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { email, password } = validationResult.data;

  // Find worker by email
  const result = await query(
    'SELECT id, email, password_hash, first_name, last_name, role, is_active, admin_id FROM workers WHERE email = $1',
    [email.toLowerCase()]
  );

  const worker = result.rows[0];

  if (!worker) {
    throw new CustomError('Invalid email or password', 401);
  }

  if (!worker.is_active) {
    throw new CustomError('Account is deactivated', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, worker.password_hash);
  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Update last login
  await query(
    'UPDATE workers SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [worker.id]
  );

  // Generate tokens
  const token = generateToken({
    id: worker.id,
    email: worker.email,
    role: worker.role,
    userType: 'worker',
  });

  const refreshToken = generateRefreshToken({
    id: worker.id,
    email: worker.email,
  });

  res.json({
    status: 'success',
    message: 'Worker login successful',
    data: {
      user: {
        id: worker.id,
        email: worker.email,
        firstName: worker.first_name,
        lastName: worker.last_name,
        role: worker.role,
        userType: 'worker',
        adminId: worker.admin_id,
      },
      token,
      refreshToken,
    },
  });
}));

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = refreshTokenSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { refreshToken } = validationResult.data;

  try {
    // Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);

    // Try to find user in admin table first
    let result = await query(
      'SELECT id, email, is_active, \'admin\' as user_type FROM admin WHERE id = $1',
      [decoded.id]
    );

    let user = result.rows[0];
    let userType = 'admin';

    // If not found in admin, try workers table
    if (!user) {
      result = await query(
        'SELECT id, email, role, is_active, \'worker\' as user_type FROM workers WHERE id = $1',
        [decoded.id]
      );
      user = result.rows[0];
      userType = 'worker';
    }

    if (!user || !user.is_active) {
      throw new CustomError('Invalid refresh token', 401);
    }

    // Generate new access token
    const newToken = generateToken({
      id: user.id,
      email: user.email,
      role: userType === 'admin' ? 'admin' : user.role,
      userType: userType,
    });

    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    throw new CustomError('Invalid refresh token', 401);
  }
}));

/**
 * POST /api/v1/auth/logout
 * User logout (invalidate tokens)
 */
router.post('/logout', authMiddleware, catchAsync(async (req: Request, res: Response) => {
  // In a production environment, you might want to maintain a blacklist of tokens
  // For now, we'll just return a success response
  res.json({
    status: 'success',
    message: 'Logout successful',
  });
}));

/**
 * GET /api/v1/auth/me
 * Get current user profile
 */
router.get('/me', authMiddleware, catchAsync(async (req: Request, res: Response) => {
  const userType = (req.user as any)?.userType || 'worker';
  let result;

  if (userType === 'admin') {
    result = await query(
      'SELECT id, email, first_name, last_name, phone, last_login, created_at, is_super_admin FROM admin WHERE id = $1',
      [req.user!.id]
    );
  } else {
    result = await query(
      'SELECT id, email, first_name, last_name, role, phone, last_login, created_at, admin_id FROM workers WHERE id = $1',
      [req.user!.id]
    );
  }

  const user = result.rows[0];

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const userData: any = {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    lastLogin: user.last_login,
    createdAt: user.created_at,
    userType: userType,
  };

  if (userType === 'admin') {
    userData.role = 'admin';
    userData.isSuperAdmin = user.is_super_admin;
  } else {
    userData.role = user.role;
    userData.adminId = user.admin_id;
  }

  res.json({
    status: 'success',
    data: {
      user: userData,
    },
  });
}));

/**
 * PUT /api/v1/auth/change-password
 * Change user password
 */
router.put('/change-password', authMiddleware, passwordResetRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = changePasswordSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { currentPassword, newPassword } = validationResult.data;

  const userType = (req.user as any)?.userType || 'worker';
  let result;

  // Get current user password hash
  if (userType === 'admin') {
    result = await query(
      'SELECT password_hash FROM admin WHERE id = $1',
      [req.user!.id]
    );
  } else {
    result = await query(
      'SELECT password_hash FROM workers WHERE id = $1',
      [req.user!.id]
    );
  }

  const user = result.rows[0];

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isCurrentPasswordValid) {
    throw new CustomError('Current password is incorrect', 400);
  }

  // Hash new password
  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // Update password in appropriate table
  if (userType === 'admin') {
    await query(
      'UPDATE admin SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user!.id]
    );
  } else {
    await query(
      'UPDATE workers SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user!.id]
    );
  }

  res.json({
    status: 'success',
    message: 'Password changed successfully',
  });
}));

export default router;
