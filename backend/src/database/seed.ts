/**
 * Database seeding script
 * Populates the database with sample data for development and testing
 */

import bcrypt from 'bcryptjs';
import { query, transaction, testConnection } from '../config/database.js';

/**
 * Seed users table
 */
const seedUsers = async (): Promise<void> => {
  console.log('👥 Seeding users...');

  const users = [
    {
      email: 'admin@digitalstock.com',
      password: 'admin123456',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1-555-0001',
    },
    {
      email: 'manager@digitalstock.com',
      password: 'manager123456',
      firstName: 'Manager',
      lastName: 'User',
      role: 'manager',
      phone: '+1-555-0002',
    },
    {
      email: 'staff@digitalstock.com',
      password: 'staff123456',
      firstName: 'Staff',
      lastName: 'User',
      role: 'staff',
      phone: '+1-555-0003',
    },
  ];

  for (const user of users) {
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [user.email]);
    
    if (existing.rows.length === 0) {
      const passwordHash = await bcrypt.hash(user.password, 12);
      
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.email, passwordHash, user.firstName, user.lastName, user.role, user.phone]
      );
      
      console.log(`   ✅ Created user: ${user.email} (${user.role})`);
    } else {
      console.log(`   ⚠️  User already exists: ${user.email}`);
    }
  }
};

/**
 * Seed categories table
 */
