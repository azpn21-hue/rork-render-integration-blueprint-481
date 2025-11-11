-- R3AL HQ Tactical Features Schema

CREATE TABLE tactical_users (
  tactical_user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  
  -- Identity & Verification
  service_branch TEXT, -- 'army', 'navy', 'air_force', 'marines', 'coast_guard', 'police', 'fire', 'ems', 'other'
  rank TEXT,
  badge_number TEXT,
  department TEXT,
  
  -- Verification status
  verified_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verified_by TEXT,
  verified_at TIMESTAMP,
  verification_documents JSONB,
  
  -- Access level
  clearance_level TEXT DEFAULT 'basic', -- 'basic', 'tactical', 'command'
  
  -- Settings
  tactical_mode_enabled BOOLEAN DEFAULT true,
  operational_status TEXT DEFAULT 'off_duty', -- 'on_duty', 'off_duty', 'standby'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_teams (
  team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  team_name TEXT NOT NULL,
  team_type TEXT, -- 'unit', 'squad', 'department', 'shift'
  department TEXT,
  
  -- Leadership
  team_lead_user_id UUID,
  
  -- Settings
  operational_area JSONB, -- geographic bounds
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_team_members (
  membership_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES tactical_teams(team_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  role TEXT, -- 'lead', 'member', 'support'
  joined_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(team_id, user_id)
);

CREATE TABLE tactical_incidents (
  incident_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Incident details
  incident_type TEXT NOT NULL, -- 'emergency', 'training', 'operation', 'response'
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT, -- 'low', 'medium', 'high', 'critical'
  status TEXT DEFAULT 'active', -- 'active', 'resolved', 'archived'
  
  -- Location
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_description TEXT,
  
  -- Team assignment
  assigned_team_id UUID REFERENCES tactical_teams(team_id),
  responding_users UUID[],
  
  -- Timeline
  reported_at TIMESTAMP DEFAULT NOW(),
  response_time TIMESTAMP,
  resolved_at TIMESTAMP,
  
  -- AI Analysis
  ai_risk_assessment JSONB,
  ai_recommendations TEXT[],
  
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_comms (
  comm_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Communication details
  from_user_id UUID NOT NULL,
  to_user_ids UUID[],
  to_team_id UUID REFERENCES tactical_teams(team_id),
  
  message_type TEXT, -- 'alert', 'update', 'request', 'status'
  message_content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Context
  related_incident_id UUID REFERENCES tactical_incidents(incident_id),
  
  -- Acknowledgment
  acknowledged_by UUID[],
  
  -- Encryption
  encrypted BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_resources (
  resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  resource_name TEXT NOT NULL,
  resource_type TEXT, -- 'vehicle', 'equipment', 'personnel', 'facility'
  status TEXT DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'unavailable'
  
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  
  assigned_to_team_id UUID REFERENCES tactical_teams(team_id),
  assigned_to_incident_id UUID REFERENCES tactical_incidents(incident_id),
  
  metadata JSONB,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_training (
  training_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title TEXT NOT NULL,
  description TEXT,
  training_type TEXT, -- 'course', 'drill', 'simulation', 'certification'
  
  required_for TEXT[], -- roles or clearance levels
  
  duration_minutes INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tactical_training_completions (
  completion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID REFERENCES tactical_training(training_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  score INTEGER CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN,
  
  completed_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(training_id, user_id, completed_at)
);

-- Indexes
CREATE INDEX idx_tactical_users_user ON tactical_users(user_id);
CREATE INDEX idx_tactical_users_service ON tactical_users(service_branch);
CREATE INDEX idx_tactical_team_members_team ON tactical_team_members(team_id);
CREATE INDEX idx_tactical_team_members_user ON tactical_team_members(user_id);
CREATE INDEX idx_tactical_incidents_status ON tactical_incidents(status);
CREATE INDEX idx_tactical_incidents_team ON tactical_incidents(assigned_team_id);
CREATE INDEX idx_tactical_comms_recipient ON tactical_comms(to_team_id);
CREATE INDEX idx_tactical_resources_status ON tactical_resources(status);
