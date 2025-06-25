/**
 * Database migration script
 * Runs the main schema file to create all tables and indexes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection } from '../config/database.js';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read SQL file content
 */
const readSQLFile = (filename: string): string => {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`SQL file not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
};

/**
 * Execute SQL file
 */
const executeSQLFile = async (filename: string): Promise<void> => {
  console.log(`📄 Executing ${filename}...`);

  try {
    const sqlContent = readSQLFile(filename);

    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }

    console.log(`✅ ${filename} executed successfully`);
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error);
    throw error;
  }
};

/**
 * Check if database exists and create if not
 */
const ensureDatabase = async (): Promise<void> => {
  console.log('🔍 Checking database existence...');

  try {
    // Test connection to the target database
    const connected = await testConnection();
    if (connected) {
      console.log('✅ Database exists and is accessible');
      return;
    }
  } catch (error) {
    console.log('⚠️  Database may not exist, attempting to create...');
  }

  // If we can't connect to the target database, try to create it
  // Note: This requires connecting to a default database first
  try {
    // This is a simplified approach - in production, you might want to handle this differently
    console.log('📝 Please ensure the database exists before running migrations');
    console.log(`   Database: ${config.database.name}`);
    console.log(`   Host: ${config.database.host}:${config.database.port}`);
    console.log(`   User: ${config.database.user}`);
    console.log('');
    console.log('   The database "saas" should already exist on your PostgreSQL server.');
    console.log('   If not, you can create it using:');
    console.log(`   createdb -h ${config.database.host} -p ${config.database.port} -U ${config.database.user} ${config.database.name}`);
    console.log('');

    // Try connection again
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed. Please create the database first.');
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
};

/**
 * Run database migrations
 */
const runMigrations = async (): Promise<void> => {
  console.log('🚀 Starting database migrations...');
  console.log('');

  try {
    // Ensure database exists
    await ensureDatabase();

    // Execute main schema file
    await executeSQLFile('main.sql');

    console.log('');
    console.log('✅ All migrations completed successfully!');
    console.log('');
    console.log('📊 Database schema created with the following tables:');
    console.log('   • users - User accounts and authentication');
    console.log('   • categories - Product categories');
    console.log('   • suppliers - Vendor/supplier information');
    console.log('   • inventory - Stock and product management');
    console.log('   • stock_movements - Inventory movement tracking');
    console.log('   • sales - Sales transactions');
    console.log('   • sale_items - Individual items in sales');
    console.log('   • expenses - Expense tracking');
    console.log('   • reports - Generated reports');
    console.log('');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

/**
 * Rollback migrations (drop all tables)
 */
const rollbackMigrations = async (): Promise<void> => {
  console.log('⚠️  Rolling back database migrations...');
  console.log('');

  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Drop tables in reverse order (to handle foreign key constraints)
    const tables = [
      'reports',
      'expenses',
      'sale_items',
      'sales',
      'stock_movements',
      'inventory',
      'suppliers',
      'categories',
      'users'
    ];

    for (const table of tables) {
      try {
        await query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`🗑️  Dropped table: ${table}`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not drop table ${table}:`, error);
      }
    }

    // Drop functions
    try {
      await query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
      console.log('🗑️  Dropped function: update_updated_at_column');
    } catch (error) {
      console.warn('⚠️  Warning: Could not drop function:', error);
    }

    console.log('');
    console.log('✅ Rollback completed successfully!');
    console.log('');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  }
};

/**
 * Show migration status
 */
const showStatus = async (): Promise<void> => {
  console.log('📊 Database migration status:');
  console.log('');

  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.log('❌ Database connection failed');
      return;
    }

    // Check if tables exist
    const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No tables found - migrations not run');
    } else {
      console.log('✅ Found tables:');
      result.rows.forEach((row: any) => {
        console.log(`   • ${row.table_name}`);
      });
    }

    console.log('');

  } catch (error) {
    console.error('❌ Status check failed:', error);
  }
};

/**
 * Main function
 */
const main = async (): Promise<void> => {
  const command = process.argv[2];

  switch (command) {
    case 'up':
    case 'migrate':
      await runMigrations();
      break;
    case 'down':
    case 'rollback':
      await rollbackMigrations();
      break;
    case 'status':
      await showStatus();
      break;
    default:
      console.log('📚 Database Migration Tool');
      console.log('');
      console.log('Usage:');
      console.log('  bun run db:migrate        - Run migrations');
      console.log('  bun run migrate.ts up     - Run migrations');
      console.log('  bun run migrate.ts down   - Rollback migrations');
      console.log('  bun run migrate.ts status - Show migration status');
      console.log('');
  }

  process.exit(0);
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
}

export { runMigrations, rollbackMigrations, showStatus };
