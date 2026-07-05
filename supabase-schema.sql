-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Citizen input
  text_input TEXT,
  voice_transcript TEXT,
  photo_url TEXT,
  ocr_text TEXT,
  
  -- Location
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  geom GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    CASE 
      WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
      THEN ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
      ELSE NULL
    END
  ) STORED,
  
  -- Category & Language
  category TEXT NOT NULL CHECK (category IN ('education', 'healthcare', 'roads', 'water', 'sanitation', 'electricity', 'employment', 'other')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as')),
  
  -- Metadata
  source TEXT DEFAULT 'web' CHECK (source IN ('web', 'whatsapp', 'mobile', 'kiosk')),
  session_id TEXT,
  
  -- AI Analysis (populated after processing)
  theme_id UUID,
  theme_name TEXT,
  urgency_score SMALLINT CHECK (urgency_score BETWEEN 1 AND 5),
  priority_score DOUBLE PRECISION,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'analyzed', 'archived'))
);

-- Create indexes
CREATE INDEX idx_submissions_geom ON submissions USING GIST (geom);
CREATE INDEX idx_submissions_category ON submissions (category);
CREATE INDEX idx_submissions_language ON submissions (language);
CREATE INDEX idx_submissions_status ON submissions (status);
CREATE INDEX idx_submissions_created_at ON submissions (created_at DESC);
CREATE INDEX idx_submissions_theme ON submissions (theme_id);

-- Themes table (AI-generated clusters)
CREATE TABLE themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  submission_count INT DEFAULT 0,
  avg_urgency DOUBLE PRECISION,
  priority_score DOUBLE PRECISION,
  representative_submissions UUID[],
  bbox GEOGRAPHY(POLYGON, 4326),
  center_point GEOGRAPHY(POINT, 4326)
);

-- Census/Demographic data (static reference)
CREATE TABLE constituency_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT,
  district TEXT,
  population INT,
  literacy_rate DOUBLE PRECISION,
  geom GEOGRAPHY(POLYGON, 4326),
  metadata JSONB
);

-- Infrastructure gaps (static reference)
CREATE TABLE infrastructure_gaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  geom GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED,
  severity SMALLINT CHECK (severity BETWEEN 1 AND 5),
  source TEXT,
  metadata JSONB
);

-- RLS Policies
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituency_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_gaps ENABLE ROW LEVEL SECURITY;

-- Public read access for dashboard
CREATE POLICY "Public read submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Public read themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Public read constituency" ON constituency_data FOR SELECT USING (true);
CREATE POLICY "Public read infrastructure" ON infrastructure_gaps FOR SELECT USING (true);

-- Insert policy for submissions (anyone can submit)
CREATE POLICY "Anyone can insert submissions" ON submissions FOR INSERT WITH CHECK (true);

-- Service role can do everything (for AI processing)
CREATE POLICY "Service role full access submissions" ON submissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access themes" ON themes FOR ALL USING (auth.role() = 'service_role');