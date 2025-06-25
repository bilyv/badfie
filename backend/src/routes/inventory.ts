/**
 * Inventory management routes
 * Handles inventory CRUD operations and stock management
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query, transaction } from '../config/database.js';
import { requireStaffOrHigher } from '../middleware/auth.js';
import { 
  CustomError, 
  catchAsync, 
  createValidationError,
  createNotFoundError 
} from '../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const createInventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  supplierId: z.string().uuid('Invalid supplier ID').optional(),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  currentStock: z.number().min(0, 'Current stock cannot be negative'),
  minimumStock: z.number().min(0, 'Minimum stock cannot be negative'),
  maximumStock: z.number().min(0, 'Maximum stock cannot be negative').optional(),
  costPrice: z.number().min(0, 'Cost price cannot be negative'),
  sellingPrice: z.number().min(0, 'Selling price cannot be negative'),
  location: z.string().optional(),
  expiryDate: z.string().optional(),
});

const updateInventorySchema = createInventorySchema.partial();

const stockMovementSchema = z.object({
  inventoryId: z.string().uuid('Invalid inventory ID'),
  movementType: z.enum(['in', 'out', 'adjustment', 'transfer']),
  quantity: z.number(),
  unitCost: z.number().min(0, 'Unit cost cannot be negative').optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  lowStock: z.string().transform(val => val === 'true').optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
});

/**
 * GET /api/v1/inventory
 * Get all inventory items with pagination and filtering
 */
router.get('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = querySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { page = 1, limit = 10, search, categoryId, supplierId, lowStock, isActive = true } = validationResult.data;
  const offset = (page - 1) * limit;

  // Build query conditions
  let whereConditions = [`i.is_active = $1`];
  let queryParams = [isActive];
  let paramIndex = 2;

  if (search) {
    whereConditions.push(`(i.name ILIKE $${paramIndex} OR i.sku ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  if (categoryId) {
    whereConditions.push(`i.category_id = $${paramIndex}`);
    queryParams.push(categoryId);
    paramIndex++;
  }

  if (supplierId) {
    whereConditions.push(`i.supplier_id = $${paramIndex}`);
    queryParams.push(supplierId);
    paramIndex++;
  }

  if (lowStock) {
    whereConditions.push(`i.current_stock <= i.minimum_stock`);
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM inventory i ${whereClause}`,
    queryParams
  );
  const totalItems = parseInt(countResult.rows[0].count);

  // Get inventory items with category and supplier info
  const itemsResult = await query(
    `SELECT 
      i.id, i.name, i.description, i.sku, i.barcode, i.unit_of_measure,
      i.current_stock, i.minimum_stock, i.maximum_stock, i.cost_price, i.selling_price,
      i.location, i.expiry_date, i.is_active, i.created_at, i.updated_at,
      c.name as category_name, c.color as category_color,
      s.name as supplier_name
     FROM inventory i
     LEFT JOIN categories c ON i.category_id = c.id
     LEFT JOIN suppliers s ON i.supplier_id = s.id
     ${whereClause}
     ORDER BY i.created_at DESC 
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...queryParams, limit, offset]
  );

  const items = itemsResult.rows.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    sku: item.sku,
    barcode: item.barcode,
    unitOfMeasure: item.unit_of_measure,
    currentStock: parseFloat(item.current_stock),
    minimumStock: parseFloat(item.minimum_stock),
    maximumStock: item.maximum_stock ? parseFloat(item.maximum_stock) : null,
    costPrice: parseFloat(item.cost_price),
    sellingPrice: parseFloat(item.selling_price),
    location: item.location,
    expiryDate: item.expiry_date,
    isActive: item.is_active,
    category: item.category_name ? {
      name: item.category_name,
      color: item.category_color,
    } : null,
    supplier: item.supplier_name ? {
      name: item.supplier_name,
    } : null,
    isLowStock: parseFloat(item.current_stock) <= parseFloat(item.minimum_stock),
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  res.json({
    status: 'success',
    data: {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        limit,
      },
    },
  });
}));

/**
 * GET /api/v1/inventory/:id
 * Get inventory item by ID
 */
router.get('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT 
      i.*, 
      c.name as category_name, c.color as category_color,
      s.name as supplier_name, s.contact_person as supplier_contact
     FROM inventory i
     LEFT JOIN categories c ON i.category_id = c.id
     LEFT JOIN suppliers s ON i.supplier_id = s.id
     WHERE i.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw createNotFoundError('Inventory item');
  }

  const item = result.rows[0];

  res.json({
    status: 'success',
    data: {
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
        sku: item.sku,
        barcode: item.barcode,
        unitOfMeasure: item.unit_of_measure,
        currentStock: parseFloat(item.current_stock),
        minimumStock: parseFloat(item.minimum_stock),
        maximumStock: item.maximum_stock ? parseFloat(item.maximum_stock) : null,
        costPrice: parseFloat(item.cost_price),
        sellingPrice: parseFloat(item.selling_price),
        location: item.location,
        expiryDate: item.expiry_date,
        isActive: item.is_active,
        category: item.category_name ? {
          id: item.category_id,
          name: item.category_name,
          color: item.category_color,
        } : null,
        supplier: item.supplier_name ? {
          id: item.supplier_id,
          name: item.supplier_name,
          contactPerson: item.supplier_contact,
        } : null,
        isLowStock: parseFloat(item.current_stock) <= parseFloat(item.minimum_stock),
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      },
    },
  });
}));

/**
 * POST /api/v1/inventory
 * Create a new inventory item
 */
router.post('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createInventorySchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Check if SKU already exists (if provided)
  if (data.sku) {
    const existingSku = await query('SELECT id FROM inventory WHERE sku = $1', [data.sku]);
    if (existingSku.rows.length > 0) {
      throw new CustomError('SKU already exists', 409);
    }
  }

  // Create inventory item
  const result = await query(
    `INSERT INTO inventory (
      name, description, sku, barcode, category_id, supplier_id, unit_of_measure,
      current_stock, minimum_stock, maximum_stock, cost_price, selling_price,
      location, expiry_date, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      data.name, data.description, data.sku, data.barcode, data.categoryId, data.supplierId,
      data.unitOfMeasure, data.currentStock, data.minimumStock, data.maximumStock,
      data.costPrice, data.sellingPrice, data.location, data.expiryDate, req.user!.id
    ]
  );

  const item = result.rows[0];

  res.status(201).json({
    status: 'success',
    message: 'Inventory item created successfully',
    data: {
      item: {
        id: item.id,
        name: item.name,
        sku: item.sku,
        currentStock: parseFloat(item.current_stock),
        minimumStock: parseFloat(item.minimum_stock),
        costPrice: parseFloat(item.cost_price),
        sellingPrice: parseFloat(item.selling_price),
        createdAt: item.created_at,
      },
    },
  });
}));

