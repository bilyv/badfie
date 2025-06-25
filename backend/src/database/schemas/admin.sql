-- Admin table schema for admin authentication and management
-- This file contains the schema definition for the admin table
-- Admins have full access to the system and can manage workers

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin table for admin authentication and management
CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_super_admin BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin(email);
CREATE INDEX IF NOT EXISTS idx_admin_is_active ON admin(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_is_super_admin ON admin(is_super_admin);
CREATE INDEX IF NOT EXISTS idx_admin_created_at ON admin(created_at);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_admin_updated_at ON admin;
CREATE TRIGGER update_admin_updated_at 
    BEFORE UPDATE ON admin 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE admin IS 'Admin accounts for system administration and worker management';
COMMENT ON COLUMN admin.id IS 'Unique identifier for the admin';
COMMENT ON COLUMN admin.email IS 'Admin email address (unique)';
COMMENT ON COLUMN admin.password_hash IS 'Hashed password for authentication';
COMMENT ON COLUMN admin.first_name IS 'Admin first name';
COMMENT ON COLUMN admin.last_name IS 'Admin last name';
COMMENT ON COLUMN admin.phone IS 'Admin phone number (optional)';
COMMENT ON COLUMN admin.is_active IS 'Whether the admin account is active';
COMMENT ON COLUMN admin.is_super_admin IS 'Whether the admin has super admin privileges';
COMMENT ON COLUMN admin.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN admin.created_at IS 'Timestamp when the admin was created';
COMMENT ON COLUMN admin.updated_at IS 'Timestamp when the admin was last updated';

-- Insert default super admin (password: admin123)
-- Note: This should be changed in production
INSERT INTO admin (email, password_hash, first_name, last_name, is_super_admin, is_active)
VALUES (
    'admin@digitalstock.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', -- bcrypt hash for 'admin123'
    'Super',
    'Admin',
    true,
    true
) ON CONFLICT (email) DO NOTHING;
