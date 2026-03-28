-- SecureGrid Database Schema
-- End-to-End Encryption, VPN Tunneling, and Location Masking

CREATE TABLE IF NOT EXISTS secure_grid_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  tunnel_endpoint VARCHAR(255),
  encryption_level VARCHAR(50) DEFAULT 'military',
  location_masked BOOLEAN DEFAULT true,
  obfuscation_level VARCHAR(50) DEFAULT 'high',
  vpn_enabled BOOLEAN DEFAULT true,
  bytes_transferred BIGINT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS secure_grid_keys (
  key_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  public_key TEXT NOT NULL,
  private_key_hash TEXT NOT NULL,
  key_type VARCHAR(50) DEFAULT 'session',
  algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
  rotation_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  rotated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS secure_grid_messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id VARCHAR(255) NOT NULL,
  recipient_id VARCHAR(255),
  session_id UUID REFERENCES secure_grid_sessions(session_id),
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  key_id VARCHAR(255) NOT NULL,
  encrypted BOOLEAN DEFAULT true,
  forward_secrecy BOOLEAN DEFAULT true,
  message_type VARCHAR(50) DEFAULT 'secure',
  priority VARCHAR(50) DEFAULT 'normal',
  delivered BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS secure_grid_locations (
  location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  session_id UUID REFERENCES secure_grid_sessions(session_id),
  real_lat DECIMAL(10, 8),
  real_lng DECIMAL(11, 8),
  masked_lat DECIMAL(10, 8) NOT NULL,
  masked_lng DECIMAL(11, 8) NOT NULL,
  obfuscation_level VARCHAR(50) DEFAULT 'high',
  proxy_region VARCHAR(100),
  distance_offset DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS secure_grid_audit_log (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  session_id UUID REFERENCES secure_grid_sessions(session_id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  security_score INTEGER DEFAULT 0,
  threat_detected BOOLEAN DEFAULT false,
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON secure_grid_sessions(user_id);
CREATE INDEX idx_sessions_status ON secure_grid_sessions(status);
CREATE INDEX idx_keys_user ON secure_grid_keys(user_id);
CREATE INDEX idx_keys_active ON secure_grid_keys(is_active);
CREATE INDEX idx_messages_sender ON secure_grid_messages(sender_id);
CREATE INDEX idx_messages_recipient ON secure_grid_messages(recipient_id);
CREATE INDEX idx_messages_session ON secure_grid_messages(session_id);
CREATE INDEX idx_locations_user ON secure_grid_locations(user_id);
CREATE INDEX idx_audit_user ON secure_grid_audit_log(user_id);
CREATE INDEX idx_audit_created ON secure_grid_audit_log(created_at);
