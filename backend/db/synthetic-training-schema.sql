-- Synthetic Training Loop & Contextual RL Schema
-- Purpose: Store training data, model versions, metrics, and reward signals

-- Training Data Pool (Anonymized & Synthetic)
CREATE TABLE IF NOT EXISTS training_data_pool (
    pool_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT NOT NULL CHECK (data_type IN ('real_anonymized', 'synthetic', 'augmented')),
    source_context TEXT, -- e.g., 'pulse', 'pairing', 'hive_event', 'chat'
    feature_vector JSONB NOT NULL, -- anonymized feature representation
    emotion_distribution JSONB, -- { "calm": 0.6, "anxious": 0.2, ... }
    temporal_sequence JSONB, -- time-series data if applicable
    metadata JSONB, -- additional context
    privacy_epsilon FLOAT DEFAULT 1.0, -- differential privacy bound
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '90 days'
);

CREATE INDEX idx_training_pool_type ON training_data_pool(data_type);
CREATE INDEX idx_training_pool_source ON training_data_pool(source_context);
CREATE INDEX idx_training_pool_created ON training_data_pool(created_at);

-- Model Versions & Registry
CREATE TABLE IF NOT EXISTS model_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag TEXT NOT NULL UNIQUE, -- e.g., 'v1.0.5'
    model_type TEXT NOT NULL CHECK (model_type IN ('policy', 'empathy', 'timing', 'tone')),
    architecture TEXT, -- e.g., 'transformer', 'lstm', 'gpt-nano'
    training_params JSONB, -- hyperparameters
    model_weights_url TEXT, -- cloud storage location
    model_size_bytes BIGINT,
    trained_on_samples INT,
    training_duration_minutes INT,
    status TEXT DEFAULT 'training' CHECK (status IN ('training', 'evaluating', 'deployed', 'archived', 'rollback')),
    deployed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_model_versions_status ON model_versions(status);
CREATE INDEX idx_model_versions_type ON model_versions(model_type);
CREATE INDEX idx_model_versions_tag ON model_versions(version_tag);

