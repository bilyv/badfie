/**
 * Reports management routes
 * Handles report generation and analytics
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../config/database.js';
import { requireStaffOrHigher } from '../middleware/auth.js';
import { reportsRateLimiter } from '../middleware/rateLimiter.js';
import { 
  CustomError, 
  catchAsync, 
  createValidationError,
  createNotFoundError 
} from '../middleware/errorHandler.js';

const router = Router();

// Validation schemas
const reportQuerySchema = z.object({
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), 'Invalid start date'),
  endDate: z.string().refine(date => !isNaN(Date.parse(date)), 'Invalid end date'),
  groupBy: z.enum(['day', 'week', 'month']).optional().default('day'),
});

/**
 * GET /api/v1/reports/sales
 * Get sales report with analytics
 */
router.get('/sales', requireStaffOrHigher, reportsRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = reportQuerySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { startDate, endDate, groupBy } = validationResult.data;

  // Validate date range
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    throw createValidationError('Start date must be before end date');
  }

  // Get sales summary
  const summaryResult = await query(`
    SELECT 
      COUNT(*) as total_sales,
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COALESCE(AVG(total_amount), 0) as average_sale,
      COALESCE(SUM(tax_amount), 0) as total_tax,
      COALESCE(SUM(discount_amount), 0) as total_discounts
    FROM sales 
    WHERE sale_date >= $1 AND sale_date <= $2 AND payment_status = 'completed'
  `, [startDate, endDate]);

  // Get sales by time period
  let dateFormat;
  switch (groupBy) {
    case 'week':
      dateFormat = "DATE_TRUNC('week', sale_date)";
      break;
    case 'month':
      dateFormat = "DATE_TRUNC('month', sale_date)";
      break;
    default:
      dateFormat = "DATE(sale_date)";
  }

  const timeSeriesResult = await query(`
    SELECT 
      ${dateFormat} as period,
      COUNT(*) as sales_count,
      COALESCE(SUM(total_amount), 0) as revenue
    FROM sales 
    WHERE sale_date >= $1 AND sale_date <= $2 AND payment_status = 'completed'
    GROUP BY ${dateFormat}
    ORDER BY period
  `, [startDate, endDate]);

  // Get sales by payment method
  const paymentMethodResult = await query(`
    SELECT 
      payment_method,
      COUNT(*) as count,
      COALESCE(SUM(total_amount), 0) as total
    FROM sales 
    WHERE sale_date >= $1 AND sale_date <= $2 AND payment_status = 'completed'
    GROUP BY payment_method
    ORDER BY total DESC
  `, [startDate, endDate]);

  // Get top selling items
  const topItemsResult = await query(`
    SELECT 
      i.name,
      i.sku,
      SUM(si.quantity) as total_quantity,
      SUM(si.total_price) as total_revenue
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    JOIN inventory i ON si.inventory_id = i.id
    WHERE s.sale_date >= $1 AND s.sale_date <= $2 AND s.payment_status = 'completed'
    GROUP BY i.id, i.name, i.sku
    ORDER BY total_revenue DESC
    LIMIT 10
  `, [startDate, endDate]);

  const summary = summaryResult.rows[0];

  res.json({
    status: 'success',
    data: {
      summary: {
        totalSales: parseInt(summary.total_sales),
        totalRevenue: parseFloat(summary.total_revenue),
        averageSale: parseFloat(summary.average_sale),
        totalTax: parseFloat(summary.total_tax),
        totalDiscounts: parseFloat(summary.total_discounts),
      },
      timeSeries: timeSeriesResult.rows.map(row => ({
        period: row.period,
        salesCount: parseInt(row.sales_count),
        revenue: parseFloat(row.revenue),
      })),
      paymentMethods: paymentMethodResult.rows.map(row => ({
        method: row.payment_method,
        count: parseInt(row.count),
        total: parseFloat(row.total),
      })),
      topItems: topItemsResult.rows.map(row => ({
        name: row.name,
        sku: row.sku,
        totalQuantity: parseFloat(row.total_quantity),
        totalRevenue: parseFloat(row.total_revenue),
      })),
      dateRange: { startDate, endDate },
      groupBy,
    },
  });
}));

