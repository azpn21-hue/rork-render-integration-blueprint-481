-- Writers Guild Database Schema

CREATE TABLE writing_projects (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  title TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  word_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'archived'
  
  content_type TEXT, -- 'novel', 'short_story', 'screenplay', 'poetry', 'other'
  mature_content BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE writing_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES writing_projects(project_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  words_written INTEGER DEFAULT 0,
  
  ai_interactions INTEGER DEFAULT 0,
  ai_suggestions_accepted INTEGER DEFAULT 0
);

CREATE TABLE writing_ai_chats (
  chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES writing_sessions(session_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  project_id UUID REFERENCES writing_projects(project_id) ON DELETE CASCADE,
  
  message_role TEXT NOT NULL, -- 'user', 'assistant'
  message_content TEXT NOT NULL,
  context_type TEXT DEFAULT 'general', -- 'brainstorm', 'edit', 'plot', 'character', 'general'
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guild_members (
  member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  pen_name TEXT,
  bio TEXT,
  specialties TEXT[], -- e.g., ['romance', 'fantasy', 'thriller']
  
  total_words_written BIGINT DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  member_since TIMESTAMP DEFAULT NOW(),
  
  tier TEXT DEFAULT 'free', -- 'free', 'premium', 'tactical'
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guild_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES writing_projects(project_id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  
  feedback_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_writing_projects_user ON writing_projects(user_id);
CREATE INDEX idx_writing_sessions_project ON writing_sessions(project_id);
CREATE INDEX idx_writing_ai_chats_session ON writing_ai_chats(session_id);
CREATE INDEX idx_guild_members_user ON guild_members(user_id);
CREATE INDEX idx_guild_feedback_project ON guild_feedback(project_id);
