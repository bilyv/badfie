-- Inventory table schema for stock management
-- This file contains the schema definition for the inventory table

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Inventory table for stock management
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'piece', -- piece, kg, liter, etc.
    current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    maximum_stock DECIMAL(10,2),
    cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    location VARCHAR(100), -- Storage location
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory(name);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier ON inventory(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_is_active ON inventory(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_current_stock ON inventory(current_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_minimum_stock ON inventory(minimum_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry_date ON inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_inventory_created_at ON inventory(created_at);

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at 
    BEFORE UPDATE ON inventory 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE inventory IS 'Inventory items and stock management';
COMMENT ON COLUMN inventory.id IS 'Unique identifier for the inventory item';
COMMENT ON COLUMN inventory.name IS 'Name of the inventory item';
COMMENT ON COLUMN inventory.description IS 'Detailed description of the item';
COMMENT ON COLUMN inventory.sku IS 'Stock Keeping Unit (unique identifier)';
COMMENT ON COLUMN inventory.barcode IS 'Barcode for the item';
COMMENT ON COLUMN inventory.category_id IS 'Reference to the category table';
COMMENT ON COLUMN inventory.supplier_id IS 'Reference to the supplier table';
COMMENT ON COLUMN inventory.unit_of_measure IS 'Unit of measurement (piece, kg, liter, etc.)';
COMMENT ON COLUMN inventory.current_stock IS 'Current stock quantity';
COMMENT ON COLUMN inventory.minimum_stock IS 'Minimum stock level for reorder alerts';
COMMENT ON COLUMN inventory.maximum_stock IS 'Maximum stock level';
COMMENT ON COLUMN inventory.cost_price IS 'Cost price per unit';
COMMENT ON COLUMN inventory.selling_price IS 'Selling price per unit';
COMMENT ON COLUMN inventory.location IS 'Storage location in warehouse/restaurant';
COMMENT ON COLUMN inventory.expiry_date IS 'Expiry date for perishable items';
COMMENT ON COLUMN inventory.is_active IS 'Whether the item is active in the system';
COMMENT ON COLUMN inventory.created_by IS 'User who created this inventory item';
COMMENT ON COLUMN inventory.created_at IS 'Timestamp when item was created';
COMMENT ON COLUMN inventory.updated_at IS 'Timestamp when item was last updated';