/**
 * POST /api/v1/inventory/stock-movement
 * Record stock movement
 */
router.post('/stock-movement', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = stockMovementSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { inventoryId, movementType, quantity, unitCost, referenceNumber, notes } = validationResult.data;

  await transaction(async (client) => {
    // Get current inventory item
    const inventoryResult = await client.query(
      'SELECT current_stock FROM inventory WHERE id = $1 AND is_active = true',
      [inventoryId]
    );

    if (inventoryResult.rows.length === 0) {
      throw createNotFoundError('Inventory item');
    }

    const currentStock = parseFloat(inventoryResult.rows[0].current_stock);
    let newStock = currentStock;

    // Calculate new stock based on movement type
    switch (movementType) {
      case 'in':
        newStock = currentStock + Math.abs(quantity);
        break;
      case 'out':
        newStock = currentStock - Math.abs(quantity);
        break;
      case 'adjustment':
        newStock = quantity; // Direct adjustment to specific quantity
        break;
      case 'transfer':
        newStock = currentStock - Math.abs(quantity);
        break;
    }

    // Prevent negative stock
    if (newStock < 0) {
      throw new CustomError('Insufficient stock for this operation', 400);
    }

    // Record stock movement
    await client.query(
      `INSERT INTO stock_movements (inventory_id, movement_type, quantity, unit_cost, reference_number, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [inventoryId, movementType, quantity, unitCost, referenceNumber, notes, req.user!.id]
    );

    // Update inventory stock
    await client.query(
      'UPDATE inventory SET current_stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newStock, inventoryId]
    );

    return { newStock, previousStock: currentStock };
  });

  res.json({
    status: 'success',
    message: 'Stock movement recorded successfully',
  });
}));

export default router;
