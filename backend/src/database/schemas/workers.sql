-- Workers table schema for worker authentication and management
-- This file contains the schema definition for the workers table
-- Workers are managed by admins and have limited access to the system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workers table for worker authentication and management
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'worker' CHECK (role IN ('manager', 'worker', 'staff')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    admin_id UUID,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workers_email ON workers(email);
CREATE INDEX IF NOT EXISTS idx_workers_role ON workers(role);
CREATE INDEX IF NOT EXISTS idx_workers_is_active ON workers(is_active);
CREATE INDEX IF NOT EXISTS idx_workers_admin_id ON workers(admin_id);
CREATE INDEX IF NOT EXISTS idx_workers_created_at ON workers(created_at);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_workers_updated_at ON workers;
CREATE TRIGGER update_workers_updated_at
    BEFORE UPDATE ON workers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE workers IS 'Worker accounts for authentication and task management';
COMMENT ON COLUMN workers.id IS 'Unique identifier for the worker';
COMMENT ON COLUMN workers.email IS 'Worker email address (unique)';
COMMENT ON COLUMN workers.password_hash IS 'Hashed password for authentication';
COMMENT ON COLUMN workers.first_name IS 'Worker first name';
COMMENT ON COLUMN workers.last_name IS 'Worker last name';
COMMENT ON COLUMN workers.role IS 'Worker role: manager, worker, or staff';
COMMENT ON COLUMN workers.phone IS 'Worker phone number (optional)';
COMMENT ON COLUMN workers.is_active IS 'Whether the worker account is active';
COMMENT ON COLUMN workers.admin_id IS 'Reference to the admin who created this worker (no foreign key constraint)';
COMMENT ON COLUMN workers.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN workers.created_at IS 'Timestamp when worker was created';
COMMENT ON COLUMN workers.updated_at IS 'Timestamp when worker was last updated';