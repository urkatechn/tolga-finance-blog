-- Database Schema for Likes and Comments System
-- This extends the existing blog schema with engagement features

-- Post Likes Table
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL, -- IP address or session ID for anonymous users
    user_agent TEXT, -- Browser info for additional tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate likes from same user/IP
    UNIQUE(post_id, user_identifier)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For reply threading
    
    -- Author information (anonymous users)
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255), -- Optional, for Gravatar
    author_ip INET NOT NULL, -- For moderation and spam prevention
    user_agent TEXT, -- Browser info
    
    -- Content
    content TEXT NOT NULL,
    
    -- Moderation
    is_approved BOOLEAN DEFAULT FALSE,
    is_spam BOOLEAN DEFAULT FALSE,
    moderated_by UUID REFERENCES authors(id), -- Admin who approved/rejected
    moderated_at TIMESTAMP WITH TIME ZONE,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment Likes Table
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL, -- IP address or session ID
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate likes
    UNIQUE(comment_id, user_identifier)
);

-- Add likes_count column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_identifier ON post_likes(user_identifier);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_author_ip ON comments(author_ip);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_identifier ON comment_likes(user_identifier);

-- Functions to update counters automatically
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts 
        SET likes_count = GREATEST(0, likes_count - 1) 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE comments 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE comments 
        SET likes_count = GREATEST(0, likes_count - 1) 
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Only count top-level comments (not replies)
        IF NEW.parent_id IS NULL THEN
            UPDATE posts 
            SET comments_count = comments_count + 1 
            WHERE id = NEW.post_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Only count top-level comments (not replies)
        IF OLD.parent_id IS NULL THEN
            UPDATE posts 
            SET comments_count = GREATEST(0, comments_count - 1) 
            WHERE id = OLD.post_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_update_post_likes_count ON post_likes;
CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

DROP TRIGGER IF EXISTS trigger_update_comment_likes_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_likes_count
    AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON comments;
CREATE TRIGGER trigger_update_post_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- RLS (Row Level Security) Policies
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved comments
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (is_approved = true);

-- Allow public read access to likes counts
CREATE POLICY "Public can view post likes" ON post_likes
    FOR SELECT USING (true);

CREATE POLICY "Public can view comment likes" ON comment_likes
    FOR SELECT USING (true);

-- Allow public insert for new comments (will need approval)
CREATE POLICY "Public can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

-- Allow public insert for likes
CREATE POLICY "Public can insert post likes" ON post_likes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert comment likes" ON comment_likes
    FOR INSERT WITH CHECK (true);

-- Allow public delete for their own likes (unlike functionality)
CREATE POLICY "Public can delete their own post likes" ON post_likes
    FOR DELETE USING (true);

CREATE POLICY "Public can delete their own comment likes" ON comment_likes
    FOR DELETE USING (true);

-- Admin policies for comment moderation
CREATE POLICY "Admins can view all comments" ON comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM authors 
            WHERE authors.id = auth.uid()
        )
    );

CREATE POLICY "Admins can update comments" ON comments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM authors 
            WHERE authors.id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete comments" ON comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM authors 
            WHERE authors.id = auth.uid()
        )
    );

-- Sample data for testing
INSERT INTO post_likes (post_id, user_identifier) VALUES 
    ((SELECT id FROM posts LIMIT 1), '192.168.1.100'),
    ((SELECT id FROM posts LIMIT 1), '192.168.1.101')
ON CONFLICT (post_id, user_identifier) DO NOTHING;

-- Update existing posts with initial counts
UPDATE posts SET 
    likes_count = COALESCE((
        SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id
    ), 0),
    comments_count = COALESCE((
        SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id AND comments.parent_id IS NULL AND comments.is_approved = true
    ), 0);