-- Model Performance Metrics
CREATE TABLE IF NOT EXISTS model_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES model_versions(version_id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL, -- 'empathy_score', 'false_intervention_rate', 'latency', etc.
    metric_value FLOAT NOT NULL,
    sample_size INT,
    confidence_interval JSONB, -- { "lower": 0.82, "upper": 0.88 }
    evaluation_context TEXT, -- 'validation', 'shadow_test', 'production'
    measured_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_model_metrics_version ON model_metrics(version_id);
CREATE INDEX idx_model_metrics_type ON model_metrics(metric_type);
CREATE INDEX idx_model_metrics_measured ON model_metrics(measured_at);

-- Training Episodes (RL specific)
CREATE TABLE IF NOT EXISTS training_episodes (
    episode_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES model_versions(version_id) ON DELETE CASCADE,
    epoch_number INT NOT NULL,
    batch_size INT,
    total_steps INT,
    avg_reward FLOAT,
    loss_value FLOAT,
    policy_entropy FLOAT, -- exploration measure
    learning_rate FLOAT,
    episode_data JSONB, -- detailed stats
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_training_episodes_version ON training_episodes(version_id);
CREATE INDEX idx_training_episodes_epoch ON training_episodes(epoch_number);

-- Reward Signals from Real Usage
CREATE TABLE IF NOT EXISTS reward_signals (
    signal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- nullable for anonymized signals
    session_id UUID,
    action_id UUID, -- reference to AI action from memory graph
    sentiment_gain FLOAT, -- -1.0 to 1.0
    engagement_delta FLOAT, -- -1.0 to 1.0
    compliance_score FLOAT, -- 0.0 to 1.0 (consent adherence)
    total_reward FLOAT, -- computed composite
    context JSONB, -- situational factors
    feedback_type TEXT, -- 'implicit', 'explicit', 'system'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reward_signals_user ON reward_signals(user_id);
CREATE INDEX idx_reward_signals_action ON reward_signals(action_id);
CREATE INDEX idx_reward_signals_created ON reward_signals(created_at);

-- A/B Testing Experiments
CREATE TABLE IF NOT EXISTS ab_experiments (
    experiment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name TEXT NOT NULL,
    control_version_id UUID REFERENCES model_versions(version_id),
    test_version_id UUID REFERENCES model_versions(version_id),
    traffic_split JSONB, -- { "control": 0.5, "test": 0.5 }
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    winner_version_id UUID,
    status TEXT DEFAULT 'running' CHECK (status IN ('planning', 'running', 'completed', 'cancelled')),
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ab_experiments_status ON ab_experiments(status);
CREATE INDEX idx_ab_experiments_dates ON ab_experiments(start_date, end_date);

-- Anonymization Audit Log
CREATE TABLE IF NOT EXISTS anonymization_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type TEXT NOT NULL,
    source_count INT,
    anonymized_count INT,
    technique TEXT, -- 'k-anonymity', 'differential_privacy', 'generalization'
    privacy_params JSONB,
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_anonymization_logs_created ON anonymization_logs(created_at);

-- Synthetic Data Generation Jobs
CREATE TABLE IF NOT EXISTS synthetic_jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type TEXT NOT NULL CHECK (job_type IN ('vae', 'diffusion', 'gan', 'rule_based')),
    source_pool_size INT,
    generated_count INT,
    quality_score FLOAT, -- measure of realism
    diversity_score FLOAT, -- measure of coverage
    parameters JSONB,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_synthetic_jobs_status ON synthetic_jobs(status);
CREATE INDEX idx_synthetic_jobs_created ON synthetic_jobs(created_at);

-- Model Deployment History
CREATE TABLE IF NOT EXISTS deployment_history (
    deployment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES model_versions(version_id),
    deployment_type TEXT CHECK (deployment_type IN ('full_rollout', 'shadow_test', 'canary', 'rollback')),
    traffic_percentage INT, -- 0-100
    deployed_by TEXT, -- system or admin identifier
    deployment_notes TEXT,
    rollback_trigger TEXT, -- reason if rolled back
    deployed_at TIMESTAMP DEFAULT NOW(),
    rolled_back_at TIMESTAMP
);

CREATE INDEX idx_deployment_history_version ON deployment_history(version_id);
CREATE INDEX idx_deployment_history_deployed ON deployment_history(deployed_at);

-- Privacy Budget Tracking (Differential Privacy)
CREATE TABLE IF NOT EXISTS privacy_budget (
    budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- nullable for group-level budgets
    epsilon_spent FLOAT DEFAULT 0.0,
    epsilon_limit FLOAT DEFAULT 1.0,
    delta_spent FLOAT DEFAULT 0.0,
    delta_limit FLOAT DEFAULT 0.00001,
    period TEXT, -- 'daily', 'weekly', 'monthly', 'lifetime'
    reset_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_privacy_budget_user ON privacy_budget(user_id);
CREATE INDEX idx_privacy_budget_period ON privacy_budget(period);

-- Contextual State Observations (for RL environment)
CREATE TABLE IF NOT EXISTS state_observations (
    observation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id UUID REFERENCES training_episodes(episode_id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    state_vector JSONB NOT NULL, -- current state representation
    action_taken JSONB, -- action from policy
    reward_received FLOAT,
    next_state_vector JSONB,
    terminal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_state_observations_episode ON state_observations(episode_id);
CREATE INDEX idx_state_observations_step ON state_observations(step_number);

-- Human Feedback for Model Evaluation (RLHF style)
CREATE TABLE IF NOT EXISTS human_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES model_versions(version_id),
    reviewer_id TEXT, -- admin or expert identifier
    interaction_sample JSONB, -- anonymized example
    rating INT CHECK (rating BETWEEN 1 AND 5),
    empathy_rating INT CHECK (empathy_rating BETWEEN 1 AND 5),
    appropriateness_rating INT CHECK (appropriateness_rating BETWEEN 1 AND 5),
    comments TEXT,
    approved_for_production BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_human_feedback_version ON human_feedback(version_id);
CREATE INDEX idx_human_feedback_approved ON human_feedback(approved_for_production);

-- Auto-cleanup for expired training data
CREATE OR REPLACE FUNCTION cleanup_expired_training_data()
RETURNS void AS $$
BEGIN
    DELETE FROM training_data_pool WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update model_versions timestamp
CREATE OR REPLACE FUNCTION update_model_version_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_model_version_timestamp
BEFORE UPDATE ON model_versions
FOR EACH ROW
EXECUTE FUNCTION update_model_version_timestamp();

-- View for latest deployed model per type
CREATE OR REPLACE VIEW latest_deployed_models AS
SELECT DISTINCT ON (model_type)
    version_id,
    version_tag,
    model_type,
    architecture,
    deployed_at,
    training_params
FROM model_versions
WHERE status = 'deployed'
ORDER BY model_type, deployed_at DESC;

-- View for aggregated model performance
CREATE OR REPLACE VIEW model_performance_summary AS
SELECT
    mv.version_id,
    mv.version_tag,
    mv.model_type,
    mv.status,
    COUNT(DISTINCT mm.metric_id) as total_metrics,
    AVG(CASE WHEN mm.metric_type = 'empathy_score' THEN mm.metric_value END) as avg_empathy_score,
    AVG(CASE WHEN mm.metric_type = 'false_intervention_rate' THEN mm.metric_value END) as avg_false_intervention_rate,
    AVG(CASE WHEN mm.metric_type = 'latency' THEN mm.metric_value END) as avg_latency_ms,
    AVG(CASE WHEN mm.metric_type = 'reward_stability' THEN mm.metric_value END) as avg_reward_stability
FROM model_versions mv
LEFT JOIN model_metrics mm ON mv.version_id = mm.version_id
GROUP BY mv.version_id, mv.version_tag, mv.model_type, mv.status;

-- View for training progress
CREATE OR REPLACE VIEW training_progress AS
SELECT
    mv.version_id,
    mv.version_tag,
    mv.model_type,
    COUNT(te.episode_id) as total_episodes,
    AVG(te.avg_reward) as mean_episode_reward,
    MAX(te.epoch_number) as latest_epoch,
    mv.status,
    mv.created_at as training_started
FROM model_versions mv
LEFT JOIN training_episodes te ON mv.version_id = te.version_id
WHERE mv.status IN ('training', 'evaluating')
GROUP BY mv.version_id, mv.version_tag, mv.model_type, mv.status, mv.created_at;
