-- Migration: Add member_rank to user_profiles
-- This migration adds a star-based rank (1-5) to user profiles.

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS member_rank INTEGER DEFAULT 1 CHECK (member_rank BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

COMMENT ON COLUMN user_profiles.member_rank IS 'Member rank from 1 to 5 stars';
COMMENT ON COLUMN user_profiles.email IS 'User email for linking comments and profiles';

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
