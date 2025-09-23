-- Complete Finance Blog Database Schema
-- Drop existing tables and recreate with all settings
-- Run this SQL in your Supabase SQL Editor to completely reset the database

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

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

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags TEXT, -- Comma-separated tags
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  comments_count INTEGER DEFAULT 0
);

-- Create settings table with JSONB for flexibility and category grouping
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB,
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'branding', 'social', 'authors', 'aboutme', 'contact')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  is_subscribed BOOLEAN,
  subscription_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  update_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  user_agent TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_spam BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES authors(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,
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
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_authors_is_default ON authors(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved) WHERE is_approved = true;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for comments (approved comments public read, authenticated write)
CREATE POLICY "Approved comments are viewable by everyone" ON comments
  FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');

CREATE POLICY "Comments are insertable by everyone" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Comments are updatable by authenticated users" ON comments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Comments are deletable by authenticated users" ON comments
  FOR DELETE USING (auth.role() = 'authenticated');

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

-- Insert comprehensive settings with all dynamic configuration options
INSERT INTO settings (key, value, category, description) VALUES
  -- Branding Settings (Header & Visual)
  ('site_title', '"Finance Blog"', 'branding', 'The main title of the website'),
  ('site_description', '"Your guide to financial freedom and wealth building"', 'branding', 'The description/tagline of the blog'),
  ('site_tagline', '"Your guide to financial freedom and wealth building"', 'branding', 'Subtitle/tagline displayed on the landing page'),
  ('site_keywords', '["finance", "investing", "money", "retirement", "blog"]', 'branding', 'SEO keywords for the site'),
  ('site_url', '"https://finance-blog.example.com"', 'branding', 'The main URL of the website'),
  ('site_brand_name', '"Finance Blog"', 'branding', 'The brand name shown in header and footer'),
  ('site_brand_initials', '"FB"', 'branding', 'Initials shown in the logo when no custom logo is set'),
  
  -- Visual Assets (Branding)
  ('site_logo_url', '""', 'branding', 'URL to the site logo image'),
  ('site_favicon_url', '"/favicon.ico"', 'branding', 'URL to the site favicon'),
  
  -- Hero Section Content (Branding)
  ('hero_title', '"Smart Financial Insights & Analysis"', 'branding', 'Main headline on the landing page'),
  ('hero_subtitle_primary', '"No need to endlessly search the internet anymore"', 'branding', 'Primary subtitle text on the landing page'),
  ('hero_subtitle_secondary', '"Let us identify and explain the important financial issues for you. Get expert insights on investing, personal finance, and market trends."', 'branding', 'Secondary subtitle text on hero section'),
  ('hero_cta_primary_text', '"Read Latest Articles"', 'branding', 'Primary call-to-action button text'),
  ('hero_cta_primary_link', '"/blog"', 'branding', 'Link for the primary CTA button'),
  ('hero_cta_secondary_text', '"Get Weekly Insights"', 'branding', 'Secondary call-to-action button text'),
  ('hero_cta_secondary_link', '"#newsletter"', 'branding', 'Link for the secondary CTA button'),
  
  -- Hero Stats (Branding - editable stats in hero section)
  ('hero_stats_articles_count', '"150+"', 'branding', 'Number of articles stat in hero'),
  ('hero_stats_articles_label', '"Expert Articles"', 'branding', 'Label for articles stat'),
  ('hero_stats_subscribers_count', '"25K+"', 'branding', 'Number of subscribers stat'),
  ('hero_stats_subscribers_label', '"Subscribers"', 'branding', 'Label for subscribers stat'),
  ('hero_stats_success_count', '"98%"', 'branding', 'Success rate stat'),
  ('hero_stats_success_label', '"Success Rate"', 'branding', 'Label for success rate stat'),
  
  -- Social Media Links (Social category)
  ('social_linkedin', '"https://www.linkedin.com/in/ttolgatan/"', 'social', 'LinkedIn profile URL'),
  ('social_twitter', '"@financeblog"', 'social', 'Twitter/X handle for social media'),
  ('social_github', '"https://github.com"', 'social', 'GitHub profile URL'),
  ('social_email', '"contact@financeblog.com"', 'social', 'Contact email address'),
  
  -- Brand Colors (Branding)
  ('brand_primary_color', '"#3B82F6"', 'branding', 'Primary brand color (hex)'),
  ('brand_secondary_color', '"#10B981"', 'branding', 'Secondary brand color (hex)'),
  ('brand_accent_color', '"#8B5CF6"', 'branding', 'Accent brand color (hex)'),
  
  -- Content Settings (General category)
  ('posts_per_page', '10', 'general', 'Number of posts to display per page'),
  ('enable_comments', 'true', 'general', 'Whether to enable comments on posts'),
  ('social_sharing', 'true', 'general', 'Whether to enable social media sharing buttons'),
  
  -- Newsletter Section (Branding)
  ('newsletter_title', '"Join the Journey"', 'branding', 'Title for newsletter signup section'),
  ('newsletter_description', '"Get my latest thoughts on investing, money, and life delivered weekly. No spam, no sales pitches - just honest insights from someone still figuring it out."', 'branding', 'Description for newsletter signup section'),
  
  -- Footer Content (Branding)
  ('footer_brand_description', '"Your friendly guide to making smarter financial decisions. No fluff, no get-rich-quick schemes - just honest insights from someone who has made plenty of mistakes so you do not have to."', 'branding', 'Brand description in footer'),
  ('footer_copyright_text', '"Made with ❤️ for better financial decisions."', 'branding', 'Copyright text in footer'),
  
  -- Landing Page "What You'll Find Here" Section (Branding)
  ('landing_section_title', '"What You''ll Find Here"', 'branding', 'Title for the features section on landing page'),
  ('landing_section_subtitle', '"Real financial advice from someone who has made the mistakes so you do not have to"', 'branding', 'Subtitle for features section'),
  
  -- Feature Cards (Branding - What You'll Find Here section)
  ('feature_1_title', '"Honest Investing"', 'branding', 'First feature card title'),
  ('feature_1_description', '"No get-rich-quick schemes. Just real strategies for building wealth over time, including the mistakes I made along the way."', 'branding', 'First feature card description'),
  ('feature_2_title', '"Money That Works"', 'branding', 'Second feature card title'),
  ('feature_2_description', '"Practical budgeting, saving, and debt strategies that actually fit into real life. No perfect spreadsheets required."', 'branding', 'Second feature card description'),
  ('feature_3_title', '"Simple Portfolios"', 'branding', 'Third feature card title'),
  ('feature_3_description', '"Build diversified portfolios without the complexity. Learn what works and what doesn''t from 12+ years of trial and error."', 'branding', 'Third feature card description'),
  
  -- SEO Meta Tags (Branding)
  ('meta_author', '"Finance Blog Team"', 'branding', 'Author meta tag'),
  ('meta_creator', '"Finance Blog Team"', 'branding', 'Creator meta tag'),
  ('meta_og_locale', '"en_US"', 'branding', 'Open Graph locale'),
  ('meta_og_type', '"website"', 'branding', 'Open Graph type'),
  ('meta_twitter_card', '"summary_large_image"', 'branding', 'Twitter card type'),
  ('meta_twitter_creator', '"@financeblog"', 'branding', 'Twitter creator handle'),
  
  -- About Me Page Settings (About Me category)
  -- Hero Section
  ('aboutme_hero_greeting', '"Hey, I''''m"', 'aboutme', 'Greeting text in about page hero'),
  ('aboutme_hero_title', '"Your Finance Friend"', 'aboutme', 'Main title in about page hero'),
  ('aboutme_hero_subtitle', '"Just someone who made a lot of financial mistakes so you don''''t have to. Here''''s my story."', 'aboutme', 'Subtitle text in about page hero'),
  
  -- Personal Stats Section
  ('aboutme_stats_years_value', '"12+"', 'aboutme', 'Years investing stat value'),
  ('aboutme_stats_years_label', '"Years Investing"', 'aboutme', 'Years investing stat label'),
  ('aboutme_stats_articles_value', '"150+"', 'aboutme', 'Articles written stat value'),
  ('aboutme_stats_articles_label', '"Articles Written"', 'aboutme', 'Articles written stat label'),
  ('aboutme_stats_coffee_value', '"∞"', 'aboutme', 'Coffee consumed stat value'),
  ('aboutme_stats_coffee_label', '"Coffee Consumed"', 'aboutme', 'Coffee consumed stat label'),
  
  -- My Story Section
  ('aboutme_story_title', '"My Financial Journey"', 'aboutme', 'Story section main title'),
  ('aboutme_story_subtitle', '"Like most people, I learned about money the hard way. Here''''s how I went from financial disasters to (hopefully) helpful insights."', 'aboutme', 'Story section subtitle'),
  ('aboutme_story_reality_title', '"The Reality Check"', 'aboutme', 'Reality check section title'),
  ('aboutme_story_reality_content1', '"I started investing in 2012 with zero knowledge and maximum confidence. Spoiler alert: it didn''''t go well. That first 30% loss taught me more than any textbook ever could."', 'aboutme', 'Reality check first paragraph'),
  ('aboutme_story_reality_content2', '"After years of mistakes, research, and slowly figuring things out, I realized that most financial advice is either too complex or too generic. So I started writing about what actually works in real life."', 'aboutme', 'Reality check second paragraph'),
  
  -- Journey Timeline (flexible only)
  -- Flexible journey timeline array (preferred)
  ('aboutme_journey_items', '[{"year":"2012","title":"First Investment","description":"Made my first stock purchase with $500 from my summer job. Lost 30% in the first month - learned my first lesson about research!"},{"year":"2015","title":"The Learning Phase","description":"Spent countless hours reading financial books, following market news, and making plenty of mistakes along the way."},{"year":"2018","title":"Finding My Strategy","description":"Developed a disciplined approach to investing focused on long-term value and diversification."},{"year":"2021","title":"Started Writing","description":"Began sharing my experiences and insights to help others avoid the mistakes I made early on."}]', 'aboutme', 'Flexible journey items as array of {year,title,description}'),
  
  -- What I Write About Section
  ('aboutme_topics_title', '"What I Actually Write About"', 'aboutme', 'Topics section title'),
  ('aboutme_topics_subtitle', '"No fluff, no get-rich-quick schemes. Just practical stuff that actually matters."', 'aboutme', 'Topics section subtitle'),
  
  -- Topic Cards
  ('aboutme_topic_investing_title', '"Investing Reality"', 'aboutme', 'Investing topic card title'),
  ('aboutme_topic_investing_description', '"Real talk about building wealth through investing. No day trading nonsense, just long-term strategies that work."', 'aboutme', 'Investing topic card description'),
  ('aboutme_topic_investing_tags', '["Portfolio Building", "Risk Management", "Market Psychology"]', 'aboutme', 'Investing topic tags array'),
  
  ('aboutme_topic_money_title', '"Money & Life"', 'aboutme', 'Money topic card title'),
  ('aboutme_topic_money_description', '"How to handle money without it taking over your life. Budgeting, saving, and financial planning that actually sticks."', 'aboutme', 'Money topic card description'),
  ('aboutme_topic_money_tags', '["Emergency Funds", "Debt Freedom", "Financial Goals"]', 'aboutme', 'Money topic tags array'),
  
  -- Let''s Connect Section
  ('aboutme_connect_title', '"Let''''s Connect"', 'aboutme', 'Connect section title'),
  ('aboutme_connect_subtitle', '"Got questions? Want to share your own financial wins or disasters? I''''d love to hear from you."', 'aboutme', 'Connect section subtitle'),
  ('aboutme_connect_quote', '"The best investment advice I ever got was from someone who admitted their mistakes. That''''s what I try to do here - share what works, what doesn''''t, and what I learned along the way."', 'aboutme', 'Connect section inspirational quote'),
  
  -- Newsletter Join Section (About Page specific)
  ('aboutme_newsletter_title', '"Join the Journey"', 'aboutme', 'About page newsletter section title'),
  ('aboutme_newsletter_description', '"Get my latest thoughts on investing, money, and life delivered weekly. No spam, just honest insights."', 'aboutme', 'About page newsletter section description')
ON CONFLICT (key) DO NOTHING;

-- Contact Page Settings
INSERT INTO settings (key, value, category, description) VALUES
  ('contact_hero_line1', '"Let’s Chat About"', 'contact', 'Contact hero first line'),
  ('contact_hero_title', '"Money & Life"', 'contact', 'Contact hero title'),
  ('contact_hero_subtitle', '"Got questions? Want to share your financial wins or disasters? Or maybe you just want to tell me I''''m completely wrong about something? I''''d love to hear from you."', 'contact', 'Contact hero subtitle'),
  ('contact_linkedin_card_title', '"LinkedIn"', 'contact', 'LinkedIn card title'),
  ('contact_linkedin_card_description', '"Connect with me professionally or send a quick message about finance topics."', 'contact', 'LinkedIn card description'),
  ('contact_linkedin_button_text', '"Connect"', 'contact', 'LinkedIn card button text'),
  ('contact_response_title', '"Response Time"', 'contact', 'Response time title'),
  ('contact_response_description', '"I usually respond within 24-48 hours. Sometimes faster if I''''m procrastinating on other work."', 'contact', 'Response time description'),
  ('contact_response_time', '"24-48h"', 'contact', 'Response time value'),
  ('contact_form_title', '"Send Me a Message"', 'contact', 'Form section title'),
  ('contact_form_description', '"Use this form if you prefer. I read every message, even if it''''s just to tell me my investment advice is terrible."', 'contact', 'Form section description'),
  ('contact_faq_title', '"Common Questions"', 'contact', 'FAQ section title'),
  ('contact_faq_subtitle', '"Before you reach out, here are some things people often ask about."', 'contact', 'FAQ section subtitle'),
  ('contact_faq_items', '[{"question":"Can you give me personal financial advice?","answer":"I''''m not a licensed financial advisor, so I can''''t give personalized advice. But I''''m happy to share general thoughts and point you toward good resources!"},{"question":"Want to collaborate or guest post?","answer":"I''''m always open to interesting collaborations! Send me your ideas and let''''s see if we can create something valuable together."},{"question":"How do you handle my information?","answer":"I respect your privacy. I won''''t share your email or information with anyone, and I definitely won''''t spam you with sales pitches."},{"question":"Can I suggest article topics?","answer":"Absolutely! I''''m always looking for new topics to explore. If there''''s something you''''re curious about, let me know."}]', 'contact', 'FAQ items as array of {question,answer}'),
  ('contact_faq_enabled', 'true', 'contact', 'Whether to show the FAQ section on contact page')
ON CONFLICT (key) DO NOTHING;

-- Set the default author ID after authors are created
INSERT INTO settings (key, value, category, description)
SELECT 'default_author_id', to_jsonb(id), 'general', 'The default author ID for new posts'
FROM authors WHERE is_default = true LIMIT 1
ON CONFLICT (key) DO NOTHING;
