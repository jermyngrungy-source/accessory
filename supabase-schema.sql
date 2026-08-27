-- ====================================================================
-- SUPABASE DATABASE SCHEMA FOR ARTISAN HAVEN
-- Handcrafted Minimalist Leather Goods & Accessories Marketplace
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Up Tables (If Re-running)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS seller_payouts CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Users Table (Sellers & Buyers with GCash credentials)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    gcash_number VARCHAR(20) NOT NULL,
    shop_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    headline VARCHAR(255),
    description TEXT NOT NULL,
    materials TEXT[] NOT NULL DEFAULT '{}',
    vibe VARCHAR(255) DEFAULT 'cozy, minimal, everyday street style',
    styling_suggestion TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    inventory INTEGER NOT NULL DEFAULT 1 CHECK (inventory >= 0),
    category VARCHAR(100) NOT NULL DEFAULT 'accessories',
    image_url TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Orders Table (Integrated with PayMongo & GCash)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_gcash VARCHAR(20),
    shipping_address TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'paymongo' CHECK (payment_method IN ('paymongo', 'gcash', 'card', 'paymaya')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    fulfillment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'processing', 'shipped', 'delivered')),
    paymongo_payment_id VARCHAR(255),
    paymongo_checkout_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Seller Payouts Table (GCash Settlement for Artisans)
CREATE TABLE seller_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    gcash_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'transferred', 'failed')),
    transferred_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Reviews Table (Star Ratings & Buyer Feedback)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Automatic Rating Calculation Trigger
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE product_id = NEW.product_id),
        reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id),
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();

-- 10. Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, authenticated sellers can insert/update their own
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Sellers can insert their own products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Sellers can update their own products" ON products FOR UPDATE USING (true);

-- Reviews: Everyone can read, buyers can insert reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Orders: Viewable by buyer and assigned sellers
CREATE POLICY "Orders are viewable by order owners" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders can be created during checkout" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Order items viewable by everyone" ON order_items FOR SELECT USING (true);
CREATE POLICY "Order items insertable on checkout" ON order_items FOR INSERT WITH CHECK (true);

-- Payouts: Viewable by sellers
CREATE POLICY "Payouts are viewable by assigned sellers" ON seller_payouts FOR SELECT USING (true);
CREATE POLICY "Payouts can be inserted" ON seller_payouts FOR INSERT WITH CHECK (true);

-- 11. Initial Seed Data (Artisan Haven Showcase)
INSERT INTO users (id, email, name, role, gcash_number, shop_name, bio, avatar_url)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'mateo@artisan-haven.ph',
    'Mateo Dela Cruz',
    'seller',
    '09171234567',
    'Artisan Haven Atelier',
    'Master leathercrafter specializing in traditional hand saddle-stitching and vegetable-tanned full-grain minimalist goods.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
);

INSERT INTO products (id, seller_id, title, headline, description, materials, vibe, styling_suggestion, price, inventory, category, image_url, rating, reviews_count, tags)
VALUES 
(
    'b2222222-2222-2222-2222-222222222221',
    'a1111111-1111-1111-1111-111111111111',
    'Minimalist Pueblo Bifold Wallet',
    'Timeless Patina, Uncompromising Hand-Stitched Durability',
    'Crafted from world-renowned Italian Badalassi Carlo Pueblo vegetable-tanned leather. Cut and hand-stitched with bonded Japanese poly-braid thread for generations of daily heirloom use.',
    ARRAY['Italian Badalassi Carlo Pueblo Leather', 'Japanese Bonded Polycord Thread', 'Natural Beeswax Edge Finish'],
    'Warm, minimal, everyday heritage carry',
    'Pairs effortlessly with raw denim, linen button-downs, or tailored neutrals for an understated everyday carry accent.',
    1850.00,
    14,
    'wallets',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    4.9,
    1,
    ARRAY['leather', 'wallet', 'minimalist', 'bifold', 'artisan']
),
(
    'b2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'Hand-Crafted Deep Indigo Macrame Bracelet',
    'Waterproof Resilience Meets Coastal Artisan Minimalism',
    'Braided by hand using ultra-durable nautical micro-cord anchored with a surgical-grade 316L stainless steel brushed magnetic clasp. Designed to withstand ocean salt, shower steam, and daily adventures.',
    ARRAY['Waterproof Nautical Cord', '316L Stainless Steel Clasp', 'Hand-Knotted Core'],
    'Cozy, coastal minimal, everyday street style',
    'Stack alongside an automatic field watch or wear standalone with a crisp white t-shirt and rolled cuffs.',
    650.00,
    28,
    'bracelets',
    'https://images.unsplash.com/photo-1611591477759-4d87455d3159?auto=format&fit=crop&w=800&q=80',
    5.0,
    1,
    ARRAY['bracelet', 'macrame', 'waterproof', 'accessories', 'handmade']
);

INSERT INTO reviews (product_id, buyer_name, rating, title, comment, verified_purchase)
VALUES
(
    'b2222222-2222-2222-2222-222222222221',
    'Sofia Ramirez',
    5,
    'Incredible leather smell and immaculate stitching!',
    'The Badalassi Carlo Pueblo leather has already started developing a gorgeous soft glow after just two weeks. The hand stitching is flawless.',
    true
),
(
    'b2222222-2222-2222-2222-222222222222',
    'Sofia Ramirez',
    5,
    'Never takes off in the shower or beach!',
    'The magnetic stainless steel clasp snaps with a satisfying click. Waterproof as promised and looks so minimal on wrist.',
    true
);
