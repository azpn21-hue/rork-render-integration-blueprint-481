-- AI Testing Suite - Additional Database Schema
-- Add these columns/tables if they don't exist

-- Add matches table for AI-generated matches
CREATE TABLE IF NOT EXISTS matches (
  id VARCHAR(255) PRIMARY KEY,
  user_id_1 VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  status VARCHAR(50) DEFAULT 'suggested',
  match_reasons JSONB,
  created_by_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id_1, user_id_2)
);

CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_matches_ai ON matches(created_by_ai) WHERE created_by_ai = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(compatibility_score DESC);

-- Add interaction tables if they don't exist
CREATE TABLE IF NOT EXISTS post_resonances (
  id VARCHAR(255) PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_amplifications (
  id VARCHAR(255) PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_witnesses (
  id VARCHAR(255) PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id VARCHAR(255) PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add interaction count columns to posts if they don't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS resonate_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS amplify_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS witness_count INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- Create indexes for interactions
CREATE INDEX IF NOT EXISTS idx_post_resonances_post ON post_resonances(post_id);
CREATE INDEX IF NOT EXISTS idx_post_resonances_user ON post_resonances(user_id);
CREATE INDEX IF NOT EXISTS idx_post_amplifications_post ON post_amplifications(post_id);
CREATE INDEX IF NOT EXISTS idx_post_amplifications_user ON post_amplifications(user_id);
CREATE INDEX IF NOT EXISTS idx_post_witnesses_post ON post_witnesses(post_id);
CREATE INDEX IF NOT EXISTS idx_post_witnesses_user ON post_witnesses(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user ON post_comments(user_id);

-- Create index for test users (for quick cleanup)
CREATE INDEX IF NOT EXISTS idx_users_test ON users(id) WHERE id LIKE 'test_%';
CREATE INDEX IF NOT EXISTS idx_posts_test ON posts(id) WHERE id LIKE 'post_%';

-- Function to cleanup test data (optional, can also use the API)
CREATE OR REPLACE FUNCTION cleanup_test_data()
RETURNS TABLE(deleted_users INTEGER, deleted_posts INTEGER, deleted_interactions INTEGER) AS $$
DECLARE
  user_count INTEGER;
  post_count INTEGER;
  interaction_count INTEGER;
BEGIN
  -- Delete posts first (foreign key constraint)
  DELETE FROM posts WHERE user_id LIKE 'test_%' OR id LIKE 'post_%';
  GET DIAGNOSTICS post_count = ROW_COUNT;
  
  -- Delete interactions
  DELETE FROM post_comments WHERE user_id LIKE 'test_%';
  DELETE FROM post_resonances WHERE user_id LIKE 'test_%';
  DELETE FROM post_amplifications WHERE user_id LIKE 'test_%';
  DELETE FROM post_witnesses WHERE user_id LIKE 'test_%';
  DELETE FROM matches WHERE user_id_1 LIKE 'test_%' OR user_id_2 LIKE 'test_%' OR created_by_ai = TRUE;
  GET DIAGNOSTICS interaction_count = ROW_COUNT;
  
  -- Delete user-related data
  DELETE FROM profiles WHERE user_id LIKE 'test_%';
  DELETE FROM verifications WHERE user_id LIKE 'test_%';
  DELETE FROM tokens WHERE user_id LIKE 'test_%';
  DELETE FROM token_transactions WHERE user_id LIKE 'test_%';
  DELETE FROM sessions WHERE user_id LIKE 'test_%';
  
  -- Delete users last
  DELETE FROM users WHERE id LIKE 'test_%';
  GET DIAGNOSTICS user_count = ROW_COUNT;
  
  RETURN QUERY SELECT user_count, post_count, interaction_count;
END;
$$ LANGUAGE plpgsql;

-- View for test data statistics
CREATE OR REPLACE VIEW test_data_stats AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE id LIKE 'test_%') as test_users,
  (SELECT COUNT(*) FROM posts WHERE user_id LIKE 'test_%') as test_posts,
  (SELECT COUNT(*) FROM post_comments WHERE user_id LIKE 'test_%') as test_comments,
  (SELECT COUNT(*) FROM post_resonances WHERE user_id LIKE 'test_%') as test_resonances,
  (SELECT COUNT(*) FROM matches WHERE created_by_ai = TRUE) as ai_matches,
  (SELECT AVG(truth_score) FROM users WHERE id LIKE 'test_%') as avg_truth_score;

-- Usage examples:
-- SELECT * FROM test_data_stats;
-- SELECT * FROM cleanup_test_data();
