/**
 * Expenses management routes
 * Handles expense tracking and categorization
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
const createExpenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  expenseDate: z.string().refine(date => !isNaN(Date.parse(date)), 'Invalid date format'),
  paymentMethod: z.enum(['cash', 'card', 'check', 'transfer']),
  receiptNumber: z.string().optional(),
  supplierId: z.string().uuid().optional(),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['weekly', 'monthly', 'yearly']).optional(),
  tags: z.array(z.string()).optional(),
});

const updateExpenseSchema = createExpenseSchema.partial();

const querySchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card', 'check', 'transfer']).optional(),
  supplierId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isRecurring: z.string().transform(val => val === 'true').optional(),
});

/**
 * GET /api/v1/expenses
 * Get all expenses with pagination and filtering
 */
router.get('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = querySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { 
    page = 1, 
    limit = 10, 
    search, 
    category, 
    paymentMethod, 
    supplierId, 
    startDate, 
    endDate, 
    isRecurring 
  } = validationResult.data;
  const offset = (page - 1) * limit;

  // Build query conditions
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (search) {
    whereConditions.push(`(e.title ILIKE $${paramIndex} OR e.description ILIKE $${paramIndex} OR e.receipt_number ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    whereConditions.push(`e.category = $${paramIndex}`);
    queryParams.push(category);
    paramIndex++;
  }

  if (paymentMethod) {
    whereConditions.push(`e.payment_method = $${paramIndex}`);
    queryParams.push(paymentMethod);
    paramIndex++;
  }

  if (supplierId) {
    whereConditions.push(`e.supplier_id = $${paramIndex}`);
    queryParams.push(supplierId);
    paramIndex++;
  }

  if (startDate) {
    whereConditions.push(`e.expense_date >= $${paramIndex}`);
    queryParams.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    whereConditions.push(`e.expense_date <= $${paramIndex}`);
    queryParams.push(endDate);
    paramIndex++;
  }

  if (isRecurring !== undefined) {
    whereConditions.push(`e.is_recurring = $${paramIndex}`);
    queryParams.push(isRecurring);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM expenses e ${whereClause}`,
    queryParams
  );
  const totalExpenses = parseInt(countResult.rows[0].count);

  // Get expenses with supplier info
  const expensesResult = await query(
    `SELECT 
      e.id, e.title, e.description, e.amount, e.category, e.expense_date,
      e.payment_method, e.receipt_number, e.is_recurring, e.recurring_frequency,
      e.tags, e.created_at, e.updated_at,
      s.name as supplier_name,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM expenses e
     LEFT JOIN suppliers s ON e.supplier_id = s.id
     LEFT JOIN users u ON e.created_by = u.id
     ${whereClause}
     ORDER BY e.expense_date DESC 
     LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...queryParams, limit, offset]
  );

  const expenses = expensesResult.rows.map(expense => ({
    id: expense.id,
    title: expense.title,
    description: expense.description,
    amount: parseFloat(expense.amount),
    category: expense.category,
    expenseDate: expense.expense_date,
    paymentMethod: expense.payment_method,
    receiptNumber: expense.receipt_number,
    isRecurring: expense.is_recurring,
    recurringFrequency: expense.recurring_frequency,
    tags: expense.tags || [],
    supplier: expense.supplier_name ? { name: expense.supplier_name } : null,
    createdBy: expense.created_by_name,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at,
  }));

  res.json({
    status: 'success',
    data: {
      expenses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalExpenses / limit),
        totalExpenses,
        limit,
      },
    },
  });
}));

/**
 * GET /api/v1/expenses/:id
 * Get expense by ID
 */
router.get('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT 
      e.*,
      s.name as supplier_name, s.contact_person as supplier_contact,
      u.first_name || ' ' || u.last_name as created_by_name
     FROM expenses e
     LEFT JOIN suppliers s ON e.supplier_id = s.id
     LEFT JOIN users u ON e.created_by = u.id
     WHERE e.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw createNotFoundError('Expense');
  }

  const expense = result.rows[0];

  res.json({
    status: 'success',
    data: {
      expense: {
        id: expense.id,
        title: expense.title,
        description: expense.description,
        amount: parseFloat(expense.amount),
        category: expense.category,
        expenseDate: expense.expense_date,
        paymentMethod: expense.payment_method,
        receiptNumber: expense.receipt_number,
        isRecurring: expense.is_recurring,
        recurringFrequency: expense.recurring_frequency,
        tags: expense.tags || [],
        supplier: expense.supplier_name ? {
          id: expense.supplier_id,
          name: expense.supplier_name,
          contactPerson: expense.supplier_contact,
        } : null,
        createdBy: expense.created_by_name,
        createdAt: expense.created_at,
        updatedAt: expense.updated_at,
      },
    },
  });
}));

/**
 * POST /api/v1/expenses
 * Create a new expense
 */
router.post('/', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Validate request body
  const validationResult = createExpenseSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const data = validationResult.data;

  // Create expense
  const result = await query(
    `INSERT INTO expenses (
      title, description, amount, category, expense_date, payment_method,
      receipt_number, supplier_id, is_recurring, recurring_frequency, tags, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      data.title, data.description, data.amount, data.category, data.expenseDate,
      data.paymentMethod, data.receiptNumber, data.supplierId, data.isRecurring,
      data.recurringFrequency, data.tags, req.user!.id
    ]
  );

  const expense = result.rows[0];

  res.status(201).json({
    status: 'success',
    message: 'Expense created successfully',
    data: {
      expense: {
        id: expense.id,
        title: expense.title,
        amount: parseFloat(expense.amount),
        category: expense.category,
        expenseDate: expense.expense_date,
        paymentMethod: expense.payment_method,
        createdAt: expense.created_at,
      },
    },
  });
}));

