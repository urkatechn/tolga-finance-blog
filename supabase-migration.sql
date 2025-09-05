-- Finance Blog Database Schema Migration
-- Run this SQL in your Supabase SQL Editor to set up the database schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Default blue color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID, -- Will be updated to reference authors table below
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create authors table for better author management
CREATE TABLE IF NOT EXISTS authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for settings
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_authors_is_default ON authors(is_default) WHERE is_default = true;

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Personal Finance', 'personal-finance', 'Tips and strategies for managing your personal finances', '#10B981'),
  ('Investing', 'investing', 'Investment strategies, market analysis, and portfolio management', '#3B82F6'),
  ('Retirement Planning', 'retirement-planning', 'Planning for your retirement and financial security', '#8B5CF6'),
  ('Market Analysis', 'market-analysis', 'Analysis of financial markets and economic trends', '#F59E0B'),
  ('Cryptocurrency', 'cryptocurrency', 'Digital currencies, blockchain technology, and crypto investing', '#EF4444')
ON CONFLICT (slug) DO NOTHING;

-- Insert default author
INSERT INTO authors (name, email, bio, is_default) VALUES
  ('Finance Blog Author', 'admin@financeblog.com', 'Welcome to our finance blog! I share insights about personal finance, investing, and wealth building.', true)
ON CONFLICT DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('site_title', '"Finance Blog"', 'The title of the blog site'),
  ('site_description', '"Your guide to financial freedom and wealth building"', 'The description/tagline of the blog'),
  ('posts_per_page', '10', 'Number of posts to display per page'),
  ('enable_comments', 'true', 'Whether to enable comments on posts'),
  ('social_sharing', 'true', 'Whether to enable social media sharing buttons')
ON CONFLICT (key) DO NOTHING;

-- Set the default author ID after authors are created
INSERT INTO settings (key, value, description)
SELECT 'default_author_id', to_jsonb(id), 'The default author ID for new posts'
FROM authors WHERE is_default = true LIMIT 1
ON CONFLICT (key) DO NOTHING;

-- Add foreign key constraint to posts.author_id referencing authors table
-- Note: This assumes you want posts to reference authors table instead of auth.users
-- If you have existing posts, you may need to migrate them first
ALTER TABLE posts 
DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

ALTER TABLE posts 
ADD CONSTRAINT posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL;

-- Create triggers for updated_at columns on new tables
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_authors_updated_at ON authors;
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read, authenticated write)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for posts
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Posts are insertable by authenticated users" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Posts are updatable by authenticated users" ON posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Posts are deletable by authenticated users" ON posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for settings (public read, authenticated write)
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Settings are insertable by authenticated users" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Settings are updatable by authenticated users" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Settings are deletable by authenticated users" ON settings
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for authors (public read, authenticated write)
CREATE POLICY "Authors are viewable by everyone" ON authors
  FOR SELECT USING (true);

CREATE POLICY "Authors are insertable by authenticated users" ON authors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors are updatable by authenticated users" ON authors
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authors are deletable by authenticated users" ON authors
  FOR DELETE USING (auth.role() = 'authenticated');
