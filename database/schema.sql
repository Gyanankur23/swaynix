-- Swaynix Database Schema
-- Anti-FOMO Community Platform with PostgreSQL JSONB

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Users Table: Core user data with JSONB profile
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CRITICAL: profile_data JSONB for flexible user attributes
    profile_data JSONB NOT NULL DEFAULT '{}',
    
    -- Engagement score (weighted algorithm, no follower counts)
    engagement_score INTEGER NOT NULL DEFAULT 0,
    
    -- User level based on engagement score
    level INTEGER NOT NULL DEFAULT 1
);

-- =============================================
-- Cohorts Table: Community groups with JSONB metadata
-- =============================================
CREATE TABLE IF NOT EXISTS cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- CRITICAL: metadata JSONB for cohort attributes (interests, topics, rules)
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Member count (updated via triggers)
    member_count INTEGER NOT NULL DEFAULT 0,
    
    -- Activity metrics
    last_activity_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- User-Cohort Junction: Many-to-many with engagement data
-- =============================================
CREATE TABLE IF NOT EXISTS user_cohorts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Engagement tracking (Anti-FOMO: depth over breadth)
    post_depth_score INTEGER NOT NULL DEFAULT 0,
    meaningful_interactions INTEGER NOT NULL DEFAULT 0,
    
    UNIQUE(user_id, cohort_id)
);

-- =============================================
-- Posts Table: Content within cohorts
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Content metadata
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Depth indicators (character count, complexity markers)
    depth_score INTEGER NOT NULL DEFAULT 0
);

-- =============================================
-- Interactions Table: Meaningful engagement tracking
-- =============================================
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- 'thoughtful_reply', 'insight', 'collaboration'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Weight of the interaction
    weight INTEGER NOT NULL DEFAULT 1
);

-- =============================================
-- Comments Table: Nested replies to posts
-- =============================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Comment metadata for engagement tracking
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Depth for nesting limit
    depth INTEGER NOT NULL DEFAULT 0
);

-- =============================================
-- Companies Table: B2C Ad Network
-- =============================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    website_url VARCHAR(255),
    logo_url VARCHAR(255),
    
    -- CRITICAL: targeting criteria JSONB for interest matching
    targeting_criteria JSONB NOT NULL DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Ads Table: B2C Advertisements
-- =============================================
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    image_url VARCHAR(255),
    cta_text VARCHAR(50) DEFAULT 'Learn More',
    cta_url VARCHAR(255) NOT NULL,
    
    -- Targeting: which interests this ad matches
    target_interests JSONB NOT NULL DEFAULT '[]',
    
    -- Campaign settings
    budget_cents INTEGER NOT NULL DEFAULT 0,
    cost_per_click_cents INTEGER NOT NULL DEFAULT 50,
    max_impressions INTEGER,
    current_impressions INTEGER DEFAULT 0,
    current_clicks INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Ad Impressions Table: Track ad views/clicks
-- =============================================
CREATE TABLE IF NOT EXISTS ad_impressions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    impression_type VARCHAR(20) NOT NULL, -- 'view', 'click'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Ad Payout Queue: Revenue distribution
-- =============================================
CREATE TABLE IF NOT EXISTS ad_payout_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES ads(id) ON DELETE SET NULL,
    amount_cents INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    locked_by_worker VARCHAR(100)
);

-- =============================================
-- Post Likes Table: Track post likes
-- =============================================
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- =============================================
-- Post Shares Table: Track post shares
-- =============================================
CREATE TABLE IF NOT EXISTS post_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_type VARCHAR(20) DEFAULT 'internal', -- 'internal', 'external', 'copy_link'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Post Saves Table: Track saved/bookmarked posts
-- =============================================
CREATE TABLE IF NOT EXISTS post_saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_name VARCHAR(100) DEFAULT 'Default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- =============================================
-- Comment Likes Table: Track comment likes
-- =============================================
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id)
);

