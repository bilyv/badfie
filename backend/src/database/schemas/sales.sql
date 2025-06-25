-- Sales table schema for transaction records
-- This file contains the schema definition for sales and sale_items tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sales table for transaction records
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(200),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'digital', 'check')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'refunded', 'cancelled')),
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sale items table for individual items in a sale
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sales_number ON sales(sale_number);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_payment_method ON sales(payment_method);
CREATE INDEX IF NOT EXISTS idx_sales_payment_status ON sales(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_customer_email ON sales(customer_email);
CREATE INDEX IF NOT EXISTS idx_sales_created_by ON sales(created_by);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_inventory ON sale_items(inventory_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_created_at ON sale_items(created_at);

-- Apply updated_at trigger to sales table
DROP TRIGGER IF EXISTS update_sales_updated_at ON sales;
CREATE TRIGGER update_sales_updated_at 
    BEFORE UPDATE ON sales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE sales IS 'Sales transactions and customer orders';
COMMENT ON COLUMN sales.id IS 'Unique identifier for the sale';
COMMENT ON COLUMN sales.sale_number IS 'Unique sale number for reference';
COMMENT ON COLUMN sales.customer_name IS 'Customer name (optional)';
COMMENT ON COLUMN sales.customer_email IS 'Customer email (optional)';
COMMENT ON COLUMN sales.customer_phone IS 'Customer phone (optional)';
COMMENT ON COLUMN sales.subtotal IS 'Subtotal before tax and discount';
COMMENT ON COLUMN sales.tax_amount IS 'Tax amount applied';
COMMENT ON COLUMN sales.discount_amount IS 'Discount amount applied';
COMMENT ON COLUMN sales.total_amount IS 'Final total amount';
COMMENT ON COLUMN sales.payment_method IS 'Payment method used';
COMMENT ON COLUMN sales.payment_status IS 'Status of the payment';
COMMENT ON COLUMN sales.sale_date IS 'Date and time of the sale';
COMMENT ON COLUMN sales.notes IS 'Additional notes for the sale';
COMMENT ON COLUMN sales.created_by IS 'User who created this sale';
COMMENT ON COLUMN sales.created_at IS 'Timestamp when sale was created';
COMMENT ON COLUMN sales.updated_at IS 'Timestamp when sale was last updated';

COMMENT ON TABLE sale_items IS 'Individual items within a sale transaction';
COMMENT ON COLUMN sale_items.id IS 'Unique identifier for the sale item';
COMMENT ON COLUMN sale_items.sale_id IS 'Reference to the parent sale';
COMMENT ON COLUMN sale_items.inventory_id IS 'Reference to the inventory item';
COMMENT ON COLUMN sale_items.quantity IS 'Quantity of the item sold';
COMMENT ON COLUMN sale_items.unit_price IS 'Price per unit at time of sale';
COMMENT ON COLUMN sale_items.total_price IS 'Total price for this line item';
COMMENT ON COLUMN sale_items.created_at IS 'Timestamp when sale item was created';
