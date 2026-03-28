-- R3AL Hybrid Age-Gated System Database Schema
-- Compliant with COPPA, GDPR Article 8, UK Age Appropriate Design Code

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER AGE PROFILES
-- ============================================

CREATE TYPE age_tier_enum AS ENUM ('adult', 'teen', 'kid');
CREATE TYPE verification_method_enum AS ENUM ('id_upload', 'credit_card', 'educational_email', 'parent_verified');

CREATE TABLE user_age_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    age_tier age_tier_enum NOT NULL,
    birth_date DATE NOT NULL,
    age_verified BOOLEAN DEFAULT FALSE,
    verification_method verification_method_enum,
    verified_at TIMESTAMP,
    verification_data JSONB, -- Encrypted verification details
    
    -- Parental Control Fields
    requires_parental_consent BOOLEAN DEFAULT FALSE,
    parental_consent_given BOOLEAN DEFAULT FALSE,
    parental_consent_given_at TIMESTAMP,
    parent_id UUID,
    
    -- Compliance
    coppa_compliant BOOLEAN DEFAULT FALSE,
    gdpr_consent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_age_tier ON user_age_profiles(user_id, age_tier);
CREATE INDEX idx_age_verification ON user_age_profiles(age_verified, age_tier);
CREATE INDEX idx_parent_children ON user_age_profiles(parent_id) WHERE parent_id IS NOT NULL;

-- ============================================
-- 2. PARENTAL CONTROLS
-- ============================================

CREATE TABLE parental_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    child_id UUID NOT NULL,
    
    -- Monitoring Settings
    monitor_messages BOOLEAN DEFAULT TRUE,
    monitor_posts BOOLEAN DEFAULT TRUE,
    monitor_connections BOOLEAN DEFAULT TRUE,
    monitor_media BOOLEAN DEFAULT TRUE,
    
    -- Feature Restrictions
    allowed_features TEXT[] DEFAULT ARRAY['feed', 'creative_tools', 'profile'],
    restricted_features TEXT[] DEFAULT ARRAY['video_chat', 'location', 'marketplace'],
    
    -- Time Management
    screen_time_limit_minutes INTEGER DEFAULT 120, -- 2 hours default
    daily_limit_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    
    -- Contact Management
    require_contact_approval BOOLEAN DEFAULT TRUE,
    approved_contact_ids UUID[] DEFAULT ARRAY[]::UUID[],
    blocked_contact_ids UUID[] DEFAULT ARRAY[]::UUID[],
    
    -- Emergency Controls
    account_paused BOOLEAN DEFAULT FALSE,
    paused_at TIMESTAMP,
    pause_reason TEXT,
    
    -- Notifications
    alert_on_new_contact BOOLEAN DEFAULT TRUE,
    alert_on_flagged_content BOOLEAN DEFAULT TRUE,
    alert_on_reported_content BOOLEAN DEFAULT TRUE,
    weekly_activity_report BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    -- Privacy Settings
    profile_visibility VARCHAR(20) DEFAULT 'private', -- 'private', 'friends_only'
    allow_location_sharing BOOLEAN DEFAULT FALSE,
    allow_photo_sharing BOOLEAN DEFAULT TRUE,
    require_photo_approval BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(parent_id, child_id)
);

CREATE INDEX idx_parent_controls ON parental_controls(parent_id);
CREATE INDEX idx_child_controls ON parental_controls(child_id);
CREATE INDEX idx_paused_accounts ON parental_controls(account_paused) WHERE account_paused = TRUE;

-- ============================================
-- 3. CHILD ACTIVITY LOG
-- ============================================

CREATE TYPE activity_type_enum AS ENUM (
    'message_sent',
    'message_received',
    'post_created',
    'post_liked',
    'post_commented',
    'connection_requested',
    'connection_accepted',
    'profile_updated',
    'media_uploaded',
    'feature_accessed',
    'report_filed',
    'content_flagged',
    'login',
    'logout'
);

CREATE TABLE child_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL,
    parent_id UUID NOT NULL,
    
    activity_type activity_type_enum NOT NULL,
    activity_description TEXT,
    activity_data JSONB, -- Additional context
    
    -- Content References
    related_user_id UUID,
    related_content_id UUID,
    related_content_type VARCHAR(50),
    
    -- Flagging
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    flag_severity VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    auto_flagged BOOLEAN DEFAULT FALSE,
    
    -- Parent Review
    reviewed_by_parent BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    parent_action TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_child_activity ON child_activity_log(child_id, created_at DESC);