-- =============================================
-- Post Engagement Summary View
-- =============================================
CREATE OR REPLACE VIEW post_engagement_summary AS
SELECT 
    p.id as post_id,
    p.user_id,
    p.cohort_id,
    COUNT(DISTINCT pl.id) as likes_count,
    COUNT(DISTINCT ps.id) as saves_count,
    COUNT(DISTINCT psh.id) as shares_count,
    COUNT(DISTINCT c.id) as comments_count
FROM posts p
LEFT JOIN post_likes pl ON p.id = pl.post_id
LEFT JOIN post_saves ps ON p.id = ps.post_id
LEFT JOIN post_shares psh ON p.id = psh.post_id
LEFT JOIN comments c ON p.id = c.post_id
GROUP BY p.id, p.user_id, p.cohort_id;

-- =============================================
-- Indexes for engagement tables
-- =============================================
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_shares_post_id ON post_shares(post_id);
CREATE INDEX IF NOT EXISTS idx_post_saves_user_id ON post_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);

-- =============================================
-- Trigger: Update post engagement counts
-- =============================================
CREATE OR REPLACE FUNCTION update_post_engagement()
RETURNS TRIGGER AS $$
BEGIN
    -- Update post metadata with engagement counts
    UPDATE posts 
    SET metadata = jsonb_set(
        metadata,
        '{engagement}',
        jsonb_build_object(
            'likes', (SELECT COUNT(*) FROM post_likes WHERE post_id = NEW.post_id),
            'shares', (SELECT COUNT(*) FROM post_shares WHERE post_id = NEW.post_id),
            'saves', (SELECT COUNT(*) FROM post_saves WHERE post_id = NEW.post_id)
        )
    )
    WHERE id = NEW.post_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_likes
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_post_engagement();

CREATE TRIGGER trigger_update_post_shares
    AFTER INSERT OR DELETE ON post_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_post_engagement();

CREATE TRIGGER trigger_update_post_saves
    AFTER INSERT OR DELETE ON post_saves
    FOR EACH ROW
    EXECUTE FUNCTION update_post_engagement();

