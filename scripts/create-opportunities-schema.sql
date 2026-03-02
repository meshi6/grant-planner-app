-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  organizer TEXT NOT NULL,
  focus_area TEXT, -- e.g., "Climate", "AI", "Health", "Education", "Social Impact"
  eligibility_type TEXT, -- e.g., "Nonprofit", "Individual", "Startup", "University", "Corporate"
  funding_amount_min DECIMAL,
  funding_amount_max DECIMAL,
  deadline TIMESTAMP,
  event_date TIMESTAMP,
  location TEXT, -- e.g., "Global", "North America", "USA", specific country/region
  url TEXT NOT NULL,
  status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'cron')),
  created_by UUID, -- User ID who created/submitted (null for cron)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_funding CHECK (funding_amount_min IS NULL OR funding_amount_max IS NULL OR funding_amount_min <= funding_amount_max)
);

-- Create opportunities_submissions table (for pending approvals)
CREATE TABLE IF NOT EXISTS opportunities_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  form_data JSONB NOT NULL, -- Full form submission data
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'cron')),
  admin_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID -- Admin user ID
);

-- Create flagged_opportunities table (for reporting issues)
CREATE TABLE IF NOT EXISTS flagged_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID, -- NULL if anonymous report
  reason TEXT NOT NULL, -- e.g., "Outdated", "Incorrect Info", "Spam", "Duplicate"
  resolved BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Create user_opportunities table (for tracking, dismissals, etc.)
CREATE TABLE IF NOT EXISTS user_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'viewed' CHECK (status IN ('tracked', 'dismissed', 'viewed', 'applied')),
  viewed_at TIMESTAMP,
  added_at TIMESTAMP DEFAULT NOW(),
  dismissed_at TIMESTAMP,
  UNIQUE(user_id, opportunity_id) -- Prevent duplicates
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_focus_area ON opportunities(focus_area);
CREATE INDEX IF NOT EXISTS idx_opportunities_eligibility ON opportunities(eligibility_type);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON opportunities_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON opportunities_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flagged_resolved ON flagged_opportunities(resolved);
CREATE INDEX IF NOT EXISTS idx_user_opps_user_status ON user_opportunities(user_id, status);

-- Enable Row Level Security
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flagged_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for opportunities table
-- Public read access to approved opportunities
CREATE POLICY "opportunities_select_approved" ON opportunities
  FOR SELECT
  USING (status = 'approved');

-- Admin read access to all
-- (assumes admin role exists; adjust based on your auth setup)
CREATE POLICY "opportunities_select_admin" ON opportunities
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Admin insert/update/delete
CREATE POLICY "opportunities_insert_admin" ON opportunities
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "opportunities_update_admin" ON opportunities
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "opportunities_delete_admin" ON opportunities
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for opportunities_submissions table (admin only)
CREATE POLICY "submissions_select_admin" ON opportunities_submissions
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "submissions_insert_admin" ON opportunities_submissions
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "submissions_update_admin" ON opportunities_submissions
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "submissions_delete_admin" ON opportunities_submissions
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for flagged_opportunities table
-- Users can insert (report) flags
CREATE POLICY "flags_insert_authenticated" ON flagged_opportunities
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admins can see all flags
CREATE POLICY "flags_select_admin" ON flagged_opportunities
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for user_opportunities table
-- Users can read/write their own records
CREATE POLICY "user_opps_select_own" ON user_opportunities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_opps_insert_own" ON user_opportunities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_opps_update_own" ON user_opportunities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_opps_delete_own" ON user_opportunities
  FOR DELETE
  USING (auth.uid() = user_id);
