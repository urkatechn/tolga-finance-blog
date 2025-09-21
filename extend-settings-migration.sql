-- Extended Settings Migration for Dynamic Blog Configuration
-- Run this SQL in your Supabase SQL Editor to add new settings

-- Insert additional settings for dynamic configuration
INSERT INTO settings (key, value, description) VALUES
  -- Site Branding & Appearance
  ('site_tagline', '"Your guide to financial freedom and wealth building"', 'Subtitle/tagline displayed on the landing page'),
  ('site_keywords', '["finance", "investing", "money", "retirement", "blog"]', 'SEO keywords for the site'),
  ('site_url', '"https://finance-blog.example.com"', 'The main URL of the website'),
  ('site_logo_url', '""', 'URL to the site logo image'),
  ('site_favicon_url', '"/favicon.ico"', 'URL to the site favicon'),
  ('site_brand_name', '"Finance Blog"', 'The brand name shown in header and footer'),
  ('site_brand_initials', '"FB"', 'Initials shown in the logo when no custom logo is set'),
  
  -- Hero Section Content
  ('hero_title', '"Smart Financial Insights & Analysis"', 'Main headline on the landing page'),
  ('hero_subtitle_primary', '"No need to endlessly search the internet anymore"', 'Primary subtitle text on the landing page'),
  ('hero_subtitle_secondary', '"Let us identify and explain the important financial issues for you. Get expert insights on investing, personal finance, and market trends."', 'Secondary subtitle text on hero section'),
  ('hero_cta_primary_text', '"Read Latest Articles"', 'Primary call-to-action button text'),
  ('hero_cta_primary_link', '"/blog"', 'Link for the primary CTA button'),
  ('hero_cta_secondary_text', '"Get Weekly Insights"', 'Secondary call-to-action button text'),
  ('hero_cta_secondary_link', '"#newsletter"', 'Link for the secondary CTA button'),
  
  -- Hero Stats (editable stats in hero section)
  ('hero_stats_articles_count', '"150+"', 'Number of articles stat in hero'),
  ('hero_stats_articles_label', '"Expert Articles"', 'Label for articles stat'),
  ('hero_stats_subscribers_count', '"25K+"', 'Number of subscribers stat'),
  ('hero_stats_subscribers_label', '"Subscribers"', 'Label for subscribers stat'),
  ('hero_stats_success_count', '"98%"', 'Success rate stat'),
  ('hero_stats_success_label', '"Success Rate"', 'Label for success rate stat'),
  
  -- Social Media Links
  ('social_twitter', '"@financeblog"', 'Twitter/X handle for social media'),
  ('social_linkedin', '"https://www.linkedin.com/in/ttolgatan/"', 'LinkedIn profile URL'),
  ('social_github', '"https://github.com"', 'GitHub profile URL'),
  ('social_email', '"contact@financeblog.com"', 'Contact email address'),
  
  -- Brand Colors
  ('brand_primary_color', '"#3B82F6"', 'Primary brand color (hex)'),
  ('brand_secondary_color', '"#10B981"', 'Secondary brand color (hex)'),
  ('brand_accent_color', '"#8B5CF6"', 'Accent brand color (hex)'),
  
  -- Newsletter Section
  ('newsletter_title', '"Join the Journey"', 'Title for newsletter signup section'),
  ('newsletter_description', '"Get my latest thoughts on investing, money, and life delivered weekly. No spam, no sales pitches - just honest insights from someone still figuring it out."', 'Description for newsletter signup section'),
  
  -- Footer Content
  ('footer_brand_description', '"Your friendly guide to making smarter financial decisions. No fluff, no get-rich-quick schemes - just honest insights from someone who has made plenty of mistakes so you do not have to."', 'Brand description in footer'),
  ('footer_copyright_text', '"Made with ❤️ for better financial decisions."', 'Copyright text in footer'),
  
  -- Landing Page "What You\'ll Find Here" Section
  ('landing_section_title', '"What You\'ll Find Here"', 'Title for the features section on landing page'),
  ('landing_section_subtitle', '"Real financial advice from someone who has made the mistakes so you do not have to"', 'Subtitle for features section'),
  
  -- Feature Cards (What You'll Find Here section)
  ('feature_1_title', '"Honest Investing"', 'First feature card title'),
  ('feature_1_description', '"No get-rich-quick schemes. Just real strategies for building wealth over time, including the mistakes I made along the way."', 'First feature card description'),
  ('feature_2_title', '"Money That Works"', 'Second feature card title'),
  ('feature_2_description', '"Practical budgeting, saving, and debt strategies that actually fit into real life. No perfect spreadsheets required."', 'Second feature card description'),
  ('feature_3_title', '"Simple Portfolios"', 'Third feature card title'),
  ('feature_3_description', '"Build diversified portfolios without the complexity. Learn what works and what doesn\'t from 12+ years of trial and error."', 'Third feature card description'),
  
  -- SEO Meta Tags
  ('meta_author', '"Finance Blog Team"', 'Author meta tag'),
  ('meta_creator', '"Finance Blog Team"', 'Creator meta tag'),
  ('meta_og_locale', '"en_US"', 'Open Graph locale'),
  ('meta_og_type', '"website"', 'Open Graph type'),
  ('meta_twitter_card', '"summary_large_image"', 'Twitter card type'),
  ('meta_twitter_creator', '"@financeblog"', 'Twitter creator handle')
  
ON CONFLICT (key) DO NOTHING;