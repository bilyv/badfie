/**
 * Sales management routes
 * Handles sales transactions and reporting
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
const saleItemSchema = z.object({
  inventoryId: z.string().uuid('Invalid inventory ID'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
});

const createSaleSchema = z.object({
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  items: z.array(saleItemSchema).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['cash', 'card', 'digital', 'check']),
  discountAmount: z.number().min(0, 'Discount cannot be negative').default(0),
  notes: z.string().optional(),
});

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  search: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card', 'digital', 'check']).optional(),
  paymentStatus: z.enum(['pending', 'completed', 'refunded', 'cancelled']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * Generate unique sale number
 */
const generateSaleNumber = async (): Promise<string> => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Get count of sales today
  const countResult = await query(
    `SELECT COUNT(*) FROM sales WHERE DATE(sale_date) = CURRENT_DATE`
  );
  
  const count = parseInt(countResult.rows[0].count) + 1;
  return `SALE-${dateStr}-${count.toString().padStart(4, '0')}`;
};

/**
 * GET /api/v1/sales
 * Get all sales with pagination and filtering
 */
router.get('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = querySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { page = 1, limit = 10, search, paymentMethod, paymentStatus, startDate, endDate } = validationResult.data;
  const offset = (page - 1) * limit;

  // Build query conditions
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (search) {
    whereConditions.push(`(s.sale_number ILIKE $${paramIndex} OR s.customer_name ILIKE $${paramIndex} OR s.customer_email ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  if (paymentMethod) {
    whereConditions.push(`s.payment_method = $${paramIndex}`);
    queryParams.push(paymentMethod);
    paramIndex++;
  }

  if (paymentStatus) {
    whereConditions.push(`s.payment_status = $${paramIndex}`);
    queryParams.push(paymentStatus);
    paramIndex++;
  }

  if (startDate) {
    whereConditions.push(`s.sale_date >= $${paramIndex}`);
    queryParams.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    whereConditions.push(`s.sale_date <= $${paramIndex}`);
    queryParams.push(endDate);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM sales s ${whereClause}`,
    queryParams
  );
  const totalSales = parseInt(countResult.rows[0].count);

  // Get sales
  const salesResult = await query(
    `SELECT 
      s.id, s.sale_number, s.customer_name, s.customer_email, s.customer_phone,
      s.subtotal, s.tax_amount, s.discount_amount, s.total_amount,
      s.payment_method, s.payment_status, s.sale_date, s.notes, s.created_at,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM sales s
     LEFT JOIN users u ON s.created_by = u.id
     ${whereClause}
     ORDER BY s.sale_date DESC 
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...queryParams, limit, offset]
  );

  const sales = salesResult.rows.map(sale => ({
    id: sale.id,
    saleNumber: sale.sale_number,
    customer: {
      name: sale.customer_name,
      email: sale.customer_email,
      phone: sale.customer_phone,
    },
    subtotal: parseFloat(sale.subtotal),
    taxAmount: parseFloat(sale.tax_amount),
    discountAmount: parseFloat(sale.discount_amount),
    totalAmount: parseFloat(sale.total_amount),
    paymentMethod: sale.payment_method,
    paymentStatus: sale.payment_status,
    saleDate: sale.sale_date,
    notes: sale.notes,
    createdBy: sale.created_by_name,
    createdAt: sale.created_at,
  }));

  res.json({
    status: 'success',
    data: {
      sales,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSales / limit),
        totalSales,
        limit,
      },
    },
  });
}));

/**
 * GET /api/v1/sales/:id
 * Get sale by ID with items
 */
router.get('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get sale details
  const saleResult = await query(
    `SELECT 
      s.*,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM sales s
     LEFT JOIN users u ON s.created_by = u.id
     WHERE s.id = $1`,
    [id]
  );

  if (saleResult.rows.length === 0) {
    throw createNotFoundError('Sale');
  }

  const sale = saleResult.rows[0];

  // Get sale items
  const itemsResult = await query(
    `SELECT 
      si.id, si.quantity, si.unit_price, si.total_price,
      i.name as item_name, i.sku, i.unit_of_measure
     FROM sale_items si
     JOIN inventory i ON si.inventory_id = i.id
     WHERE si.sale_id = $1
     ORDER BY si.created_at`,
    [id]
  );

  const items = itemsResult.rows.map(item => ({
    id: item.id,
    name: item.item_name,
    sku: item.sku,
    unitOfMeasure: item.unit_of_measure,
    quantity: parseFloat(item.quantity),
    unitPrice: parseFloat(item.unit_price),
    totalPrice: parseFloat(item.total_price),
  }));

  res.json({
    status: 'success',
    data: {
      sale: {
        id: sale.id,
        saleNumber: sale.sale_number,
        customer: {
          name: sale.customer_name,
          email: sale.customer_email,
          phone: sale.customer_phone,
        },
        items,
        subtotal: parseFloat(sale.subtotal),
        taxAmount: parseFloat(sale.tax_amount),
        discountAmount: parseFloat(sale.discount_amount),
        totalAmount: parseFloat(sale.total_amount),
        paymentMethod: sale.payment_method,
        paymentStatus: sale.payment_status,
        saleDate: sale.sale_date,
        notes: sale.notes,
        createdBy: sale.created_by_name,
        createdAt: sale.created_at,
        updatedAt: sale.updated_at,
      },
    },
  });
}));

/**
 * POST /api/v1/sales
 * Create a new sale
 */
router.post('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createSaleSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { customerName, customerEmail, customerPhone, items, paymentMethod, discountAmount, notes } = validationResult.data;

  const result = await transaction(async (client) => {
    // Generate sale number
    const saleNumber = await generateSaleNumber();

    // Calculate totals
    let subtotal = 0;
    const validatedItems = [];

    // Validate items and check stock
    for (const item of items) {
      const inventoryResult = await client.query(
        'SELECT id, name, current_stock, selling_price FROM inventory WHERE id = $1 AND is_active = true',
        [item.inventoryId]
      );

      if (inventoryResult.rows.length === 0) {
        throw createNotFoundError(`Inventory item with ID ${item.inventoryId}`);
      }

      const inventoryItem = inventoryResult.rows[0];
      
      // Check stock availability
      if (parseFloat(inventoryItem.current_stock) < item.quantity) {
        throw new CustomError(`Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.current_stock}`, 400);
      }

      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;

      validatedItems.push({
        ...item,
        totalPrice,
        inventoryItem,
      });
    }

    // Calculate tax (assuming 10% tax rate - this should be configurable)
    const taxRate = 0.10;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount - discountAmount;

    // Create sale record
    const saleResult = await client.query(
      `INSERT INTO sales (
        sale_number, customer_name, customer_email, customer_phone,
        subtotal, tax_amount, discount_amount, total_amount,
        payment_method, payment_status, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        saleNumber, customerName, customerEmail, customerPhone,
        subtotal, taxAmount, discountAmount, totalAmount,
        paymentMethod, 'completed', notes, req.user!.id
      ]
    );

    const sale = saleResult.rows[0];

    // Create sale items and update inventory
    for (const item of validatedItems) {
      // Create sale item
      await client.query(
        `INSERT INTO sale_items (sale_id, inventory_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [sale.id, item.inventoryId, item.quantity, item.unitPrice, item.totalPrice]
      );

      // Update inventory stock
      await client.query(
        'UPDATE inventory SET current_stock = current_stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [item.quantity, item.inventoryId]
      );

      // Record stock movement
      await client.query(
        `INSERT INTO stock_movements (inventory_id, movement_type, quantity, reference_number, notes, created_by)
         VALUES ($1, 'out', $2, $3, $4, $5)`,
        [item.inventoryId, item.quantity, saleNumber, `Sale: ${saleNumber}`, req.user!.id]
      );
    }

    return sale;
  });

  res.status(201).json({
    status: 'success',
    message: 'Sale created successfully',
    data: {
      sale: {
        id: result.id,
        saleNumber: result.sale_number,
        totalAmount: parseFloat(result.total_amount),
        paymentMethod: result.payment_method,
        paymentStatus: result.payment_status,
        createdAt: result.created_at,
      },
    },
  });
}));

export default router;
