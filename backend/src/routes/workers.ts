/**
 * Worker management routes
 * Handles worker CRUD operations and worker management
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../config/database.js';
import { requireManagerOrAdmin, requireAdmin } from '../middleware/auth.js';
import {
  CustomError,
  catchAsync,
  createValidationError,
  createNotFoundError
} from '../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const createWorkerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['manager', 'worker', 'staff']),
  phone: z.string().optional(),
});

const updateWorkerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  role: z.enum(['manager', 'worker', 'staff']).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  search: z.string().optional(),
  role: z.enum(['manager', 'worker', 'staff']).optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
});

/**
 * GET /api/v1/workers
 * Get all workers with pagination and filtering
 */
router.get('/', requireManagerOrAdmin, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = querySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { page = 1, limit = 10, search, role, isActive } = validationResult.data;
  const offset = (page - 1) * limit;

  // Build query conditions
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (search) {
    whereConditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  if (role) {
    whereConditions.push(`role = $${paramIndex}`);
    queryParams.push(role);
    paramIndex++;
  }

  if (isActive !== undefined) {
    whereConditions.push(`is_active = $${paramIndex}`);
    queryParams.push(isActive);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM workers ${whereClause}`,
    queryParams
  );
  const totalWorkers = parseInt(countResult.rows[0].count);

  // Get workers
  const workersResult = await query(
    `SELECT id, email, first_name, last_name, role, phone, is_active, last_login, created_at, updated_at, admin_id
     FROM workers ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...queryParams, limit, offset]
  );

  const workers = workersResult.rows.map(worker => ({
    id: worker.id,
    email: worker.email,
    firstName: worker.first_name,
    lastName: worker.last_name,
    role: worker.role,
    phone: worker.phone,
    isActive: worker.is_active,
    lastLogin: worker.last_login,
    createdAt: worker.created_at,
    updatedAt: worker.updated_at,
    adminId: worker.admin_id,
  }));

  res.json({
    status: 'success',
    data: {
      workers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalWorkers / limit),
        totalWorkers,
        limit,
      },
    },
  });
}));

/**
 * GET /api/v1/workers/:id
 * Get worker by ID
 */
router.get('/:id', requireManagerOrAdmin, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'SELECT id, email, first_name, last_name, role, phone, is_active, last_login, created_at, updated_at, admin_id FROM workers WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw createNotFoundError('Worker');
  }

  const worker = result.rows[0];

  res.json({
    status: 'success',
    data: {
      worker: {
        id: worker.id,
        email: worker.email,
        firstName: worker.first_name,
        lastName: worker.last_name,
        role: worker.role,
        phone: worker.phone,
        isActive: worker.is_active,
        lastLogin: worker.last_login,
        createdAt: worker.created_at,
        updatedAt: worker.updated_at,
        adminId: worker.admin_id,
      },
    },
  });
}));

/**
 * POST /api/v1/workers
 * Create a new worker
 */
router.post('/', requireAdmin, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createWorkerSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { email, password, firstName, lastName, role, phone } = validationResult.data;

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

  // Create worker
  const result = await query(
    `INSERT INTO workers (email, password_hash, first_name, last_name, role, phone, admin_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, email, first_name, last_name, role, phone, is_active, created_at`,
    [email.toLowerCase(), passwordHash, firstName, lastName, role, phone, req.user!.id]
  );

  const worker = result.rows[0];

  res.status(201).json({
    status: 'success',
    message: 'Worker created successfully',
    data: {
      worker: {
        id: worker.id,
        email: worker.email,
        firstName: worker.first_name,
        lastName: worker.last_name,
        role: worker.role,
        phone: worker.phone,
        isActive: worker.is_active,
        createdAt: worker.created_at,
      },
    },
  });
}));

/**
 * PUT /api/v1/workers/:id
 * Update worker
 */
router.put('/:id', requireAdmin, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const validationResult = updateWorkerSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const updates = validationResult.data;

  // Check if worker exists
  const existingWorker = await query('SELECT id FROM workers WHERE id = $1', [id]);
  if (existingWorker.rows.length === 0) {
    throw createNotFoundError('Worker');
  }

  // Build update query
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      const dbField = key === 'firstName' ? 'first_name' :
                     key === 'lastName' ? 'last_name' :
                     key === 'isActive' ? 'is_active' : key;
      updateFields.push(`${dbField} = $${paramIndex}`);
      queryParams.push(value);
      paramIndex++;
    }
  });

  if (updateFields.length === 0) {
    throw createValidationError('No valid fields to update');
  }

  // Add updated_at
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

  // Update worker
  const result = await query(
    `UPDATE workers SET ${updateFields.join(', ')}
     WHERE id = $${paramIndex}
     RETURNING id, email, first_name, last_name, role, phone, is_active, updated_at`,
    [...queryParams, id]
  );

  const worker = result.rows[0];

  res.json({
    status: 'success',
    message: 'Worker updated successfully',
    data: {
      worker: {
        id: worker.id,
        email: worker.email,
        firstName: worker.first_name,
        lastName: worker.last_name,
        role: worker.role,
        phone: worker.phone,
        isActive: worker.is_active,
        updatedAt: worker.updated_at,
      },
    },
  });
}));

/**
 * DELETE /api/v1/workers/:id
 * Delete worker (soft delete by setting is_active to false)
 */
router.delete('/:id', requireAdmin, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if worker exists
  const existingWorker = await query('SELECT id, email FROM workers WHERE id = $1', [id]);
  if (existingWorker.rows.length === 0) {
    throw createNotFoundError('Worker');
  }

  // Prevent deleting self (if admin is also in workers table)
  if (id === req.user!.id) {
    throw new CustomError('Cannot delete your own account', 400);
  }

  // Soft delete worker
  await query(
    'UPDATE workers SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );

  res.json({
    status: 'success',
    message: 'Worker deleted successfully',
  });
}));

/**
 * GET /api/v1/workers/stats/overview
 * Get worker statistics
 */
router.get('/stats/overview', requireManagerOrAdmin, catchAsync(async (req: Request, res: Response) => {
  // Get worker counts by role
  const roleStats = await query(`
    SELECT role, COUNT(*) as count
    FROM workers
    WHERE is_active = true
    GROUP BY role
  `);

  // Get total workers
  const totalResult = await query('SELECT COUNT(*) as total FROM workers WHERE is_active = true');
  const totalWorkers = parseInt(totalResult.rows[0].total);

  // Get recent registrations (last 30 days)
  const recentResult = await query(`
    SELECT COUNT(*) as recent
    FROM workers
    WHERE is_active = true AND created_at >= NOW() - INTERVAL '30 days'
  `);
  const recentRegistrations = parseInt(recentResult.rows[0].recent);

  res.json({
    status: 'success',
    data: {
      totalWorkers,
      recentRegistrations,
      roleDistribution: roleStats.rows.reduce((acc, row) => {
        acc[row.role] = parseInt(row.count);
        return acc;
      }, {}),
    },
  });
}));

export default router;
