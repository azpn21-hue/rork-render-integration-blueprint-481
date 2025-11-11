-- Memory Graph Engine Schema v2.41
-- Cognitive memory backbone for Optima 240IQ

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- NODES
-- ============================================

-- User nodes (reference existing users table)
CREATE TABLE IF NOT EXISTS memory_user_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  profile_vector vector(512),
  personality_traits JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memory_user_nodes_user_id ON memory_user_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_user_nodes_vector ON memory_user_nodes USING ivfflat (profile_vector vector_cosine_ops);

-- Emotion state nodes
CREATE TABLE IF NOT EXISTS memory_emotion_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  valence FLOAT,
  arousal FLOAT,
  context TEXT,
  embedding vector(128),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confidence FLOAT DEFAULT 0.0
);
CREATE INDEX IF NOT EXISTS idx_memory_emotion_nodes_user_id ON memory_emotion_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_emotion_nodes_timestamp ON memory_emotion_nodes(timestamp);
CREATE INDEX IF NOT EXISTS idx_memory_emotion_nodes_vector ON memory_emotion_nodes USING ivfflat (embedding vector_cosine_ops);

-- Pulse event nodes
CREATE TABLE IF NOT EXISTS memory_pulse_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  pulse_id VARCHAR(255),
  bpm FLOAT,
  resonance_index FLOAT,
  embedding vector(64),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memory_pulse_nodes_user_id ON memory_pulse_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_pulse_nodes_timestamp ON memory_pulse_nodes(timestamp);
CREATE INDEX IF NOT EXISTS idx_memory_pulse_nodes_vector ON memory_pulse_nodes USING ivfflat (embedding vector_cosine_ops);

-- Interaction nodes
CREATE TABLE IF NOT EXISTS memory_interaction_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content_ref TEXT,
  embedding vector(256),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memory_interaction_nodes_user_id ON memory_interaction_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_interaction_nodes_type ON memory_interaction_nodes(type);
CREATE INDEX IF NOT EXISTS idx_memory_interaction_nodes_vector ON memory_interaction_nodes USING ivfflat (embedding vector_cosine_ops);

-- Hive event nodes
CREATE TABLE IF NOT EXISTS memory_hive_event_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255),
  theme VARCHAR(100),
  avg_resonance FLOAT,
  embedding vector(256),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memory_hive_event_nodes_event_id ON memory_hive_event_nodes(event_id);
CREATE INDEX IF NOT EXISTS idx_memory_hive_event_nodes_vector ON memory_hive_event_nodes USING ivfflat (embedding vector_cosine_ops);

-- AI action nodes
CREATE TABLE IF NOT EXISTS memory_ai_action_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id VARCHAR(255),
  intent TEXT,
  outcome TEXT,
  embedding vector(128),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memory_ai_action_nodes_action_id ON memory_ai_action_nodes(action_id);
CREATE INDEX IF NOT EXISTS idx_memory_ai_action_nodes_vector ON memory_ai_action_nodes USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- EDGES
-- ============================================

-- Felt edges: User -> EmotionState
CREATE TABLE IF NOT EXISTS memory_edge_felt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_node_id UUID REFERENCES memory_user_nodes(id) ON DELETE CASCADE,
  emotion_node_id UUID REFERENCES memory_emotion_nodes(id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confidence FLOAT DEFAULT 0.0,
  weight FLOAT DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_memory_edge_felt_user ON memory_edge_felt(user_node_id);
CREATE INDEX IF NOT EXISTS idx_memory_edge_felt_emotion ON memory_edge_felt(emotion_node_id);

-- Paired with edges: User <-> User
CREATE TABLE IF NOT EXISTS memory_edge_paired_with (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_node_a_id UUID REFERENCES memory_user_nodes(id) ON DELETE CASCADE,
  user_node_b_id UUID REFERENCES memory_user_nodes(id) ON DELETE CASCADE,
  resonance FLOAT,
  duration INTEGER,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  weight FLOAT DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_memory_edge_paired_user_a ON memory_edge_paired_with(user_node_a_id);
CREATE INDEX IF NOT EXISTS idx_memory_edge_paired_user_b ON memory_edge_paired_with(user_node_b_id);

-- Joined edges: User -> HiveEvent
CREATE TABLE IF NOT EXISTS memory_edge_joined (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_node_id UUID REFERENCES memory_user_nodes(id) ON DELETE CASCADE,
  hive_event_node_id UUID REFERENCES memory_hive_event_nodes(id) ON DELETE CASCADE,
  join_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  leave_time TIMESTAMP,
  weight FLOAT DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_memory_edge_joined_user ON memory_edge_joined(user_node_id);
CREATE INDEX IF NOT EXISTS idx_memory_edge_joined_event ON memory_edge_joined(hive_event_node_id);

-- Caused edges: EmotionState -> AIAction
CREATE TABLE IF NOT EXISTS memory_edge_caused (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_node_id UUID REFERENCES memory_emotion_nodes(id) ON DELETE CASCADE,
  ai_action_node_id UUID REFERENCES memory_ai_action_nodes(id) ON DELETE CASCADE,
  reason_weight FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  weight FLOAT DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_memory_edge_caused_emotion ON memory_edge_caused(emotion_node_id);
CREATE INDEX IF NOT EXISTS idx_memory_edge_caused_action ON memory_edge_caused(ai_action_node_id);

-- Derived from edges: AIAction -> Outcome
CREATE TABLE IF NOT EXISTS memory_edge_derived_from (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_action_node_id UUID REFERENCES memory_ai_action_nodes(id) ON DELETE CASCADE,
  outcome_node_id UUID,
  reward FLOAT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  weight FLOAT DEFAULT 1.0
);
CREATE INDEX IF NOT EXISTS idx_memory_edge_derived_action ON memory_edge_derived_from(ai_action_node_id);

-- Occurred at edges: PulseEvent -> Timestamp (stored in pulse node itself)

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS memory_graph_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  action_type VARCHAR(50),
  node_type VARCHAR(50),
  node_id UUID,
  edge_type VARCHAR(50),
  edge_id UUID,
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_memory_audit_user_id ON memory_graph_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_audit_timestamp ON memory_graph_audit(timestamp);

-- ============================================
-- DECAY TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS memory_decay_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type VARCHAR(50),
  node_id UUID,
  original_weight FLOAT,
  new_weight FLOAT,
  decay_reason VARCHAR(100),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