/**
 * GET /api/v1/reports/inventory
 * Get inventory report with analytics
 */
router.get('/inventory', requireStaffOrHigher, reportsRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Get inventory summary
  const summaryResult = await query(`
    SELECT 
      COUNT(*) as total_items,
      COALESCE(SUM(current_stock * cost_price), 0) as total_value,
      COUNT(CASE WHEN current_stock <= minimum_stock THEN 1 END) as low_stock_items,
      COUNT(CASE WHEN current_stock = 0 THEN 1 END) as out_of_stock_items
    FROM inventory 
    WHERE is_active = true
  `);

  // Get inventory by category
  const categoryResult = await query(`
    SELECT 
      c.name as category_name,
      c.color as category_color,
      COUNT(i.id) as item_count,
      COALESCE(SUM(i.current_stock * i.cost_price), 0) as total_value
    FROM categories c
    LEFT JOIN inventory i ON c.id = i.category_id AND i.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id, c.name, c.color
    ORDER BY total_value DESC
  `);

  // Get low stock items
  const lowStockResult = await query(`
    SELECT 
      i.name,
      i.sku,
      i.current_stock,
      i.minimum_stock,
      c.name as category_name
    FROM inventory i
    LEFT JOIN categories c ON i.category_id = c.id
    WHERE i.is_active = true AND i.current_stock <= i.minimum_stock
    ORDER BY (i.current_stock - i.minimum_stock) ASC
    LIMIT 20
  `);

  // Get expiring items (next 30 days)
  const expiringResult = await query(`
    SELECT 
      i.name,
      i.sku,
      i.expiry_date,
      i.current_stock,
      c.name as category_name
    FROM inventory i
    LEFT JOIN categories c ON i.category_id = c.id
    WHERE i.is_active = true 
      AND i.expiry_date IS NOT NULL 
      AND i.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
    ORDER BY i.expiry_date ASC
    LIMIT 20
  `);

  const summary = summaryResult.rows[0];

  res.json({
    status: 'success',
    data: {
      summary: {
        totalItems: parseInt(summary.total_items),
        totalValue: parseFloat(summary.total_value),
        lowStockItems: parseInt(summary.low_stock_items),
        outOfStockItems: parseInt(summary.out_of_stock_items),
      },
      categoryBreakdown: categoryResult.rows.map(row => ({
        categoryName: row.category_name,
        categoryColor: row.category_color,
        itemCount: parseInt(row.item_count),
        totalValue: parseFloat(row.total_value),
      })),
      lowStockItems: lowStockResult.rows.map(row => ({
        name: row.name,
        sku: row.sku,
        currentStock: parseFloat(row.current_stock),
        minimumStock: parseFloat(row.minimum_stock),
        categoryName: row.category_name,
      })),
      expiringItems: expiringResult.rows.map(row => ({
        name: row.name,
        sku: row.sku,
        expiryDate: row.expiry_date,
        currentStock: parseFloat(row.current_stock),
        categoryName: row.category_name,
      })),
    },
  });
}));

/**
 * GET /api/v1/reports/expenses
 * Get expenses report with analytics
 */
