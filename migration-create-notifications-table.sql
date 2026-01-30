-- Migration: Create notifications table for admin alerts
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- e.g., 'meeting_request', 'contact_form', 'new_user'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- RLS Policies

-- 1. Allow service role (API) to insert 
-- Note: Service role usually bypasses RLS, but explicit policy for clarity if needed
CREATE POLICY "Service role can do everything" ON public.notifications
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. Allow Admin to read and update notifications
-- Replace the email with the admin email from your settings
CREATE POLICY "Admins can view and update notifications" ON public.notifications
    FOR ALL
    USING (auth.jwt() ->> 'email' = 'info@tolgatanagardigil.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'info@tolgatanagardigil.com');

-- 3. Allow public to insert (optional, but keep it secure via API)
-- The API route uses createServiceClient which has service role privileges
-- So we DON'T need a public insert policy if we want to keep it strictly via API.
