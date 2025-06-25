/**
 * Suppliers management routes
 * Handles supplier/vendor CRUD operations
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
const createSupplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('USA'),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

const updateSupplierSchema = createSupplierSchema.partial();

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  search: z.string().optional(),
  isActive: z.string().transform(val => val === 'true').optional(),
});

/**
 * GET /api/v1/suppliers
 * Get all suppliers with pagination and filtering
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
  let whereConditions = [`s.is_active = $1`];
  let queryParams = [isActive];
  let paramIndex = 2;

  if (search) {
    whereConditions.push(`(s.name ILIKE $${paramIndex} OR s.contact_person ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM suppliers s ${whereClause}`,
    queryParams
  );
  const totalSuppliers = parseInt(countResult.rows[0].count);

  // Get suppliers with inventory item count
  const suppliersResult = await query(
    `SELECT 
      s.id, s.name, s.contact_person, s.email, s.phone, s.address, s.city, s.state,
      s.postal_code, s.country, s.tax_id, s.payment_terms, s.is_active, s.notes,
      s.created_at, s.updated_at,
      COUNT(i.id) as item_count,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM suppliers s
     LEFT JOIN inventory i ON s.id = i.supplier_id AND i.is_active = true
     LEFT JOIN users u ON s.created_by = u.id
     ${whereClause}
     GROUP BY s.id, s.name, s.contact_person, s.email, s.phone, s.address, s.city, s.state,
              s.postal_code, s.country, s.tax_id, s.payment_terms, s.is_active, s.notes,
              s.created_at, s.updated_at, u.first_name, u.last_name
     ORDER BY s.created_at DESC 
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...queryParams, limit, offset]
  );

  const suppliers = suppliersResult.rows.map(supplier => ({
    id: supplier.id,
    name: supplier.name,
    contactPerson: supplier.contact_person,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    city: supplier.city,
    state: supplier.state,
    postalCode: supplier.postal_code,
    country: supplier.country,
    taxId: supplier.tax_id,
    paymentTerms: supplier.payment_terms,
    isActive: supplier.is_active,
    notes: supplier.notes,
    itemCount: parseInt(supplier.item_count),
    createdBy: supplier.created_by_name,
    createdAt: supplier.created_at,
    updatedAt: supplier.updated_at,
  }));

  res.json({
    status: 'success',
    data: {
      suppliers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSuppliers / limit),
        totalSuppliers,
        limit,
      },
    },
  });
}));

/**
 * GET /api/v1/suppliers/:id
 * Get supplier by ID
 */
router.get('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT 
      s.*,
      COUNT(i.id) as item_count,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM suppliers s
     LEFT JOIN inventory i ON s.id = i.supplier_id AND i.is_active = true
     LEFT JOIN users u ON s.created_by = u.id
     WHERE s.id = $1
     GROUP BY s.id, s.name, s.contact_person, s.email, s.phone, s.address, s.city, s.state,
              s.postal_code, s.country, s.tax_id, s.payment_terms, s.is_active, s.notes,
              s.created_at, s.updated_at, u.first_name, u.last_name`,
    [id]
  );

  if (result.rows.length === 0) {
    throw createNotFoundError('Supplier');
  }

  const supplier = result.rows[0];

  res.json({
    status: 'success',
    data: {
      supplier: {
        id: supplier.id,
        name: supplier.name,
        contactPerson: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        city: supplier.city,
        state: supplier.state,
        postalCode: supplier.postal_code,
        country: supplier.country,
        taxId: supplier.tax_id,
        paymentTerms: supplier.payment_terms,
        isActive: supplier.is_active,
        notes: supplier.notes,
        itemCount: parseInt(supplier.item_count),
        createdBy: supplier.created_by_name,
        createdAt: supplier.created_at,
        updatedAt: supplier.updated_at,
      },
    },
  });
}));

/**
 * POST /api/v1/suppliers
 * Create a new supplier
 */
router.post('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createSupplierSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Check if supplier name already exists
  const existingSupplier = await query(
    'SELECT id FROM suppliers WHERE LOWER(name) = LOWER($1) AND is_active = true',
    [data.name]
  );

  if (existingSupplier.rows.length > 0) {
    throw new CustomError('Supplier with this name already exists', 409);
  }

  // Create supplier
  const result = await query(
    `INSERT INTO suppliers (
      name, contact_person, email, phone, address, city, state, postal_code,
      country, tax_id, payment_terms, notes, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
    RETURNING *`,
    [
      data.name, data.contactPerson, data.email, data.phone, data.address,
      data.city, data.state, data.postalCode, data.country, data.taxId,
      data.paymentTerms, data.notes, req.user!.id
    ]
  );

  const supplier = result.rows[0];

  res.status(201).json({
    status: 'success',
    message: 'Supplier created successfully',
    data: {
      supplier: {
        id: supplier.id,
        name: supplier.name,
        contactPerson: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        isActive: supplier.is_active,
        createdAt: supplier.created_at,
      },
    },
  });
}));

/**
 * PUT /api/v1/suppliers/:id
 * Update supplier
 */
router.put('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const validationResult = updateSupplierSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const updates = validationResult.data;

  // Check if supplier exists
  const existingSupplier = await query('SELECT id, name FROM suppliers WHERE id = $1', [id]);
  if (existingSupplier.rows.length === 0) {
    throw createNotFoundError('Supplier');
  }

  // Check if new name conflicts with existing supplier (if name is being updated)
  if (updates.name && updates.name !== existingSupplier.rows[0].name) {
    const nameConflict = await query(
      'SELECT id FROM suppliers WHERE LOWER(name) = LOWER($1) AND id != $2 AND is_active = true',
      [updates.name, id]
    );

    if (nameConflict.rows.length > 0) {
      throw new CustomError('Supplier with this name already exists', 409);
    }
  }

  // Build update query
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      const dbField = key === 'contactPerson' ? 'contact_person' :
                     key === 'postalCode' ? 'postal_code' :
                     key === 'taxId' ? 'tax_id' :
                     key === 'paymentTerms' ? 'payment_terms' : key;
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

  // Update supplier
  const result = await query(
    `UPDATE suppliers SET ${updateFields.join(', ')} 
     WHERE id = $${paramIndex} 
     RETURNING *`,
    [...queryParams, id]
  );

  const supplier = result.rows[0];

  res.json({
    status: 'success',
    message: 'Supplier updated successfully',
    data: {
      supplier: {
        id: supplier.id,
        name: supplier.name,
        contactPerson: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        isActive: supplier.is_active,
        updatedAt: supplier.updated_at,
      },
    },
  });
}));

/**
 * DELETE /api/v1/suppliers/:id
 * Delete supplier (soft delete)
 */
router.delete('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if supplier exists
  const existingSupplier = await query('SELECT id FROM suppliers WHERE id = $1', [id]);
  if (existingSupplier.rows.length === 0) {
    throw createNotFoundError('Supplier');
  }

  // Check if supplier has active inventory items
  const itemsResult = await query(
    'SELECT COUNT(*) FROM inventory WHERE supplier_id = $1 AND is_active = true',
    [id]
  );

  const itemCount = parseInt(itemsResult.rows[0].count);
  if (itemCount > 0) {
    throw new CustomError(`Cannot delete supplier. It has ${itemCount} active inventory items.`, 400);
  }

  // Soft delete supplier
  await query(
    'UPDATE suppliers SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
    [id]
  );

  res.json({
    status: 'success',
    message: 'Supplier deleted successfully',
  });
}));

export default router;