-- =============================================
-- Trigger: Award engagement points on like/share
-- =============================================
CREATE OR REPLACE FUNCTION award_engagement_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Award +2 points to post author when someone likes their post
    UPDATE users 
    SET engagement_score = engagement_score + 2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = (SELECT user_id FROM posts WHERE id = NEW.post_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_award_points_on_like
    AFTER INSERT ON post_likes
    FOR EACH ROW
    EXECUTE FUNCTION award_engagement_points();

-- =============================================
-- CRITICAL: GIN Indexes for sub-millisecond JSONB queries
-- =============================================

-- GIN index on users.profile_data for interest/containment queries
CREATE INDEX IF NOT EXISTS idx_users_profile_data_gin 
    ON users USING GIN (profile_data);

-- GIN index on cohorts.metadata for matching queries
CREATE INDEX IF NOT EXISTS idx_cohorts_metadata_gin 
    ON cohorts USING GIN (metadata);

-- GIN index on posts.metadata
CREATE INDEX IF NOT EXISTS idx_posts_metadata_gin 
    ON posts USING GIN (metadata);

-- GIN index on comments.metadata
CREATE INDEX IF NOT EXISTS idx_comments_metadata_gin 
    ON comments USING GIN (metadata);

-- GIN index on companies.targeting_criteria for ad matching
CREATE INDEX IF NOT EXISTS idx_companies_targeting_criteria_gin 
    ON companies USING GIN (targeting_criteria);

-- GIN index on ads.target_interests for user targeting
CREATE INDEX IF NOT EXISTS idx_ads_target_interests_gin 
    ON ads USING GIN (target_interests);

-- =============================================
-- B-Tree indexes for common queries
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_engagement_score 
    ON users(engagement_score DESC);

CREATE INDEX IF NOT EXISTS idx_cohorts_slug 
    ON cohorts(slug);

CREATE INDEX IF NOT EXISTS idx_user_cohorts_user_id 
    ON user_cohorts(user_id);

CREATE INDEX IF NOT EXISTS idx_user_cohorts_cohort_id 
    ON user_cohorts(cohort_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id 
    ON comments(post_id);

CREATE INDEX IF NOT EXISTS idx_comments_user_id 
    ON comments(user_id);

CREATE INDEX IF NOT EXISTS idx_posts_user_id 
    ON posts(user_id);

CREATE INDEX IF NOT EXISTS idx_posts_cohort_id 
    ON posts(cohort_id);

CREATE INDEX IF NOT EXISTS idx_ads_company_id 
    ON ads(company_id);

CREATE INDEX IF NOT EXISTS idx_ads_status 
    ON ads(status) 
    WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_ad_payout_queue_status 
    ON ad_payout_queue(status) 
    WHERE status = 'pending';

-- =============================================
-- Trigger: Update engagement scores
-- =============================================
CREATE OR REPLACE FUNCTION update_user_engagement_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET engagement_score = (
        SELECT COALESCE(SUM(post_depth_score * 5 + meaningful_interactions * 2), 0)
        FROM user_cohorts 
        WHERE user_id = NEW.user_id
    ),
    level = CASE 
        WHEN engagement_score >= 10000 THEN 10
        WHEN engagement_score >= 5000 THEN 9
        WHEN engagement_score >= 2500 THEN 8
        WHEN engagement_score >= 1000 THEN 7
        WHEN engagement_score >= 500 THEN 6
        WHEN engagement_score >= 250 THEN 5
        WHEN engagement_score >= 100 THEN 4
        WHEN engagement_score >= 50 THEN 3
        WHEN engagement_score >= 10 THEN 2
        ELSE 1
    END,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_engagement_score
    AFTER INSERT OR UPDATE ON user_cohorts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_engagement_score();

-- =============================================
-- Trigger: Update engagement score on comment
-- =============================================
CREATE OR REPLACE FUNCTION increment_engagement_on_comment()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's engagement score directly (+5 points per comment)
    UPDATE users 
    SET engagement_score = engagement_score + 5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.user_id;
    
    -- Also update user_cohorts meaningful_interactions
    UPDATE user_cohorts uc
    SET meaningful_interactions = meaningful_interactions + 1
    FROM posts p
    WHERE uc.user_id = NEW.user_id 
      AND p.id = NEW.post_id 
      AND uc.cohort_id = p.cohort_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_engagement_on_comment
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION increment_engagement_on_comment();

-- =============================================
-- Trigger: Update cohort member count
-- =============================================
CREATE OR REPLACE FUNCTION update_cohort_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE cohorts 
        SET member_count = member_count + 1,
            last_activity_at = CURRENT_TIMESTAMP
        WHERE id = NEW.cohort_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE cohorts 
        SET member_count = member_count - 1
        WHERE id = OLD.cohort_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cohort_member_count
    AFTER INSERT OR DELETE ON user_cohorts
    FOR EACH ROW
    EXECUTE FUNCTION update_cohort_member_count();

-- =============================================
-- Function: Get Ads for User (B2C Targeting)
-- =============================================
CREATE OR REPLACE FUNCTION get_ads_for_user(user_uuid UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
    ad_id UUID,
    company_name VARCHAR,
    title VARCHAR,
    body TEXT,
    image_url VARCHAR,
    cta_text VARCHAR,
    cta_url VARCHAR
) AS $$
DECLARE
    user_interests JSONB;
BEGIN
    -- Get user interests from profile
    SELECT profile_data->'interests' INTO user_interests
    FROM users 
    WHERE id = user_uuid;
    
    RETURN QUERY
    SELECT 
        a.id,
        c.name,
        a.title,
        a.body,
        a.image_url,
        a.cta_text,
        a.cta_url
    FROM ads a
    JOIN companies c ON a.company_id = c.id
    WHERE a.status = 'active'
      AND a.current_impressions < COALESCE(a.max_impressions, 999999999)
      AND a.target_interests @> user_interests -- JSONB containment
    ORDER BY 
        a.budget_cents DESC,
        a.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