router.get('/expenses', requireStaffOrHigher, reportsRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = reportQuerySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { startDate, endDate, groupBy } = validationResult.data;

  // Get expenses summary
  const summaryResult = await query(`
    SELECT 
      COUNT(*) as total_expenses,
      COALESCE(SUM(amount), 0) as total_amount,
      COALESCE(AVG(amount), 0) as average_expense
    FROM expenses 
    WHERE expense_date >= $1 AND expense_date <= $2
  `, [startDate, endDate]);

  // Get expenses by category
  const categoryResult = await query(`
    SELECT 
      category,
      COUNT(*) as count,
      COALESCE(SUM(amount), 0) as total
    FROM expenses 
    WHERE expense_date >= $1 AND expense_date <= $2
    GROUP BY category
    ORDER BY total DESC
  `, [startDate, endDate]);

  // Get expenses by payment method
  const paymentMethodResult = await query(`
    SELECT 
      payment_method,
      COUNT(*) as count,
      COALESCE(SUM(amount), 0) as total
    FROM expenses 
    WHERE expense_date >= $1 AND expense_date <= $2
    GROUP BY payment_method
    ORDER BY total DESC
  `, [startDate, endDate]);

  // Get expenses by time period
  let dateFormat;
  switch (groupBy) {
    case 'week':
      dateFormat = "DATE_TRUNC('week', expense_date)";
      break;
    case 'month':
      dateFormat = "DATE_TRUNC('month', expense_date)";
      break;
    default:
      dateFormat = "DATE(expense_date)";
  }

  const timeSeriesResult = await query(`
    SELECT 
      ${dateFormat} as period,
      COUNT(*) as expense_count,
      COALESCE(SUM(amount), 0) as total_amount
    FROM expenses 
    WHERE expense_date >= $1 AND expense_date <= $2
    GROUP BY ${dateFormat}
    ORDER BY period
  `, [startDate, endDate]);

  const summary = summaryResult.rows[0];

  res.json({
    status: 'success',
    data: {
      summary: {
        totalExpenses: parseInt(summary.total_expenses),
        totalAmount: parseFloat(summary.total_amount),
        averageExpense: parseFloat(summary.average_expense),
      },
      categoryBreakdown: categoryResult.rows.map(row => ({
        category: row.category,
        count: parseInt(row.count),
        total: parseFloat(row.total),
      })),
      paymentMethods: paymentMethodResult.rows.map(row => ({
        method: row.payment_method,
        count: parseInt(row.count),
        total: parseFloat(row.total),
      })),
      timeSeries: timeSeriesResult.rows.map(row => ({
        period: row.period,
        expenseCount: parseInt(row.expense_count),
        totalAmount: parseFloat(row.total_amount),
      })),
      dateRange: { startDate, endDate },
      groupBy,
    },
  });
}));

/**
 * GET /api/v1/reports/profit-loss
 * Get profit and loss report
 */
router.get('/profit-loss', requireStaffOrHigher, reportsRateLimiter, catchAsync(async (req: Request, res: Response) => {
  // Validate query parameters
  const validationResult = reportQuerySchema.safeParse(req.query);
  if (!validationResult.success) {
    throw createValidationError(validationResult.error.errors[0].message);
  }

  const { startDate, endDate } = validationResult.data;

  // Get revenue
  const revenueResult = await query(`
    SELECT 
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COALESCE(SUM(tax_amount), 0) as total_tax
    FROM sales 
    WHERE sale_date >= $1 AND sale_date <= $2 AND payment_status = 'completed'
  `, [startDate, endDate]);

  // Get expenses
  const expensesResult = await query(`
    SELECT 
      COALESCE(SUM(amount), 0) as total_expenses
    FROM expenses 
    WHERE expense_date >= $1 AND expense_date <= $2
  `, [startDate, endDate]);

  // Get cost of goods sold (COGS)
  const cogsResult = await query(`
    SELECT 
      COALESCE(SUM(si.quantity * i.cost_price), 0) as total_cogs
    FROM sale_items si
    JOIN sales s ON si.sale_id = s.id
    JOIN inventory i ON si.inventory_id = i.id
    WHERE s.sale_date >= $1 AND s.sale_date <= $2 AND s.payment_status = 'completed'
  `, [startDate, endDate]);

  const revenue = parseFloat(revenueResult.rows[0].total_revenue);
  const tax = parseFloat(revenueResult.rows[0].total_tax);
  const expenses = parseFloat(expensesResult.rows[0].total_expenses);
  const cogs = parseFloat(cogsResult.rows[0].total_cogs);

  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - expenses;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  res.json({
    status: 'success',
    data: {
      revenue: {
        total: revenue,
        tax: tax,
        netRevenue: revenue - tax,
      },
      costs: {
        cogs,
        expenses,
        totalCosts: cogs + expenses,
      },
      profit: {
        gross: grossProfit,
        net: netProfit,
        grossMargin: Math.round(grossMargin * 100) / 100,
        netMargin: Math.round(netMargin * 100) / 100,
      },
      dateRange: { startDate, endDate },
    },
  });
}));

export default router;
