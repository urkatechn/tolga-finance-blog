-- Migration: Add email notification tracking to posts table
-- Run this SQL in your Supabase SQL Editor to add email notification fields to existing installations

-- Add email notification fields to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS email_notification_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_notification_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for email notification tracking
CREATE INDEX IF NOT EXISTS idx_posts_email_notification_sent ON posts(email_notification_sent);

-- Add email notification settings if they don't exist
INSERT INTO settings (key, value, category, description) VALUES
  ('enable_email_notifications', 'true', 'general', 'Whether to send email notifications to subscribers when new posts are published'),
  ('notification_delay_minutes', '0', 'general', 'Delay in minutes before sending notifications after post publication (0 = immediate)'),
  ('notification_sender_name', '"Tolga Tangardigil"', 'general', 'Name shown as sender in notification emails'),
  ('notification_subject_template', '"New post: {title}"', 'general', 'Template for email subject line. Use {title} for post title placeholder')
ON CONFLICT (key) DO NOTHING;

-- Update any existing published posts to have email_notification_sent = false initially
-- This allows admins to manually send notifications for existing posts if desired
UPDATE posts 
SET email_notification_sent = FALSE 
WHERE email_notification_sent IS NULL;

COMMIT;