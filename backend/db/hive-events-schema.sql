-- Temporal Hive Events Schema
-- Blueprint #4 - v2.41 IQ

-- Main events table
CREATE TABLE IF NOT EXISTS hive_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID NOT NULL,
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INT NOT NULL,
    ai_curator_notes JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    CHECK (duration > 0),
    CHECK (end_time > start_time)
);

-- Event participants tracking
CREATE TABLE IF NOT EXISTS event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES hive_events(event_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    join_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    leave_time TIMESTAMP WITH TIME ZONE,
    resonance_avg FLOAT,
    pulse_data JSONB DEFAULT '[]',
    emotion_data JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Event metrics aggregation
CREATE TABLE IF NOT EXISTS event_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES hive_events(event_id) ON DELETE CASCADE,
    avg_bpm FLOAT,
    avg_resonance FLOAT,
    peak_resonance FLOAT,
    emotion_distribution JSONB DEFAULT '{}',
    participant_count INT DEFAULT 0,
    coherence_score FLOAT,
    ai_summary TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id)
);

-- Live event data stream (temporary storage during events)
CREATE TABLE IF NOT EXISTS event_live_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES hive_events(event_id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    bpm FLOAT,
    resonance FLOAT,
    emotion_tone TEXT,
    emotion_value FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hive_events_circle ON hive_events(circle_id);
CREATE INDEX IF NOT EXISTS idx_hive_events_status ON hive_events(status);
CREATE INDEX IF NOT EXISTS idx_hive_events_start_time ON hive_events(start_time);
CREATE INDEX IF NOT EXISTS idx_event_participants_event ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_live_data_event ON event_live_data(event_id);
CREATE INDEX IF NOT EXISTS idx_event_live_data_timestamp ON event_live_data(timestamp);

-- Function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_hive_events_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hive_events_timestamp
    BEFORE UPDATE ON hive_events
    FOR EACH ROW
    EXECUTE FUNCTION update_hive_events_timestamp();

-- Function to clean up old live data (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_live_data()
RETURNS void AS $$
BEGIN
    DELETE FROM event_live_data 
    WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Function to auto-complete events
CREATE OR REPLACE FUNCTION auto_complete_events()
RETURNS void AS $$
BEGIN
    UPDATE hive_events 
    SET status = 'completed'
    WHERE status = 'active' 
    AND end_time < NOW();
END;
$$ LANGUAGE plpgsql;
