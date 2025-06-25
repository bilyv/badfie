// Simple database connection test
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'saas',
  user: 'postgres',
  password: '7878',
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('📅 Server time:', result.rows[0].now);
    client.release();
    
    // Test if we can create a simple table
    const testClient = await pool.connect();
    await testClient.query('CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())');
    await testClient.query('DROP TABLE IF EXISTS test_connection');
    console.log('✅ Database permissions verified!');
    testClient.release();
    
    await pool.end();
    console.log('🎉 Database is ready for migrations!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('📋 Error details:', error);
    process.exit(1);
  }
}

testConnection();
