-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Categories table
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en     TEXT NOT NULL,
  name_hi     TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  color       TEXT NOT NULL DEFAULT '#7B5BFF',
  osm_tags    JSONB DEFAULT '{}',
  sort_order  INTEGER DEFAULT 0
);

-- Shops table with PostGIS location column
CREATE TABLE shops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  location        GEOMETRY(Point, 4326) NOT NULL,
  address         TEXT,
  phone           TEXT,
  opening_hours   JSONB DEFAULT '{}',
  area            TEXT,
  city            TEXT NOT NULL DEFAULT 'Lucknow',
  audio_guide     TEXT,
  rating          NUMERIC(2,1) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  verified        BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Spatial index for fast nearest-shop queries
CREATE INDEX shops_location_idx ON shops USING GIST(location);
CREATE INDEX shops_city_idx ON shops(city);
CREATE INDEX shops_category_idx ON shops(category_id);
CREATE INDEX shops_active_idx ON shops(is_active, verified);

-- Community contributions
CREATE TABLE contributions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_data     JSONB NOT NULL,
  submitted_by  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Helper function: get shops near a coordinate within radius_m metres
CREATE OR REPLACE FUNCTION get_nearby_shops(
  lat FLOAT,
  lng FLOAT,
  radius_m FLOAT DEFAULT 2000,
  cat_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID, name TEXT, category_id UUID, address TEXT, phone TEXT,
  opening_hours JSONB, area TEXT, city TEXT, audio_guide TEXT,
  rating NUMERIC, review_count INTEGER, verified BOOLEAN,
  lat_out FLOAT, lng_out FLOAT, dist_m FLOAT
)
LANGUAGE sql STABLE AS $$
  SELECT
    s.id, s.name, s.category_id, s.address, s.phone,
    s.opening_hours, s.area, s.city, s.audio_guide,
    s.rating, s.review_count, s.verified,
    ST_Y(s.location::geometry) AS lat_out,
    ST_X(s.location::geometry) AS lng_out,
    ST_Distance(s.location::geography, ST_Point(lng, lat)::geography) AS dist_m
  FROM shops s
  LEFT JOIN categories c ON s.category_id = c.id
  WHERE
    s.is_active = true
    AND ST_DWithin(s.location::geography, ST_Point(lng, lat)::geography, radius_m)
    AND (cat_slug IS NULL OR c.slug = cat_slug)
  ORDER BY s.location <-> ST_Point(lng, lat)::geometry
  LIMIT 50;
$$;

-- Enable Row Level Security (public read, service-role write)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read shops" ON shops FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public insert contributions" ON contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own contributions" ON contributions FOR SELECT USING (true);
