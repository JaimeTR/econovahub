-- ============================================
-- ECONOVA HUB - Database Schema MVP
-- PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: creators
-- Admin users and content creators
-- ============================================
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  photo_url TEXT,
  bio TEXT,
  profession VARCHAR(255),
  experience TEXT,
  social_links JSONB DEFAULT '{}',
  role VARCHAR(50) DEFAULT 'creator',          -- 'admin' or 'creator'
  slug VARCHAR(100) UNIQUE,                    -- Public URL handle (e.g., 'ambar-castro')
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: products
-- Digital products (plans) for sale
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  tagline VARCHAR(255),                        -- Short tagline for the card
  badge VARCHAR(100),                          -- e.g., "El más vendido"
  features JSONB DEFAULT '[]',                 -- Array of feature strings
  image_url TEXT,                              -- Product image
  file_url TEXT,                               -- Legacy single file URL
  files JSONB DEFAULT '[]',                    -- Array of {name, type, url, size}
  payment_url TEXT,                            -- Culqi Payment Link
  paypal_url TEXT,                             -- PayPal Payment Link
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(100) DEFAULT '',
  sort_order INT DEFAULT 0,                    -- Display order (Basic=1, Mid=2, Pro=3)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for active products listing
CREATE INDEX IF NOT EXISTS idx_products_active_sort
  ON products(is_active, sort_order);

-- ============================================
-- TABLE: customers
-- Buyers / end users
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email
  ON customers(email);

-- ============================================
-- TABLE: orders
-- Purchase transactions
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  customer_id UUID REFERENCES customers(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',        -- pending, completed, cancelled
  culqi_reference VARCHAR(255),                -- Culqi payment reference ID
  buyer_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_product
  ON orders(product_id);

CREATE INDEX IF NOT EXISTS idx_orders_customer
  ON orders(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_status
  ON orders(status);

-- ============================================
-- TABLE: downloads
-- Secure download tokens for digital files
-- ============================================
CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,               -- 72h from creation
  max_downloads INT DEFAULT 3,                 -- Max 3 downloads per token
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_downloads_token
  ON downloads(token);

CREATE INDEX IF NOT EXISTS idx_downloads_order
  ON downloads(order_id);

-- ============================================
-- TABLE: landing_pages
-- Multiple landing pages with product selection
-- ============================================
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  config JSONB DEFAULT '{}',
  product_ids TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