CREATE INDEX idx_flagged_activity ON child_activity_log(child_id, flagged, reviewed_by_parent);
CREATE INDEX idx_activity_type ON child_activity_log(activity_type, created_at DESC);
CREATE INDEX idx_parent_review_queue ON child_activity_log(parent_id, reviewed_by_parent, flagged);

-- ============================================
-- 4. CONTENT FILTER RULES
-- ============================================

CREATE TABLE content_filter_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age_tier age_tier_enum NOT NULL,
    filter_type VARCHAR(50) NOT NULL, -- 'keyword', 'topic', 'regex', 'image_category'
    rule_name VARCHAR(100) NOT NULL,
    rule_data JSONB NOT NULL,
    action VARCHAR(20) DEFAULT 'block', -- 'block', 'flag', 'blur', 'warn'
    severity VARCHAR(20) DEFAULT 'medium',
    active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_filter_tier ON content_filter_rules(age_tier, active);
CREATE INDEX idx_filter_type ON content_filter_rules(filter_type, active);

-- ============================================
-- 5. CONTACT REQUESTS (Child Accounts)
-- ============================================

CREATE TYPE contact_request_status_enum AS ENUM ('pending', 'approved', 'denied', 'auto_approved');

CREATE TABLE child_contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL,
    parent_id UUID NOT NULL,
    requester_id UUID NOT NULL, -- The user wanting to connect
    requester_age_tier age_tier_enum,
    
    status contact_request_status_enum DEFAULT 'pending',
    message TEXT,
    
    -- Parent Review
    reviewed_by_parent BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    parent_notes TEXT,
    
    -- Auto-approval (if requester is pre-approved)
    auto_approved BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX idx_pending_requests ON child_contact_requests(child_id, status) WHERE status = 'pending';
CREATE INDEX idx_parent_requests ON child_contact_requests(parent_id, reviewed_by_parent);

-- ============================================
-- 6. SCREEN TIME TRACKING
-- ============================================

CREATE TABLE screen_time_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    age_tier age_tier_enum NOT NULL,
    
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP,
    duration_minutes INTEGER,
    
    -- Activity Breakdown
    features_used TEXT[],
    interactions_count INTEGER DEFAULT 0,
    
    -- Parental Monitoring
    parent_id UUID,
    exceeded_limit BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_screen_time_user ON screen_time_log(user_id, session_start DESC);
CREATE INDEX idx_screen_time_daily ON screen_time_log(user_id, DATE(session_start));

-- ============================================
-- 7. SAFETY REPORTS (Enhanced for Minors)
-- ============================================

CREATE TYPE report_category_enum AS ENUM (
    'inappropriate_content',
    'harassment',
    'bullying',
    'stranger_danger',
    'unsafe_contact',
    'privacy_violation',
    'self_harm',
    'violence',
    'other'
);

CREATE TYPE report_priority_enum AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE safety_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL,
    reporter_age_tier age_tier_enum,
    
    reported_user_id UUID,
    reported_content_id UUID,
    reported_content_type VARCHAR(50),
    
    category report_category_enum NOT NULL,
    priority report_priority_enum DEFAULT 'medium',
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    
    -- Minor Protection
    involves_minor BOOLEAN DEFAULT FALSE,
    minor_user_ids UUID[],
    parent_notified BOOLEAN DEFAULT FALSE,
    parent_notified_at TIMESTAMP,
    
    -- Review Status
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'escalated'
    assigned_to UUID,
    reviewed_at TIMESTAMP,
    resolution TEXT,
    action_taken TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_safety_reports_status ON safety_reports(status, priority, created_at DESC);
CREATE INDEX idx_safety_reports_minor ON safety_reports(involves_minor) WHERE involves_minor = TRUE;
CREATE INDEX idx_reported_user ON safety_reports(reported_user_id);

-- ============================================
-- 8. AGE-APPROPRIATE CONTENT METADATA
-- ============================================

