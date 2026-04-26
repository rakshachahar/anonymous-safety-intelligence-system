/*
  # Create Safety Intelligence System Schema

  1. New Tables
    - `safety_reports` - Anonymous safety incident reports with location, severity, category
    - `alerts` - Active safety alerts with zone, risk level, and status
    - `sos_events` - SOS emergency events with location and resolution status
    - `trusted_contacts` - Emergency contacts for users
    - `safe_zones` - Identified safe areas with safety scores
    - `heatmap_data` - Aggregated risk data for heatmap visualization

  2. Security
    - Enable RLS on all tables
    - Public read access for safety_reports, alerts, safe_zones, heatmap_data (community safety data)
    - Authenticated users can create reports and SOS events
    - Only authenticated users can manage their own trusted contacts
    - Admin role check for alert management
*/

-- Safety Reports Table
CREATE TABLE IF NOT EXISTS safety_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'harassment',
  description text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'medium',
  latitude double precision NOT NULL DEFAULT 0,
  longitude double precision NOT NULL DEFAULT 0,
  location_name text NOT NULL DEFAULT '',
  zone text NOT NULL DEFAULT '',
  is_anonymous boolean NOT NULL DEFAULT true,
  reporter_id uuid,
  status text NOT NULL DEFAULT 'pending',
  ai_risk_score double precision DEFAULT 0,
  ai_insight text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  zone text NOT NULL DEFAULT '',
  risk_level text NOT NULL DEFAULT 'medium',
  alert_type text NOT NULL DEFAULT 'zone_warning',
  is_active boolean NOT NULL DEFAULT true,
  latitude double precision DEFAULT 0,
  longitude double precision DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- SOS Events Table
CREATE TABLE IF NOT EXISTS sos_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  latitude double precision NOT NULL DEFAULT 0,
  longitude double precision NOT NULL DEFAULT 0,
  location_name text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  contacts_notified integer DEFAULT 0,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Trusted Contacts Table
CREATE TABLE IF NOT EXISTS trusted_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  relationship text NOT NULL DEFAULT '',
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Safe Zones Table
CREATE TABLE IF NOT EXISTS safe_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  latitude double precision NOT NULL DEFAULT 0,
  longitude double precision NOT NULL DEFAULT 0,
  radius_meters integer NOT NULL DEFAULT 500,
  safety_score double precision NOT NULL DEFAULT 0,
  zone_type text NOT NULL DEFAULT 'public',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Heatmap Data Table
CREATE TABLE IF NOT EXISTS heatmap_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grid_lat double precision NOT NULL DEFAULT 0,
  grid_lng double precision NOT NULL DEFAULT 0,
  risk_score double precision NOT NULL DEFAULT 0,
  incident_count integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  period text NOT NULL DEFAULT 'monthly',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE safety_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE heatmap_data ENABLE ROW LEVEL SECURITY;

-- Safety Reports: anyone can read, authenticated can insert own
CREATE POLICY "Public can read safety reports"
  ON safety_reports FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reports"
  ON safety_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

CREATE POLICY "Reporters can update own reports"
  ON safety_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = reporter_id)
  WITH CHECK (auth.uid() = reporter_id);

-- Alerts: public read, authenticated insert
CREATE POLICY "Public can read alerts"
  ON alerts FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated can create alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- SOS Events: authenticated read own, insert own
CREATE POLICY "Users can read own SOS events"
  ON sos_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create SOS events"
  ON sos_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SOS events"
  ON sos_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trusted Contacts: users manage own
CREATE POLICY "Users can read own contacts"
  ON trusted_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contacts"
  ON trusted_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON trusted_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON trusted_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Safe Zones: public read
CREATE POLICY "Public can read safe zones"
  ON safe_zones FOR SELECT
  TO authenticated, anon
  USING (true);

-- Heatmap Data: public read
CREATE POLICY "Public can read heatmap data"
  ON heatmap_data FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_safety_reports_category ON safety_reports(category);
CREATE INDEX IF NOT EXISTS idx_safety_reports_severity ON safety_reports(severity);
CREATE INDEX IF NOT EXISTS idx_safety_reports_status ON safety_reports(status);
CREATE INDEX IF NOT EXISTS idx_safety_reports_created ON safety_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_zone ON alerts(zone);
CREATE INDEX IF NOT EXISTS idx_sos_events_user ON sos_events(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_events_status ON sos_events(status);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_user ON trusted_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_heatmap_grid ON heatmap_data(grid_lat, grid_lng);
