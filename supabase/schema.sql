-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT,
  project_type TEXT NOT NULL, -- 'MERN', 'MEAN', 'WordPress', 'PHP', 'Shopify'
  requirements TEXT NOT NULL,
  generated_proposal TEXT,
  cost_estimate DECIMAL(10,2),
  timeline_weeks INTEGER,
  complexity TEXT, -- 'simple', 'medium', 'complex'
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  embedding vector(1536) -- for similarity search
);

-- 2. Templates Table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  sections JSONB, -- {executive_summary, technical_approach, timeline, pricing}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tech Stacks Table
CREATE TABLE IF NOT EXISTS tech_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- 'MERN', 'MEAN', 'WordPress', 'PHP', 'Shopify'
  description TEXT,
  typical_features JSONB, -- Array of common features
  base_cost DECIMAL(10,2),
  cost_per_feature DECIMAL(10,2),
  base_timeline_weeks INTEGER,
  additional_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Sample Proposals (for training)
CREATE TABLE IF NOT EXISTS sample_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  project_type TEXT NOT NULL,
  full_content TEXT NOT NULL,
  requirements_excerpt TEXT,
  cost DECIMAL(10,2),
  timeline_weeks INTEGER,
  is_approved BOOLEAN DEFAULT true, -- Only use approved samples
  created_at TIMESTAMP DEFAULT NOW(),
  embedding vector(1536)
);

-- 5. Pricing Rules Table
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  project_type TEXT,
  base_cost DECIMAL(10,2),
  time_hours INTEGER,
  complexity_multiplier JSONB, -- {simple: 1, medium: 1.5, complex: 2}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_project_type ON proposals(project_type);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_templates_project_type ON templates(project_type);
CREATE INDEX IF NOT EXISTS idx_sample_proposals_type ON sample_proposals(project_type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
