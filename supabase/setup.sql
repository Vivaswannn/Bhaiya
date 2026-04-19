-- ============================================================
-- Bhaiya App — one-time Supabase setup
-- Run in: Supabase dashboard > SQL Editor
-- Safe to run multiple times (idempotent, no DROP statements)
-- ============================================================

-- 1. Row Level Security on contributions
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "allow_anon_insert" ON contributions
    FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "allow_auth_select" ON contributions
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "allow_auth_update" ON contributions
    FOR UPDATE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. call_events table — track call/WhatsApp taps per shop
CREATE TABLE IF NOT EXISTS call_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id    uuid NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  ts         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "allow_anon_insert_calls" ON call_events
    FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "allow_auth_select_calls" ON call_events
    FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Add featured column to shops (safe if already exists)
ALTER TABLE shops ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- 4. Admin view: shops ranked by call count (featured outreach trigger)
CREATE OR REPLACE VIEW shops_with_call_counts AS
  SELECT s.id, s.name, s.phone, s.area, s.featured,
         COUNT(ce.id) AS call_count
  FROM shops s
  LEFT JOIN call_events ce ON ce.shop_id = s.id
  GROUP BY s.id, s.name, s.phone, s.area, s.featured
  ORDER BY call_count DESC;

-- 5. insert_shop_from_contribution RPC
CREATE OR REPLACE FUNCTION insert_shop_from_contribution(
  p_name        text,
  p_category_id uuid,
  p_lat         float,
  p_lng         float,
  p_address     text DEFAULT NULL,
  p_phone       text DEFAULT NULL,
  p_area        text DEFAULT NULL,
  p_city        text DEFAULT 'Lucknow'
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO shops (name, category_id, address, phone, area, city, lat, lng, verified)
  VALUES (p_name, p_category_id, p_address, p_phone, p_area, p_city, p_lat, p_lng, false)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;