/**
 * PUT /api/v1/expenses/:id
 * Update expense
 */
router.put('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validate request body
  const validationResult = updateExpenseSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const updates = validationResult.data;

  // Check if expense exists
  const existingExpense = await query('SELECT id FROM expenses WHERE id = $1', [id]);
  if (existingExpense.rows.length === 0) {
    throw createNotFoundError('Expense');
  }

  // Build update query
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      const dbField = key === 'expenseDate' ? 'expense_date' : 
                     key === 'paymentMethod' ? 'payment_method' :
                     key === 'receiptNumber' ? 'receipt_number' :
                     key === 'supplierId' ? 'supplier_id' :
                     key === 'isRecurring' ? 'is_recurring' :
                     key === 'recurringFrequency' ? 'recurring_frequency' : key;
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

  // Update expense
  const result = await query(
    `UPDATE expenses SET ${updateFields.join(', ')} 
     WHERE id = $${paramIndex} 
     RETURNING *`,
    [...queryParams, id]
  );

  const expense = result.rows[0];

  res.json({
    status: 'success',
    message: 'Expense updated successfully',
    data: {
      expense: {
        id: expense.id,
        title: expense.title,
        amount: parseFloat(expense.amount),
        category: expense.category,
        expenseDate: expense.expense_date,
        updatedAt: expense.updated_at,
      },
    },
  });
}));

/**
 * DELETE /api/v1/expenses/:id
 * Delete expense
 */
router.delete('/:id', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if expense exists
  const existingExpense = await query('SELECT id FROM expenses WHERE id = $1', [id]);
  if (existingExpense.rows.length === 0) {
    throw createNotFoundError('Expense');
  }

  // Delete expense
  await query('DELETE FROM expenses WHERE id = $1', [id]);

  res.json({
    status: 'success',
    message: 'Expense deleted successfully',
  });
}));

/**
 * GET /api/v1/expenses/stats/summary
 * Get expense statistics
 */
router.get('/stats/summary', requireStaffOrHigher, catchAsync(async (req: Request, res: Response) => {
  // Get total expenses for current month
  const currentMonthResult = await query(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM expenses 
    WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE)
  `);

  // Get total expenses for previous month
  const previousMonthResult = await query(`
    SELECT COALESCE(SUM(amount), 0) as total
    FROM expenses 
    WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  `);

  // Get expenses by category for current month
  const categoryResult = await query(`
    SELECT category, SUM(amount) as total
    FROM expenses 
    WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY category
    ORDER BY total DESC
  `);

  // Get expenses by payment method for current month
  const paymentMethodResult = await query(`
    SELECT payment_method, SUM(amount) as total
    FROM expenses 
    WHERE DATE_TRUNC('month', expense_date) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY payment_method
    ORDER BY total DESC
  `);

  const currentMonthTotal = parseFloat(currentMonthResult.rows[0].total);
  const previousMonthTotal = parseFloat(previousMonthResult.rows[0].total);
  const percentageChange = previousMonthTotal > 0 
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;

  res.json({
    status: 'success',
    data: {
      currentMonthTotal,
      previousMonthTotal,
      percentageChange: Math.round(percentageChange * 100) / 100,
      categoryBreakdown: categoryResult.rows.map(row => ({
        category: row.category,
        total: parseFloat(row.total),
      })),
      paymentMethodBreakdown: paymentMethodResult.rows.map(row => ({
        paymentMethod: row.payment_method,
        total: parseFloat(row.total),
      })),
    },
  });
}));

export default router;
