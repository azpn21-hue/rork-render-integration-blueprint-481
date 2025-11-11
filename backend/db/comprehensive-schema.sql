-- ============================================
-- R3AL COMPREHENSIVE DATABASE SCHEMA
-- v2.41 IQ - All Systems Integration
-- ============================================

-- ============================================
-- EXTENSION SETUP
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- MEMORY GRAPH ENGINE (Blueprint #5)
-- ============================================

-- Memory nodes - representing entities in the graph
CREATE TABLE IF NOT EXISTS memory_nodes (
    node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255),
    embedding vector(512),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    CHECK (node_type IN ('User', 'EmotionState', 'PulseEvent', 'Interaction', 'HiveEvent', 'AIAction', 'Context'))
);

-- Memory edges - relationships between nodes
CREATE TABLE IF NOT EXISTS memory_edges (
    edge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_node UUID NOT NULL REFERENCES memory_nodes(node_id) ON DELETE CASCADE,
    to_node UUID NOT NULL REFERENCES memory_nodes(node_id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL,
    weight FLOAT DEFAULT 1.0,
    properties JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (relation_type IN ('felt', 'paired_with', 'joined', 'caused', 'derived_from', 'occurred_at', 'influenced'))
);

-- Emotion state nodes (detailed tracking)
CREATE TABLE IF NOT EXISTS emotion_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    valence FLOAT NOT NULL,
    arousal FLOAT NOT NULL,
    context TEXT,
    embedding vector(128),
    confidence FLOAT DEFAULT 0.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (valence >= -1 AND valence <= 1),
    CHECK (arousal >= 0 AND arousal <= 1)
);