const seedCategories = async (): Promise<void> => {
  console.log('📂 Seeding categories...');

  const categories = [
    { name: 'Beverages', description: 'Drinks and beverages', color: '#3B82F6' },
    { name: 'Food Items', description: 'Food products and ingredients', color: '#10B981' },
    { name: 'Cleaning Supplies', description: 'Cleaning and maintenance supplies', color: '#F59E0B' },
    { name: 'Kitchen Equipment', description: 'Kitchen tools and equipment', color: '#EF4444' },
    { name: 'Packaging', description: 'Packaging materials and containers', color: '#8B5CF6' },
    { name: 'Office Supplies', description: 'Office and administrative supplies', color: '#06B6D4' },
  ];

  for (const category of categories) {
    const existing = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [category.name]);
    
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO categories (name, description, color)
         VALUES ($1, $2, $3)`,
        [category.name, category.description, category.color]
      );
      
      console.log(`   ✅ Created category: ${category.name}`);
    } else {
      console.log(`   ⚠️  Category already exists: ${category.name}`);
    }
  }
};

/**
 * Seed suppliers table
 */
const seedSuppliers = async (): Promise<void> => {
  console.log('🏢 Seeding suppliers...');

  const suppliers = [
    {
      name: 'Fresh Foods Distributor',
      contactPerson: 'John Smith',
      email: 'orders@freshfoods.com',
      phone: '+1-555-1001',
      address: '123 Distribution Way',
      city: 'Food City',
      state: 'CA',
      postalCode: '90210',
      paymentTerms: 'Net 30',
    },
    {
      name: 'Beverage Supply Co',
      contactPerson: 'Sarah Johnson',
      email: 'sales@beveragesupply.com',
      phone: '+1-555-1002',
      address: '456 Drink Street',
      city: 'Beverage Town',
      state: 'NY',
      postalCode: '10001',
      paymentTerms: 'Net 15',
    },
    {
      name: 'Kitchen Equipment Plus',
      contactPerson: 'Mike Wilson',
      email: 'info@kitchenequipment.com',
      phone: '+1-555-1003',
      address: '789 Equipment Blvd',
      city: 'Tool City',
      state: 'TX',
      postalCode: '75001',
      paymentTerms: 'Net 45',
    },
  ];

  for (const supplier of suppliers) {
    const existing = await query('SELECT id FROM suppliers WHERE LOWER(name) = LOWER($1)', [supplier.name]);
    
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO suppliers (name, contact_person, email, phone, address, city, state, postal_code, payment_terms)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          supplier.name, supplier.contactPerson, supplier.email, supplier.phone,
          supplier.address, supplier.city, supplier.state, supplier.postalCode, supplier.paymentTerms
        ]
      );
      
      console.log(`   ✅ Created supplier: ${supplier.name}`);
    } else {
      console.log(`   ⚠️  Supplier already exists: ${supplier.name}`);
    }
  }
};

/**
 * Seed inventory table
 */
const seedInventory = async (): Promise<void> => {
  console.log('📦 Seeding inventory...');

  // Get category and supplier IDs
  const categoriesResult = await query('SELECT id, name FROM categories ORDER BY name');
  const suppliersResult = await query('SELECT id, name FROM suppliers ORDER BY name');
  
  const categories = categoriesResult.rows;
  const suppliers = suppliersResult.rows;

  if (categories.length === 0 || suppliers.length === 0) {
    console.log('   ⚠️  No categories or suppliers found. Skipping inventory seeding.');
    return;
  }

  const beverageCategory = categories.find(c => c.name === 'Beverages');
  const foodCategory = categories.find(c => c.name === 'Food Items');
  const cleaningCategory = categories.find(c => c.name === 'Cleaning Supplies');

  const freshFoodsSupplier = suppliers.find(s => s.name === 'Fresh Foods Distributor');
  const beverageSupplier = suppliers.find(s => s.name === 'Beverage Supply Co');

  const inventoryItems = [
    {
      name: 'Coca Cola 12oz Cans',
      description: '12oz Coca Cola cans, case of 24',
      sku: 'COKE-12OZ-24',
      categoryId: beverageCategory?.id,
      supplierId: beverageSupplier?.id,
      unitOfMeasure: 'case',
      currentStock: 50,
      minimumStock: 10,
      maximumStock: 100,
      costPrice: 8.50,
      sellingPrice: 1.25,
      location: 'Beverage Cooler A1',
    },
    {
      name: 'Ground Beef 80/20',
      description: 'Fresh ground beef, 80% lean',
      sku: 'BEEF-GROUND-8020',
      categoryId: foodCategory?.id,
      supplierId: freshFoodsSupplier?.id,
      unitOfMeasure: 'lb',
      currentStock: 25,
      minimumStock: 5,
      maximumStock: 50,
      costPrice: 4.99,
      sellingPrice: 7.99,
      location: 'Freezer B2',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    },
    {
      name: 'All-Purpose Cleaner',
      description: 'Multi-surface cleaning spray',
      sku: 'CLEAN-APC-32OZ',
      categoryId: cleaningCategory?.id,
      supplierId: suppliers[0]?.id,
      unitOfMeasure: 'bottle',
      currentStock: 15,
      minimumStock: 5,
      maximumStock: 30,
      costPrice: 3.25,
      sellingPrice: 5.99,
      location: 'Storage Room C1',
    },
    {
      name: 'French Fries - Frozen',
      description: 'Frozen french fries, 5lb bag',
      sku: 'FRIES-FROZEN-5LB',
      categoryId: foodCategory?.id,
      supplierId: freshFoodsSupplier?.id,
      unitOfMeasure: 'bag',
      currentStock: 8,
      minimumStock: 10, // This will be low stock
      maximumStock: 25,
      costPrice: 2.75,
      sellingPrice: 4.99,
      location: 'Freezer B1',
    },
  ];

  for (const item of inventoryItems) {
    const existing = await query('SELECT id FROM inventory WHERE sku = $1', [item.sku]);
    
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO inventory (
          name, description, sku, category_id, supplier_id, unit_of_measure,
          current_stock, minimum_stock, maximum_stock, cost_price, selling_price,
          location, expiry_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          item.name, item.description, item.sku, item.categoryId, item.supplierId,
          item.unitOfMeasure, item.currentStock, item.minimumStock, item.maximumStock,
          item.costPrice, item.sellingPrice, item.location, item.expiryDate
        ]
      );
      
      console.log(`   ✅ Created inventory item: ${item.name}`);
    } else {
      console.log(`   ⚠️  Inventory item already exists: ${item.sku}`);
    }
  }
};

/**
 * Seed sample expenses
 */
const seedExpenses = async (): Promise<void> => {
  console.log('💰 Seeding expenses...');

  const expenses = [
    {
      title: 'Monthly Rent',
      description: 'Restaurant space rental',
      amount: 3500.00,
      category: 'Rent',
      paymentMethod: 'check',
      isRecurring: true,
      recurringFrequency: 'monthly',
    },
    {
      title: 'Electricity Bill',
      description: 'Monthly electricity usage',
      amount: 450.75,
      category: 'Utilities',
      paymentMethod: 'card',
      isRecurring: true,
      recurringFrequency: 'monthly',
    },
    {
      title: 'Kitchen Equipment Repair',
      description: 'Repair of commercial oven',
      amount: 275.00,
      category: 'Maintenance',
      paymentMethod: 'cash',
      isRecurring: false,
    },
  ];

  for (const expense of expenses) {
    await query(
      `INSERT INTO expenses (
        title, description, amount, category, expense_date, payment_method,
        is_recurring, recurring_frequency
      ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7)`,
      [
        expense.title, expense.description, expense.amount, expense.category,
        expense.paymentMethod, expense.isRecurring, expense.recurringFrequency
      ]
    );
    
    console.log(`   ✅ Created expense: ${expense.title}`);
  }
};

/**
 * Main seeding function
 */
const seedDatabase = async (): Promise<void> => {
  console.log('🌱 Starting database seeding...');
  console.log('');

  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    await transaction(async () => {
      await seedUsers();
      await seedCategories();
      await seedSuppliers();
      await seedInventory();
      await seedExpenses();
    });

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('🔑 Default user accounts created:');
    console.log('   • admin@digitalstock.com / admin123456 (Admin)');
    console.log('   • manager@digitalstock.com / manager123456 (Manager)');
    console.log('   • staff@digitalstock.com / staff123456 (Staff)');
    console.log('');
    console.log('📊 Sample data created:');
    console.log('   • 6 product categories');
    console.log('   • 3 suppliers');
    console.log('   • 4 inventory items (including low stock item)');
    console.log('   • 3 sample expenses');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding script failed:', error);
    process.exit(1);
  });
}

export { seedDatabase };
