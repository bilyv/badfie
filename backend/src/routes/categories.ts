/**
 * Categories management routes
 * Handles product category CRUD operations
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { requireStaffOrHigher } from '../middleware/auth.js';
import { 
  CustomError, 
  catchAsync, 
  createValidationError,
  createNotFoundError 
} from '../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').default('#3B82F6'),
});

const updateCategorySchema = createCategorySchema.partial();

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  search: z.string().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
});

/**
 * GET /api/v1/categories
 * Get all categories with pagination and filtering
 */
router.get('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = querySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { page = 1, limit = 10, search, isActive = true } = validationResult.data;
  const offset = (page - 1) * limit;

  // Build query conditions
  let whereConditions = [`c.is_active = $1`];
  let queryParams = [isActive];
  let paramIndex = 2;

  if (search) {
    whereConditions.push(`(c.name ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM categories c ${whereClause}`,
    queryParams
  );
  const totalCategories = parseInt(countResult.rows[0].count);

  // Get categories with item count
  const categoriesResult = await query(
    `SELECT 
      c.id, c.name, c.description, c.color, c.is_active, c.created_at, c.updated_at,
      COUNT(i.id) as item_count,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM categories c
     LEFT JOIN inventory i ON c.id = i.category_id AND i.is_active = true
     LEFT JOIN users u ON c.created_by = u.id
     ${whereClause}
     GROUP BY c.id, c.name, c.description, c.color, c.is_active, c.created_at, c.updated_at, u.first_name, u.last_name
     ORDER BY c.created_at DESC 
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...queryParams, limit, offset]
  );

  const categories = categoriesResult.rows.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    color: category.color,
    isActive: category.is_active,
    itemCount: parseInt(category.item_count),
    createdBy: category.created_by_name,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  }));

  res.json({
    status: 'success',
    data: {
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        totalCategories,
        limit,
      },
    },
  });
}));

/**
 * GET /api/v1/categories/:id
 * Get category by ID
 */
router.get('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT 
      c.*,
      COUNT(i.id) as item_count,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM categories c
     LEFT JOIN inventory i ON c.id = i.category_id AND i.is_active = true
     LEFT JOIN users u ON c.created_by = u.id
     WHERE c.id = $1
     GROUP BY c.id, c.name, c.description, c.color, c.is_active, c.created_at, c.updated_at, u.first_name, u.last_name`,
    [id]
  );

  if (result.rows.length === 0) {
    throw createNotFoundError('Category');
  }

  const category = result.rows[0];

  res.json({
    status: 'success',
    data: {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        isActive: category.is_active,
        itemCount: parseInt(category.item_count),
        createdBy: category.created_by_name,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      },
    },
  });
}));

/**
 * POST /api/v1/categories
 * Create a new category
 */
router.post('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createCategorySchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { name, description, color } = validationResult.data;

  // Check if category name already exists
  const existingCategory = await query(
    'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND is_active = true',
    [name]
  );

  if (existingCategory.rows.length > 0) {
    throw new CustomError('Category with this name already exists', 409);
  }

  // Create category
  const result = await query(
    `INSERT INTO categories (name, description, color, created_by) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [name, description, color, req.user!.id]
  );

  const category = result.rows[0];

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        isActive: category.is_active,
        createdAt: category.created_at,
      },
    },
  });
}));

/**
 * PUT /api/v1/categories/:id
 * Update category
 */
router.put('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const validationResult = updateCategorySchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const updates = validationResult.data;

  // Check if category exists
  const existingCategory = await query('SELECT id, name FROM categories WHERE id = $1', [id]);
  if (existingCategory.rows.length === 0) {
    throw createNotFoundError('Category');
  }

  // Check if new name conflicts with existing category (if name is being updated)
  if (updates.name && updates.name !== existingCategory.rows[0].name) {
    const nameConflict = await query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2 AND is_active = true',
      [updates.name, id]
    );

    if (nameConflict.rows.length > 0) {
      throw new CustomError('Category with this name already exists', 409);
    }
  }

  // Build update query
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`${key} = $${paramIndex}`);
      queryParams.push(value);
      paramIndex++;
    }
  });

  if (updateFields.length === 0) {
    throw createValidationError('No valid fields to update');
  }

  // Add updated_at
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

  // Update category
  const result = await query(
    `UPDATE categories SET ${updateFields.join(', ')} 
     WHERE id = $${paramIndex} 
     RETURNING *`,
    [...queryParams, id]
  );

  const category = result.rows[0];

  res.json({
    status: 'success',
    message: 'Category updated successfully',
    data: {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        isActive: category.is_active,
        updatedAt: category.updated_at,
      },
    },
  });
}));

/**
 * DELETE /api/v1/categories/:id
 * Delete category (soft delete)
 */
router.delete('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if category exists
  const existingCategory = await query('SELECT id FROM categories WHERE id = $1', [id]);
  if (existingCategory.rows.length === 0) {
    throw createNotFoundError('Category');
  }

  // Check if category has active inventory items
  const itemsResult = await query(
    'SELECT COUNT(*) FROM inventory WHERE category_id = $1 AND is_active = true',
    [id]
  );

  const itemCount = parseInt(itemsResult.rows[0].count);
  if (itemCount > 0) {
    throw new CustomError(`Cannot delete category. It has ${itemCount} active inventory items.`, 400);
  }

  // Soft delete category
  await query(
    'UPDATE categories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );

  res.json({
    status: 'success',
    message: 'Category deleted successfully',
  });
}));

/**
 * GET /api/v1/categories/stats/overview
 * Get category statistics
 */
router.get('/stats/overview', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Get total categories
  const totalResult = await query('SELECT COUNT(*) as total FROM categories WHERE is_active = true');
  const totalCategories = parseInt(totalResult.rows[0].total);

  // Get categories with most items
  const topCategoriesResult = await query(`
    SELECT 
      c.name, c.color, COUNT(i.id) as item_count
    FROM categories c
    LEFT JOIN inventory i ON c.id = i.category_id AND i.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id, c.name, c.color
    ORDER BY item_count DESC
    LIMIT 5
  `);

  // Get categories with low stock items
  const lowStockCategoriesResult = await query(`
    SELECT 
      c.name, COUNT(i.id) as low_stock_items
    FROM categories c
    JOIN inventory i ON c.id = i.category_id 
    WHERE c.is_active = true AND i.is_active = true AND i.current_stock <= i.minimum_stock
    GROUP BY c.id, c.name
    ORDER BY low_stock_items DESC
  `);

  res.json({
    status: 'success',
    data: {
      totalCategories,
      topCategories: topCategoriesResult.rows.map(row => ({
        name: row.name,
        color: row.color,
        itemCount: parseInt(row.item_count),
      })),
      lowStockCategories: lowStockCategoriesResult.rows.map(row => ({
        name: row.name,
        lowStockItems: parseInt(row.low_stock_items),
      })),
    },
  });
}));

export default router;