-- Pulse events (biometric snapshots)
CREATE TABLE IF NOT EXISTS pulse_events (
    pulse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    bpm FLOAT,
    resonance_index FLOAT,
    embedding vector(64),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI actions log (for explainability)
CREATE TABLE IF NOT EXISTS ai_actions (
    action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    intent TEXT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    outcome TEXT,
    embedding vector(128),
    reward_score FLOAT,
    context_nodes UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SYNTHETIC TRAINING SYSTEM (Blueprint #6)
-- ============================================

-- Training datasets (anonymized)
CREATE TABLE IF NOT EXISTS training_datasets (
    dataset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_type VARCHAR(50) NOT NULL,
    source_period_start TIMESTAMP WITH TIME ZONE,
    source_period_end TIMESTAMP WITH TIME ZONE,
    sample_count INT DEFAULT 0,
    anonymization_method VARCHAR(100),
    privacy_epsilon FLOAT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (dataset_type IN ('emotion', 'conversation', 'pulse', 'interaction', 'synthetic'))
);

-- Synthetic samples
CREATE TABLE IF NOT EXISTS synthetic_samples (
    sample_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES training_datasets(dataset_id) ON DELETE CASCADE,
    sample_type VARCHAR(50) NOT NULL,
    features JSONB NOT NULL,
    embedding vector(256),
    generation_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Model versions
CREATE TABLE IF NOT EXISTS model_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    version_number VARCHAR(20) NOT NULL,
    architecture TEXT,
    training_dataset_id UUID REFERENCES training_datasets(dataset_id),
    empathy_score FLOAT,
    false_intervention_rate FLOAT,
    latency_ms FLOAT,
    status VARCHAR(50) DEFAULT 'training',
    deployment_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deployed_at TIMESTAMP WITH TIME ZONE,
    rollback_at TIMESTAMP WITH TIME ZONE,
    CHECK (status IN ('training', 'evaluating', 'deployed', 'shadow', 'archived', 'rolled_back')),
    UNIQUE(model_name, version_number)
);

-- Reward signals
CREATE TABLE IF NOT EXISTS reward_signals (
    signal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID REFERENCES model_versions(version_id),
    action_id UUID REFERENCES ai_actions(action_id),
    user_id VARCHAR(255),
    sentiment_gain FLOAT,
    engagement_delta FLOAT,
    compliance_score FLOAT,
    total_reward FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- WRITERS GUILD (Unrestricted AI)
-- ============================================

-- Projects table
CREATE TABLE IF NOT EXISTS writers_projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    genre VARCHAR(100),
    content_rating VARCHAR(50) DEFAULT 'mature',
    description TEXT,
    word_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (status IN ('draft', 'in_progress', 'completed', 'published', 'archived')),
    CHECK (content_rating IN ('general', 'teen', 'mature', 'adult', 'unrestricted'))
);

-- Writing sessions
CREATE TABLE IF NOT EXISTS writing_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES writers_projects(project_id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    chapter_number INT,
    content TEXT,
    ai_suggestions TEXT[],
    word_count INT DEFAULT 0,
    duration_minutes INT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Guild members (track premium access)
CREATE TABLE IF NOT EXISTS guild_members (
    member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    tier VARCHAR(50) DEFAULT 'free',
    unlimited_chat BOOLEAN DEFAULT false,
    unlimited_images BOOLEAN DEFAULT false,
    unrestricted_ai BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (tier IN ('free', 'basic', 'premium', 'unlimited'))
);

-- ============================================
-- TACTICAL R3AL HQ (Military/First Responder)
-- ============================================

-- Tactical users
CREATE TABLE IF NOT EXISTS tactical_users (
    tactical_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL UNIQUE,
    organization VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    clearance_level VARCHAR(50),
    unit VARCHAR(255),
    specialty VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (role IN ('military', 'first_responder', 'law_enforcement', 'emt', 'firefighter', 'other'))
);

-- Tactical communications
CREATE TABLE IF NOT EXISTS tactical_comms (
    comm_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id VARCHAR(255) NOT NULL,
    recipient_id VARCHAR(255),
    comm_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    content TEXT NOT NULL,
    optima_sr_analysis JSONB,
    encrypted BOOLEAN DEFAULT true,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (comm_type IN ('message', 'alert', 'briefing', 'sitrep', 'request')),
    CHECK (priority IN ('routine', 'normal', 'priority', 'immediate', 'flash'))
);

-- Optima SR sessions
CREATE TABLE IF NOT EXISTS optima_sr_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tactical_user_id UUID REFERENCES tactical_users(tactical_id),
    session_type VARCHAR(50) NOT NULL,
    stress_level FLOAT,
    recommendations TEXT[],
    interventions JSONB DEFAULT '[]',
    duration_minutes INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    CHECK (session_type IN ('stress_assessment', 'pre_deployment', 'post_incident', 'routine_check', 'crisis'))
);

-- ============================================
-- MUSIC STUDIO (R3AL Studio)
-- ============================================

-- Music projects
CREATE TABLE IF NOT EXISTS music_projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    mood_vector vector(128),
    genre VARCHAR(100),
    bpm INT,
    key VARCHAR(10),
    duration_seconds INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft',
    visibility VARCHAR(50) DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (status IN ('draft', 'generating', 'completed', 'published', 'archived')),
    CHECK (visibility IN ('private', 'unlisted', 'public', 'circle_only'))
);

-- Music stems (individual tracks)
CREATE TABLE IF NOT EXISTS music_stems (
    stem_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES music_projects(project_id) ON DELETE CASCADE,
    stem_type VARCHAR(50) NOT NULL,
    file_url TEXT NOT NULL,
    duration_seconds FLOAT,
    instrument VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (stem_type IN ('melody', 'harmony', 'bass', 'drums', 'vocals', 'fx', 'ambient'))
);

-- Mix versions (revision control)
CREATE TABLE IF NOT EXISTS music_mix_versions (
    mix_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES music_projects(project_id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    mix_url TEXT NOT NULL,
    master_settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, version_number)
);

-- Music shares (social integration)
CREATE TABLE IF NOT EXISTS music_shares (
    share_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES music_projects(project_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    external_url TEXT,
    share_count INT DEFAULT 0,
    play_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (platform IN ('facebook', 'instagram', 'twitter', 'soundcloud', 'tiktok', 'youtube'))
);

-- Music analytics
CREATE TABLE IF NOT EXISTS music_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES music_projects(project_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    plays INT DEFAULT 0,
    unique_listeners INT DEFAULT 0,
    avg_completion_rate FLOAT,
    shares INT DEFAULT 0,
    geographic_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, date)
);

-- ============================================
-- PREMIUM FEATURES & USAGE TRACKING
-- ============================================

-- Premium usage logs
CREATE TABLE IF NOT EXISTS premium_usage (
    usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    feature_type VARCHAR(100) NOT NULL,
    usage_count INT DEFAULT 1,
    cost_tokens FLOAT DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (feature_type IN ('ai_chat', 'image_generation', 'music_generation', 'unrestricted_ai', 'voice_generation'))
);

-- Image generation history
CREATE TABLE IF NOT EXISTS image_generations (
    generation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    image_url TEXT,
    style VARCHAR(100),
    dimensions VARCHAR(20),
    model_version VARCHAR(50),
    generation_time_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Memory Graph indexes
CREATE INDEX IF NOT EXISTS idx_memory_nodes_type ON memory_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_entity ON memory_nodes(entity_id);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_embedding ON memory_nodes USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_memory_edges_from ON memory_edges(from_node);
CREATE INDEX IF NOT EXISTS idx_memory_edges_to ON memory_edges(to_node);
CREATE INDEX IF NOT EXISTS idx_memory_edges_relation ON memory_edges(relation_type);
CREATE INDEX IF NOT EXISTS idx_emotion_states_user ON emotion_states(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_states_created ON emotion_states(created_at);
CREATE INDEX IF NOT EXISTS idx_pulse_events_user ON pulse_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_user ON ai_actions(user_id);

-- Training system indexes
CREATE INDEX IF NOT EXISTS idx_synthetic_samples_dataset ON synthetic_samples(dataset_id);
CREATE INDEX IF NOT EXISTS idx_model_versions_status ON model_versions(status);
CREATE INDEX IF NOT EXISTS idx_reward_signals_model ON reward_signals(model_version_id);

-- Writers Guild indexes
CREATE INDEX IF NOT EXISTS idx_writers_projects_user ON writers_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_writers_projects_status ON writers_projects(status);
CREATE INDEX IF NOT EXISTS idx_writing_sessions_project ON writing_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_user ON guild_members(user_id);

-- Tactical HQ indexes
CREATE INDEX IF NOT EXISTS idx_tactical_users_user ON tactical_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tactical_users_org ON tactical_users(organization);
CREATE INDEX IF NOT EXISTS idx_tactical_comms_sender ON tactical_comms(sender_id);
CREATE INDEX IF NOT EXISTS idx_tactical_comms_recipient ON tactical_comms(recipient_id);
CREATE INDEX IF NOT EXISTS idx_tactical_comms_priority ON tactical_comms(priority);
CREATE INDEX IF NOT EXISTS idx_optima_sr_sessions_tactical ON optima_sr_sessions(tactical_user_id);

-- Music Studio indexes
CREATE INDEX IF NOT EXISTS idx_music_projects_user ON music_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_music_projects_status ON music_projects(status);
CREATE INDEX IF NOT EXISTS idx_music_projects_mood ON music_projects USING ivfflat (mood_vector vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_music_stems_project ON music_stems(project_id);
CREATE INDEX IF NOT EXISTS idx_music_shares_project ON music_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_music_analytics_project ON music_analytics(project_id);

-- Premium features indexes
CREATE INDEX IF NOT EXISTS idx_premium_usage_user ON premium_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_usage_feature ON premium_usage(feature_type);
CREATE INDEX IF NOT EXISTS idx_image_generations_user ON image_generations(user_id);

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memory_nodes_timestamp
    BEFORE UPDATE ON memory_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_writers_projects_timestamp
    BEFORE UPDATE ON writers_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_music_projects_timestamp
    BEFORE UPDATE ON music_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Clean up expired memory nodes
CREATE OR REPLACE FUNCTION cleanup_expired_memory()
RETURNS void AS $$
BEGIN
    DELETE FROM memory_nodes 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Calculate edge weights based on interaction frequency
CREATE OR REPLACE FUNCTION update_edge_weights()
RETURNS void AS $$
BEGIN
    UPDATE memory_edges 
    SET weight = weight * 0.95
    WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Generate AI summary for completed events
CREATE OR REPLACE FUNCTION generate_event_summary(p_event_id UUID)
RETURNS TEXT AS $$
DECLARE
    avg_res FLOAT;
    part_count INT;
    summary TEXT;
BEGIN
    SELECT AVG(resonance_avg), COUNT(*)
    INTO avg_res, part_count
    FROM event_participants
    WHERE event_id = p_event_id;
    
    summary := format(
        'The Hive maintained %.0f%% coherence with %s participants during this session.',
        COALESCE(avg_res * 100, 0),
        part_count
    );
    
    RETURN summary;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE memory_nodes IS 'Core nodes in the Memory Graph Engine representing entities';
COMMENT ON TABLE memory_edges IS 'Relationships between memory nodes with temporal weights';
COMMENT ON TABLE training_datasets IS 'Anonymized datasets for synthetic training loop';
COMMENT ON TABLE model_versions IS 'AI model version control and deployment tracking';
COMMENT ON TABLE writers_projects IS 'User writing projects with unrestricted AI assistance';
COMMENT ON TABLE tactical_users IS 'Military and first responder users for Tactical HQ';
COMMENT ON TABLE music_projects IS 'R3AL Studio music creation projects';
COMMENT ON TABLE premium_usage IS 'Tracking premium feature usage for billing';