CREATE TABLE content_age_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'post', 'media', 'nft', 'message'
    
    -- Age Appropriateness
    minimum_age_tier age_tier_enum DEFAULT 'adult',
    content_rating VARCHAR(20), -- 'kid_safe', 'teen_safe', 'adult_only'
    
    -- AI Analysis
    ai_analyzed BOOLEAN DEFAULT FALSE,
    ai_analysis_data JSONB,
    ai_flagged BOOLEAN DEFAULT FALSE,
    ai_flag_reasons TEXT[],
    
    -- Manual Review
    manually_reviewed BOOLEAN DEFAULT FALSE,
    reviewed_by UUID,
    reviewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_rating ON content_age_ratings(content_id, content_type);
CREATE INDEX idx_flagged_content ON content_age_ratings(ai_flagged) WHERE ai_flagged = TRUE;

-- ============================================
-- 9. PARENTAL CONSENT AUDIT TRAIL (COPPA)
-- ============================================

CREATE TABLE parental_consent_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL,
    child_id UUID NOT NULL,
    
    consent_type VARCHAR(50) NOT NULL, -- 'account_creation', 'feature_access', 'data_collection'
    consent_given BOOLEAN NOT NULL,
    consent_method VARCHAR(50), -- 'credit_card_verification', 'id_upload', 'video_call'
    
    -- Legal Compliance
    ip_address INET,
    user_agent TEXT,
    consent_document_url TEXT,
    consent_version VARCHAR(20),
    
    -- Verification
    verification_code VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consent_log ON parental_consent_log(child_id, consent_type);

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Function to calculate age from birth date
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to determine age tier from birth date
CREATE OR REPLACE FUNCTION determine_age_tier(birth_date DATE)
RETURNS age_tier_enum AS $$
DECLARE
    user_age INTEGER;
BEGIN
    user_age := calculate_age(birth_date);
    
    IF user_age < 13 THEN
        RETURN 'kid'::age_tier_enum;
    ELSIF user_age >= 13 AND user_age < 18 THEN
        RETURN 'teen'::age_tier_enum;
    ELSE
        RETURN 'adult'::age_tier_enum;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check if screen time limit exceeded
CREATE OR REPLACE FUNCTION check_screen_time_limit(p_user_id UUID, p_limit_minutes INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    today_minutes INTEGER;
BEGIN
    SELECT COALESCE(SUM(duration_minutes), 0)
    INTO today_minutes
    FROM screen_time_log
    WHERE user_id = p_user_id
    AND DATE(session_start) = CURRENT_DATE;
    
    RETURN today_minutes >= p_limit_minutes;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert default content filter rules
INSERT INTO content_filter_rules (age_tier, filter_type, rule_name, rule_data, action, severity) VALUES
('kid', 'keyword', 'Prohibited Words - Kids', '{"keywords": ["violence", "weapon", "drug", "alcohol"]}', 'block', 'high'),
('teen', 'keyword', 'Flagged Words - Teen', '{"keywords": ["suicide", "self-harm", "drugs"]}', 'flag', 'high'),
('kid', 'topic', 'Safe Topics Only', '{"allowed_topics": ["education", "games", "art", "nature"]}', 'block', 'medium'),
('teen', 'regex', 'External Link Filter', '{"pattern": "https?://"}', 'flag', 'low');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Children requiring parental review
CREATE VIEW pending_parental_reviews AS
SELECT 
    cal.id,
    cal.child_id,
    cal.parent_id,
    cal.activity_type,
    cal.activity_description,
    cal.flagged,
    cal.flag_severity,
    cal.created_at,
    uap.age_tier,
    pc.alert_on_flagged_content
FROM child_activity_log cal
JOIN user_age_profiles uap ON cal.child_id = uap.user_id
JOIN parental_controls pc ON cal.child_id = pc.child_id
WHERE cal.flagged = TRUE 
AND cal.reviewed_by_parent = FALSE
AND pc.monitor_messages = TRUE
ORDER BY cal.created_at DESC;

-- View: Daily screen time summary
CREATE VIEW daily_screen_time_summary AS
SELECT 
    user_id,
    DATE(session_start) as date,
    SUM(duration_minutes) as total_minutes,
    COUNT(*) as session_count,
    MAX(duration_minutes) as longest_session_minutes
FROM screen_time_log
GROUP BY user_id, DATE(session_start);

COMMENT ON DATABASE CURRENT_DATABASE IS 'R3AL Hybrid Age-Gated System - COPPA & GDPR Compliant';
