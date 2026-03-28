-- Subscription & Payment Tiers for R3AL Platform

CREATE TABLE subscription_tiers (
  tier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE, -- 'free', 'premium', 'tactical'
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  
  -- Feature limits
  chat_limit INTEGER, -- NULL = unlimited
  image_generation_limit INTEGER, -- NULL = unlimited
  ai_writing_access BOOLEAN DEFAULT false,
  unrestricted_content BOOLEAN DEFAULT false,
  writers_guild_access BOOLEAN DEFAULT false,
  tactical_features BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_subscriptions (
  subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(tier_id),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  
  -- Billing
  billing_period TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly', 'lifetime'
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
  -- Payment
  payment_method TEXT, -- 'stripe', 'apple', 'google', 'crypto'
  external_subscription_id TEXT, -- Stripe/Apple/Google subscription ID
  
  -- Usage tracking
  chat_usage_this_period INTEGER DEFAULT 0,
  image_generation_usage_this_period INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, tier_id)
);

CREATE TABLE payment_transactions (
  transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(subscription_id),
  
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  
  payment_method TEXT,
  external_transaction_id TEXT,
  
  description TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking for rate limiting
CREATE TABLE usage_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(subscription_id),
  
  feature_type TEXT NOT NULL, -- 'chat', 'image_generation', 'ai_writing'
  usage_count INTEGER DEFAULT 1,
  
  timestamp TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_usage_user_feature (user_id, feature_type, timestamp)
);

-- Insert default tiers
INSERT INTO subscription_tiers (
  tier_name, display_name, description, 
  price_monthly, price_yearly,
  chat_limit, image_generation_limit,
  ai_writing_access, unrestricted_content, 
  writers_guild_access, tactical_features
) VALUES 
(
  'free',
  'Free',
  'Basic access to R3AL platform',
  0.00,
  0.00,
  50, -- 50 chats per month
  10, -- 10 images per month
  false,
  false,
  false,
  false
),
(
  'premium',
  'Premium',
  'Unlimited chat, images, and Writers Guild access',
  14.99,
  149.99,
  NULL, -- unlimited
  NULL, -- unlimited
  true,
  true,
  true,
  false
),
(
  'tactical',
  'R3AL HQ Tactical',
  'Premium + Optima SR for military and first responders',
  29.99,
  299.99,
  NULL, -- unlimited
  NULL, -- unlimited
  true,
  true,
  true,
  true
);

-- Indexes for performance
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX idx_usage_logs_user_period ON usage_logs(user_id, timestamp);
