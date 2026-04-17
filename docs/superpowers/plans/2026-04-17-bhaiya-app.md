# Bhaiya App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade PWA that helps people moving to a new city find small hyperlocal shops (ration, sabzi, dairy, hardware, etc.) with GPS-based discovery, tap-to-call, and Hindi audio directions — demo-ready for Lucknow with real Supabase data.

**Architecture:** Next.js 14 App Router PWA with Tailwind CSS for UI, Supabase (PostgreSQL + PostGIS) for geospatial shop queries, Leaflet.js for the map, and the browser's Web Speech API for free Hindi audio guides. No backend server — all data access goes through Supabase's JS client directly from the browser.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase JS v2, Leaflet + react-leaflet, next-pwa, Jest + React Testing Library

---

## File Map

```
D:/MummyApp/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: fonts, theme provider, PWA meta
│   │   ├── page.tsx                    # Home screen
│   │   ├── map/page.tsx                # Map view (Naksha)
│   │   ├── shop/[id]/page.tsx          # Shop detail
│   │   ├── search/page.tsx             # Shop list / search (Dhundho)
│   │   ├── add/page.tsx                # Add a shop (Jodo)
│   │   ├── onboarding/page.tsx         # Splash / onboarding
│   │   └── admin/
│   │       ├── layout.tsx              # Admin auth guard
│   │       ├── page.tsx                # Admin dashboard
│   │       └── contributions/page.tsx  # Review contributions
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx              # Base button variants
│   │   │   ├── Card.tsx                # Glassmorphism / light card
│   │   │   ├── Badge.tsx               # KHULA / BAND / category badges
│   │   │   └── BottomSheet.tsx         # Mobile bottom sheet drawer
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx           # 4-tab bottom navigation
│   │   │   ├── TopBar.tsx              # Logo + location chip + notif
│   │   │   └── LocationChip.tsx        # GPS location pill with override
│   │   ├── shop/
│   │   │   ├── ShopCard.tsx            # List view card (icon, name, dist, badge)
│   │   │   ├── ShopDetail.tsx          # Full detail view
│   │   │   └── CategoryGrid.tsx        # 4×2 category grid with SVG icons
│   │   ├── map/
│   │   │   ├── LeafletMap.tsx          # react-leaflet wrapper (dynamic import)
│   │   │   ├── ShopPin.tsx             # Colour-coded map pin marker
│   │   │   └── MiniShopCard.tsx        # Popup card on pin tap
│   │   └── audio/
│   │       └── BhaiyaAudioButton.tsx   # Web Speech API TTS button
│   ├── lib/
│   │   ├── supabase.ts                 # Supabase browser client + server client
│   │   ├── types.ts                    # TypeScript types: Shop, Category, Contribution
│   │   ├── geo.ts                      # getNearbyShops(), distanceLabel(), isOpenNow()
│   │   ├── audio.ts                    # speakGuide(), stopGuide(), isSpeechSupported()
│   │   └── categories.ts               # Category definitions with SVG + colours
│   └── styles/
│       └── globals.css                 # Tailwind directives + CSS custom properties
├── public/
│   ├── manifest.json                   # PWA manifest
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── scripts/
│   └── import-osm.ts                   # Overpass API → Supabase importer
├── supabase/
│   └── migrations/
│       └── 001_initial.sql             # PostGIS + tables + indexes
└── __tests__/
    ├── lib/geo.test.ts
    ├── lib/audio.test.ts
    ├── components/ShopCard.test.tsx
    ├── components/Badge.test.tsx
    └── components/CategoryGrid.test.tsx
```

---

## Phase 0 — Foundation

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/styles/globals.css`

- [ ] **Step 1: Create the Next.js app**

Run from `D:/MummyApp`:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```
When prompted: Yes to all defaults.

Expected output: `Success! Created bhaiya-app`

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @supabase/supabase-js leaflet react-leaflet @types/leaflet next-pwa
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

- [ ] **Step 3: Install Google Fonts (Syne + Plus Jakarta Sans)**

In `src/app/layout.tsx`, replace the font import with:
```typescript
import { Syne, Plus_Jakarta_Sans } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
})
```

- [ ] **Step 4: Set up CSS custom properties in `src/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --violet:        #7B5BFF;
  --violet-dim:    rgba(123, 91, 255, 0.18);
  --violet-border: rgba(123, 91, 255, 0.3);
  --rose:          #FF4E8B;
  --cyan:          #00D9FF;
  --open-green:    #00dc64;
  --closed-red:    #ff7070;
  --bg-dark:       #07071c;
  --bg-light:      #f5f4fe;
}

.dark {
  color-scheme: dark;
}
```

- [ ] **Step 5: Update `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        violet: '#7B5BFF',
        'violet-dim': 'rgba(123,91,255,0.18)',
        'open-green': '#00dc64',
        'closed-red': '#ff7070',
        'bg-dark': '#07071c',
        'bg-light': '#f5f4fe',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: Configure Jest in `jest.config.ts`**

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 14 project with Tailwind, fonts, Jest"
```

---

### Task 2: Supabase database setup

**Files:**
- Create: `supabase/migrations/001_initial.sql`
- Create: `.env.local`

- [ ] **Step 1: Create Supabase project**

Go to supabase.com → New project → Name: `bhaiya-app` → Region: South Asia (Mumbai) → Note the Project URL and anon key.

- [ ] **Step 2: Create `.env.local`**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Add to `.gitignore`:
```
.env.local
```

- [ ] **Step 3: Create migration file `supabase/migrations/001_initial.sql`**

```sql
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
```

- [ ] **Step 4: Run migration in Supabase**

Go to Supabase dashboard → SQL Editor → paste contents of `001_initial.sql` → Run.

Expected: No errors. Tables visible in Table Editor.

- [ ] **Step 5: Seed categories**

Run in Supabase SQL Editor:
```sql
INSERT INTO categories (name_en, name_hi, slug, color, osm_tags, sort_order) VALUES
('Ration / Kirana', 'राशन / किराना', 'ration', '#9b7dff', '{"shop": "convenience", "shop": "grocery"}', 1),
('Vegetables', 'सब्जी', 'vegetables', '#00dc64', '{"shop": "greengrocer"}', 2),
('Milk / Dairy', 'दूध / डेयरी', 'dairy', '#38bdf8', '{"shop": "dairy"}', 3),
('Medical / Pharmacy', 'दवाई', 'medical', '#fb7185', '{"amenity": "pharmacy"}', 4),
('Hardware', 'हार्डवेयर', 'hardware', '#fbbf24', '{"shop": "hardware"}', 5),
('Tailor', 'दर्जी', 'tailor', '#2dd4bf', '{"shop": "tailor"}', 6),
('Pet Shop', 'पेट शॉप', 'pet', '#fb923c', '{"shop": "pet"}', 7),
('Salon / Parlour', 'सैलून', 'salon', '#f472b6', '{"shop": "hairdresser"}', 8),
('Bakery', 'बेकरी', 'bakery', '#a78bfa', '{"shop": "bakery"}', 9),
('Tiffin / Dabba', 'टिफिन', 'tiffin', '#34d399', '{"amenity": "restaurant"}', 10),
('Laundry / Dhobi', 'धोबी', 'laundry', '#60a5fa', '{"shop": "laundry"}', 11),
('Stationery', 'स्टेशनरी', 'stationery', '#c084fc', '{"shop": "stationery"}', 12),
('LPG / Gas', 'गैस', 'lpg', '#f59e0b', '{"shop": "gas"}', 13),
('Mechanic', 'मैकेनिक', 'mechanic', '#6b7280', '{"shop": "car_repair"}', 14),
('Mobile Repair', 'मोबाइल रिपेयर', 'mobile-repair', '#3b82f6', '{"shop": "mobile_phone"}', 15),
('ATM / Bank', 'बैंक / ATM', 'bank', '#10b981', '{"amenity": "atm"}', 16),
('Auto / Rickshaw Stand', 'ऑटो स्टैंड', 'auto-stand', '#f97316', '{"amenity": "taxi"}', 17),
('Doctor / Clinic', 'डॉक्टर', 'clinic', '#ef4444', '{"amenity": "clinic"}', 18),
('Electrician', 'इलेक्ट्रीशियन', 'electrician', '#eab308', '{"craft": "electrician"}', 19),
('Plumber', 'प्लम्बर', 'plumber', '#0ea5e9', '{"craft": "plumber"}', 20);
```

- [ ] **Step 6: Commit**

```bash
git add supabase/ .gitignore
git commit -m "feat: add Supabase schema with PostGIS and 20 categories"
```

---

### Task 3: PWA configuration

**Files:**
- Create: `public/manifest.json`
- Create: `next.config.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `public/manifest.json`**

```json
{
  "name": "Bhaiya App",
  "short_name": "Bhaiya",
  "description": "Naye sheher ka naya saathi — find local shops near you",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#07071c",
  "theme_color": "#7B5BFF",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

- [ ] **Step 2: Create PWA icons**

Create a simple violet square PNG (192×192 and 512×512) with "B" text. You can use any online PNG generator, or run:
```bash
# Creates a placeholder — replace with real branded icons before demo
node -e "
const { createCanvas } = require('canvas');
// If canvas not available, manually place 192x192 and 512x512 PNG files
// at public/icons/icon-192.png and public/icons/icon-512.png
console.log('Place icon files manually in public/icons/');
"
```

For now, copy any 192×192 PNG to `public/icons/icon-192.png` and a 512×512 PNG to `public/icons/icon-512.png`.

- [ ] **Step 3: Configure `next.config.ts` with next-pwa**

```typescript
import type { NextConfig } from 'next'
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
```

- [ ] **Step 4: Add PWA meta tags to `src/app/layout.tsx`**

```typescript
import type { Metadata, Viewport } from 'next'
import { Syne, Plus_Jakarta_Sans } from 'next/font/google'
import '@/styles/globals.css'

const syne = Syne({ subsets: ['latin'], weight: ['600','700','800'], variable: '--font-syne' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: 'Bhaiya App',
  description: 'Naye sheher mein? Bhaiya hai na!',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Bhaiya App' },
}

export const viewport: Viewport = {
  themeColor: '#7B5BFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${syne.variable} ${jakarta.variable} font-jakarta bg-bg-dark text-white`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: `http://localhost:3000` opens without errors in browser.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure PWA manifest, next-pwa, and root layout"
```

---

## Phase 1 — Design System & Layout Components

### Task 4: TypeScript types and Supabase client

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/supabase.ts`
- Create: `src/lib/categories.ts`

- [ ] **Step 1: Write types in `src/lib/types.ts`**

```typescript
export interface Category {
  id: string
  name_en: string
  name_hi: string
  slug: string
  color: string
  sort_order: number
}

export interface OpeningHours {
  mon?: { open: string; close: string }
  tue?: { open: string; close: string }
  wed?: { open: string; close: string }
  thu?: { open: string; close: string }
  fri?: { open: string; close: string }
  sat?: { open: string; close: string }
  sun?: { open: string; close: string }
}

export interface Shop {
  id: string
  name: string
  category_id: string | null
  address: string | null
  phone: string | null
  opening_hours: OpeningHours | null
  area: string | null
  city: string
  audio_guide: string | null
  rating: number
  review_count: number
  verified: boolean
  lat: number
  lng: number
  dist_m?: number
  category?: Category
}

export interface Contribution {
  id: string
  shop_data: Partial<Shop>
  submitted_by: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
}
```

- [ ] **Step 2: Create Supabase client in `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, anon)

export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey)
}
```

- [ ] **Step 3: Create category definitions with SVG icons in `src/lib/categories.ts`**

```typescript
export interface CategoryDef {
  slug: string
  name_en: string
  name_hi: string
  color: string
  iconPath: string  // SVG path data (viewBox 0 0 24 24)
}

export const CATEGORY_DEFS: CategoryDef[] = [
  {
    slug: 'ration',
    name_en: 'Ration',
    name_hi: 'राशन',
    color: '#9b7dff',
    iconPath: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0',
  },
  {
    slug: 'vegetables',
    name_en: 'Sabzi',
    name_hi: 'सब्जी',
    color: '#00dc64',
    iconPath: 'M12 22V12M5 12c0-4.4 3.1-8 7-8 3.9 0 7 3.6 7 8H5z',
  },
  {
    slug: 'dairy',
    name_en: 'Milk',
    name_hi: 'दूध',
    color: '#38bdf8',
    iconPath: 'M8 2h8l2 4v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6l2-4zM6 6h12M12 11v6M9 13.5h6',
  },
  {
    slug: 'medical',
    name_en: 'Medical',
    name_hi: 'दवाई',
    color: '#fb7185',
    iconPath: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
  {
    slug: 'hardware',
    name_en: 'Hardware',
    name_hi: 'हार्डवेयर',
    color: '#fbbf24',
    iconPath: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  },
  {
    slug: 'tailor',
    name_en: 'Tailor',
    name_hi: 'दर्जी',
    color: '#2dd4bf',
    iconPath: 'M6 3a3 3 0 100 6 3 3 0 000-6zm0 12a3 3 0 100 6 3 3 0 000-6zm14-9L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12',
  },
  {
    slug: 'pet',
    name_en: 'Pet Shop',
    name_hi: 'पेट शॉप',
    color: '#fb923c',
    iconPath: 'M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 2.261M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 2.261M8 14c.5 2.5 2 4 4 4s3.5-1.5 4-4c.667-3.5-1-6-4-6s-4.667 2.5-4 6z',
  },
  {
    slug: 'more',
    name_en: 'More',
    name_hi: 'और',
    color: 'rgba(255,255,255,0.5)',
    iconPath: 'M12 12h.01M19 12h.01M5 12h.01',
  },
]

export function getCategoryDef(slug: string): CategoryDef | undefined {
  return CATEGORY_DEFS.find(c => c.slug === slug)
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/
git commit -m "feat: add TypeScript types, Supabase client, and category definitions"
```

---

### Task 5: Geo utilities

**Files:**
- Create: `src/lib/geo.ts`
- Create: `__tests__/lib/geo.test.ts`

- [ ] **Step 1: Write failing tests in `__tests__/lib/geo.test.ts`**

```typescript
import { distanceLabel, isOpenNow, formatPhone } from '@/lib/geo'

describe('distanceLabel', () => {
  it('returns metres for distances under 1km', () => {
    expect(distanceLabel(120)).toBe('120m')
  })
  it('rounds metres to nearest 10', () => {
    expect(distanceLabel(124)).toBe('120m')
  })
  it('returns km for distances 1000m and over', () => {
    expect(distanceLabel(1500)).toBe('1.5 km')
  })
  it('returns 1 decimal place for km', () => {
    expect(distanceLabel(2340)).toBe('2.3 km')
  })
})

describe('isOpenNow', () => {
  it('returns false for null opening_hours', () => {
    expect(isOpenNow(null)).toBe(false)
  })
  it('returns false for empty opening_hours', () => {
    expect(isOpenNow({})).toBe(false)
  })
  it('returns true when current time is within hours', () => {
    // Mock: Wednesday 10:00
    jest.useFakeTimers().setSystemTime(new Date('2024-01-03T10:00:00'))
    const hours = { wed: { open: '08:00', close: '21:00' } }
    expect(isOpenNow(hours)).toBe(true)
    jest.useRealTimers()
  })
  it('returns false when current time is outside hours', () => {
    // Mock: Wednesday 22:00
    jest.useFakeTimers().setSystemTime(new Date('2024-01-03T22:00:00'))
    const hours = { wed: { open: '08:00', close: '21:00' } }
    expect(isOpenNow(hours)).toBe(false)
    jest.useRealTimers()
  })
})

describe('formatPhone', () => {
  it('returns null for null input', () => {
    expect(formatPhone(null)).toBe(null)
  })
  it('returns the phone string as-is if already formatted', () => {
    expect(formatPhone('9876543210')).toBe('9876543210')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- geo.test.ts
```

Expected: `Cannot find module '@/lib/geo'`

- [ ] **Step 3: Implement `src/lib/geo.ts`**

```typescript
import { OpeningHours, Shop } from './types'
import { supabase } from './supabase'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
type DayKey = typeof DAY_KEYS[number]

export function distanceLabel(metres: number): string {
  if (metres < 1000) {
    return `${Math.round(metres / 10) * 10}m`
  }
  return `${(metres / 1000).toFixed(1)} km`
}

export function isOpenNow(hours: OpeningHours | null): boolean {
  if (!hours) return false
  const now = new Date()
  const day = DAY_KEYS[now.getDay()] as DayKey
  const todayHours = hours[day]
  if (!todayHours) return false
  const current = now.getHours() * 60 + now.getMinutes()
  const [openH, openM] = todayHours.open.split(':').map(Number)
  const [closeH, closeM] = todayHours.close.split(':').map(Number)
  return current >= openH * 60 + openM && current < closeH * 60 + closeM
}

export function formatPhone(phone: string | null): string | null {
  return phone
}

export async function getNearbyShops(
  lat: number,
  lng: number,
  radiusM = 2000,
  categorySlug?: string
): Promise<Shop[]> {
  const { data, error } = await supabase.rpc('get_nearby_shops', {
    lat,
    lng,
    radius_m: radiusM,
    cat_slug: categorySlug ?? null,
  })
  if (error) throw error
  return (data as any[]).map(row => ({
    id: row.id,
    name: row.name,
    category_id: row.category_id,
    address: row.address,
    phone: row.phone,
    opening_hours: row.opening_hours,
    area: row.area,
    city: row.city,
    audio_guide: row.audio_guide,
    rating: row.rating,
    review_count: row.review_count,
    verified: row.verified,
    lat: row.lat_out,
    lng: row.lng_out,
    dist_m: row.dist_m,
  }))
}

export async function getShopById(id: string): Promise<Shop | null> {
  const { data, error } = await supabase
    .from('shops')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()
  if (error) return null
  return {
    ...data,
    lat: 0,
    lng: 0,
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- geo.test.ts
```

Expected: `4 tests passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/geo.ts __tests__/lib/geo.test.ts
git commit -m "feat: add geo utilities with tests (distanceLabel, isOpenNow, getNearbyShops)"
```

---

### Task 6: Audio utility

**Files:**
- Create: `src/lib/audio.ts`
- Create: `__tests__/lib/audio.test.ts`

- [ ] **Step 1: Write failing test in `__tests__/lib/audio.test.ts`**

```typescript
import { isSpeechSupported, buildUtterance } from '@/lib/audio'

describe('isSpeechSupported', () => {
  it('returns false when speechSynthesis is not in window', () => {
    const original = (global as any).speechSynthesis
    delete (global as any).speechSynthesis
    expect(isSpeechSupported()).toBe(false)
    ;(global as any).speechSynthesis = original
  })
  it('returns true when speechSynthesis is present', () => {
    ;(global as any).speechSynthesis = { speak: jest.fn() }
    expect(isSpeechSupported()).toBe(true)
  })
})

describe('buildUtterance', () => {
  it('creates an utterance with the given text', () => {
    const u = buildUtterance('Namaste')
    expect(u.text).toBe('Namaste')
  })
  it('sets lang to hi-IN', () => {
    const u = buildUtterance('Namaste')
    expect(u.lang).toBe('hi-IN')
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- audio.test.ts
```

Expected: `Cannot find module '@/lib/audio'`

- [ ] **Step 3: Implement `src/lib/audio.ts`**

```typescript
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function buildUtterance(text: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'hi-IN'
  u.rate = 0.9
  u.pitch = 1.0
  return u
}

export function speakGuide(text: string): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(buildUtterance(text))
}

export function stopGuide(): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- audio.test.ts
```

Expected: `3 tests passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/audio.ts __tests__/lib/audio.test.ts
git commit -m "feat: add Web Speech API audio utility with tests"
```

---

### Task 7: Core UI components

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `__tests__/components/Badge.test.tsx`

- [ ] **Step 1: Write failing test for Badge in `__tests__/components/Badge.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@/components/ui/Badge'

describe('StatusBadge', () => {
  it('renders KHULA for open=true', () => {
    render(<StatusBadge open={true} />)
    expect(screen.getByText('KHULA')).toBeInTheDocument()
  })
  it('renders BAND for open=false', () => {
    render(<StatusBadge open={false} />)
    expect(screen.getByText('BAND')).toBeInTheDocument()
  })
  it('applies green class for open', () => {
    render(<StatusBadge open={true} />)
    const badge = screen.getByText('KHULA')
    expect(badge).toHaveClass('text-open-green')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- Badge.test.tsx
```

- [ ] **Step 3: Create `src/components/ui/Badge.tsx`**

```typescript
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  open: boolean
  className?: string
}

export function StatusBadge({ open, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'text-[7px] font-bold rounded-full px-2 py-0.5 border shrink-0',
        open
          ? 'bg-open-green/10 text-open-green border-open-green/25'
          : 'bg-closed-red/10 text-closed-red border-closed-red/20',
        className
      )}
    >
      {open ? 'KHULA' : 'BAND'}
    </span>
  )
}

interface CategoryBadgeProps {
  label: string
  color: string
  className?: string
}

export function CategoryBadge({ label, color, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn('text-[9px] font-semibold rounded-full px-2.5 py-0.5', className)}
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  )
}
```

- [ ] **Step 4: Create `src/lib/utils.ts`** (needed by Badge and all components)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install deps:
```bash
npm install clsx tailwind-merge
```

- [ ] **Step 5: Create `src/components/ui/Button.tsx`**

```typescript
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'font-jakarta font-semibold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2',
        {
          'bg-violet text-white shadow-lg shadow-violet/30 hover:bg-violet/90': variant === 'primary',
          'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 backdrop-blur-md': variant === 'glass',
          'text-violet hover:bg-violet/10': variant === 'ghost',
        },
        {
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 6: Create `src/components/ui/Card.tsx`**

```typescript
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'light'
}

export function Card({ variant = 'glass', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all',
        {
          'bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl': variant === 'glass',
          'bg-white border border-violet/[0.06] shadow-sm shadow-violet/5': variant === 'light',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 7: Run Badge tests — verify they pass**

```bash
npm test -- Badge.test.tsx
```

Expected: `3 tests passed`

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/ src/lib/utils.ts __tests__/components/Badge.test.tsx
git commit -m "feat: add Badge, Button, Card UI components with tests"
```

---

### Task 8: Layout components

**Files:**
- Create: `src/components/layout/BottomNav.tsx`
- Create: `src/components/layout/TopBar.tsx`
- Create: `src/components/layout/LocationChip.tsx`

- [ ] **Step 1: Create `src/components/layout/BottomNav.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/map',
    label: 'Naksha',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Dhundho',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: '/add',
    label: 'Jodo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-dark/90 backdrop-blur-2xl border-t border-white/[0.06] flex pb-safe">
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors',
              active ? 'text-violet' : 'text-white/30 hover:text-white/60'
            )}
          >
            {item.icon}
            <span className="text-[8px] font-semibold">{item.label}</span>
            {active && <span className="w-1 h-1 rounded-full bg-violet" />}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/LocationChip.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'

interface LocationChipProps {
  onLocation?: (lat: number, lng: number) => void
}

export function LocationChip({ onLocation }: LocationChipProps) {
  const [area, setArea] = useState('Lucknow')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        onLocation?.(lat, lng)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await res.json()
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district
          if (suburb) setArea(suburb)
        } catch {}
        setLoading(false)
      },
      () => setLoading(false)
    )
  }, [])

  return (
    <button className="inline-flex items-center gap-1.5 bg-violet/10 border border-violet/25 rounded-full px-3 py-1 backdrop-blur-md">
      <svg width="9" height="11" viewBox="0 0 12 14" fill="#7B5BFF">
        <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 116 3.5a1.5 1.5 0 010 3z"/>
      </svg>
      <span className="text-[9px] font-semibold text-white/65">
        {loading ? '...' : area}
      </span>
      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
        <path d="M3 4.5l3 3 3-3"/>
      </svg>
    </button>
  )
}
```

- [ ] **Step 3: Create `src/components/layout/TopBar.tsx`**

```typescript
import { LocationChip } from './LocationChip'

interface TopBarProps {
  onLocation?: (lat: number, lng: number) => void
}

export function TopBar({ onLocation }: TopBarProps) {
  return (
    <div className="flex flex-col gap-2 pt-8 pb-0 px-5">
      <div className="flex items-center justify-between">
        <h1 className="font-syne text-xl font-extrabold tracking-tight bg-gradient-to-br from-white to-violet/70 bg-clip-text text-transparent">
          Bhaiya App
        </h1>
        <button className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center" aria-label="Notifications">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </div>
      <LocationChip onLocation={onLocation} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add BottomNav, TopBar, LocationChip layout components"
```

---

### Task 9: Shop components

**Files:**
- Create: `src/components/shop/CategoryIcon.tsx`
- Create: `src/components/shop/CategoryGrid.tsx`
- Create: `src/components/shop/ShopCard.tsx`
- Create: `__tests__/components/ShopCard.test.tsx`

- [ ] **Step 1: Create `src/components/shop/CategoryIcon.tsx`**

```typescript
import { getCategoryDef } from '@/lib/categories'

interface CategoryIconProps {
  slug: string
  size?: number
  withBg?: boolean
}

export function CategoryIcon({ slug, size = 20, withBg = false }: CategoryIconProps) {
  const def = getCategoryDef(slug)
  if (!def) return null
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={def.color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={def.iconPath} />
    </svg>
  )
  if (!withBg) return icon
  return (
    <span
      className="flex items-center justify-center rounded-xl"
      style={{
        width: size + 16,
        height: size + 16,
        background: `${def.color}1a`,
      }}
    >
      {icon}
    </span>
  )
}
```

- [ ] **Step 2: Create `src/components/shop/CategoryGrid.tsx`**

```typescript
'use client'
import { cn } from '@/lib/utils'
import { CATEGORY_DEFS } from '@/lib/categories'
import { CategoryIcon } from './CategoryIcon'

interface CategoryGridProps {
  selected?: string | null
  onSelect?: (slug: string | null) => void
}

const VISIBLE = CATEGORY_DEFS.slice(0, 8)

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 px-5">
      {VISIBLE.map(cat => {
        const active = selected === cat.slug
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect?.(active ? null : cat.slug)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-2xl py-2.5 border transition-all active:scale-95',
              active
                ? 'bg-violet/20 border-violet/45'
                : 'bg-white/[0.05] border-white/[0.08]'
            )}
          >
            <CategoryIcon slug={cat.slug} size={22} />
            <span className={cn('text-[8px] font-semibold', active ? 'text-violet/90' : 'text-white/45')}>
              {cat.name_en === 'More' ? cat.name_en : cat.name_hi}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Write failing test in `__tests__/components/ShopCard.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react'
import { ShopCard } from '@/components/shop/ShopCard'
import { Shop } from '@/lib/types'

const mockShop: Shop = {
  id: '1',
  name: 'Sharma General Store',
  category_id: 'cat-1',
  address: 'Hazratganj',
  phone: '9876543210',
  opening_hours: { mon: { open: '08:00', close: '21:00' } },
  area: 'Hazratganj',
  city: 'Lucknow',
  audio_guide: null,
  rating: 4.8,
  review_count: 42,
  verified: true,
  lat: 26.85,
  lng: 80.94,
  dist_m: 120,
}

describe('ShopCard', () => {
  it('renders shop name', () => {
    render(<ShopCard shop={mockShop} categorySlug="ration" />)
    expect(screen.getByText('Sharma General Store')).toBeInTheDocument()
  })
  it('renders distance label', () => {
    render(<ShopCard shop={mockShop} categorySlug="ration" />)
    expect(screen.getByText(/120m/)).toBeInTheDocument()
  })
  it('renders phone number', () => {
    render(<ShopCard shop={mockShop} categorySlug="ration" />)
    expect(screen.getByText('9876543210')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run test — verify it fails**

```bash
npm test -- ShopCard.test.tsx
```

- [ ] **Step 5: Create `src/components/shop/ShopCard.tsx`**

```typescript
import Link from 'next/link'
import { Shop } from '@/lib/types'
import { distanceLabel, isOpenNow } from '@/lib/geo'
import { StatusBadge } from '@/components/ui/Badge'
import { CategoryIcon } from './CategoryIcon'

interface ShopCardProps {
  shop: Shop
  categorySlug?: string
}

export function ShopCard({ shop, categorySlug }: ShopCardProps) {
  const open = isOpenNow(shop.opening_hours)
  return (
    <Link
      href={`/shop/${shop.id}`}
      className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3 backdrop-blur-xl active:scale-[0.98] transition-transform"
    >
      <CategoryIcon slug={categorySlug ?? 'more'} size={18} withBg />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-white truncate">{shop.name}</p>
        <p className="text-[9px] text-white/40 mt-0.5">
          {shop.dist_m != null && distanceLabel(shop.dist_m)} · ⭐ {shop.rating}
          {shop.phone && ` · ${shop.phone}`}
        </p>
      </div>
      <StatusBadge open={open} />
    </Link>
  )
}
```

- [ ] **Step 6: Run test — verify it passes**

```bash
npm test -- ShopCard.test.tsx
```

Expected: `3 tests passed`

- [ ] **Step 7: Commit**

```bash
git add src/components/shop/ __tests__/components/ShopCard.test.tsx
git commit -m "feat: add CategoryIcon, CategoryGrid, ShopCard components with tests"
```

---

## Phase 2 — Screens

### Task 10: Home screen

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Implement `src/app/page.tsx`**

```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { ShopCard } from '@/components/shop/ShopCard'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { getNearbyShops } from '@/lib/geo'
import { Shop } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  const handleLocation = useCallback(async (lat: number, lng: number) => {
    setLocation({ lat, lng })
    setLoading(true)
    try {
      const nearby = await getNearbyShops(lat, lng, 2000)
      setShops(nearby)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCategorySelect = useCallback(async (slug: string | null) => {
    setSelectedCat(slug)
    if (!location) return
    setLoading(true)
    try {
      const nearby = await getNearbyShops(location.lat, location.lng, 2000, slug ?? undefined)
      setShops(nearby)
    } finally {
      setLoading(false)
    }
  }, [location])

  const getCategorySlug = (categoryId: string | null) =>
    categories.find(c => c.id === categoryId)?.slug ?? 'more'

  return (
    <main className="min-h-screen bg-bg-dark relative overflow-hidden pb-24">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full -top-32 -left-20 bg-violet/[0.15] blur-[100px] animate-pulse" />
        <div className="absolute w-[350px] h-[350px] rounded-full top-60 -right-16 bg-rose/[0.08] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <TopBar onLocation={handleLocation} />

        {/* Search bar */}
        <div className="mx-5 mt-3 flex items-center gap-2.5 bg-white/[0.055] border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-2xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-[11px] text-white/30 flex-1">Kya dhundh rahe ho?</span>
          <button className="w-6 h-6 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center">
            <svg width="10" height="11" viewBox="0 0 24 24" fill="none" stroke="#9b7dff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
          </button>
        </div>

        {/* Section: Categories */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Categories</span>
          <span className="text-[9px] font-semibold text-violet">Sab dekho →</span>
        </div>
        <CategoryGrid selected={selectedCat} onSelect={handleCategorySelect} />

        {/* Section: Nearby */}
        <div className="px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
            Aas-paas khule hain
          </span>
        </div>

        {loading && (
          <div className="px-5 text-[11px] text-white/30 text-center py-4">Dhundh rahe hain...</div>
        )}

        {!loading && shops.length === 0 && location && (
          <div className="px-5 text-[11px] text-white/30 text-center py-6">
            Is area mein koi shop nahi mili. <br />
            <span className="text-violet">Kya aap ek jodenge?</span>
          </div>
        )}

        {!location && (
          <div className="px-5 text-[11px] text-white/30 text-center py-6">
            Location allow karein shops dekhne ke liye
          </div>
        )}

        <div className="px-5 flex flex-col gap-2.5">
          {shops.slice(0, 8).map(shop => (
            <ShopCard
              key={shop.id}
              shop={shop}
              categorySlug={getCategorySlug(shop.category_id)}
            />
          ))}
        </div>

        {/* Bhaiya Audio Card */}
        <div className="mx-5 mt-4">
          <BhaiyaAudioButton
            text="Bhaiya App mein aapka swagat hai! Apne aas-paas ki dukaanein dhundhen aur unke malik se seedha baat karein."
          />
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
```

- [ ] **Step 2: Verify home screen renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: Home screen visible with categories grid and search bar.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: implement home screen with GPS shop discovery and category filtering"
```

---

### Task 11: Audio button component

**Files:**
- Create: `src/components/audio/BhaiyaAudioButton.tsx`

- [ ] **Step 1: Create `src/components/audio/BhaiyaAudioButton.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { speakGuide, stopGuide, isSpeaking, isSpeechSupported } from '@/lib/audio'
import { cn } from '@/lib/utils'

interface BhaiyaAudioButtonProps {
  text: string
  className?: string
}

export function BhaiyaAudioButton({ text, className }: BhaiyaAudioButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(isSpeechSupported())
  }, [])

  function handleToggle() {
    if (speaking) {
      stopGuide()
      setSpeaking(false)
    } else {
      speakGuide(text)
      setSpeaking(true)
      const interval = setInterval(() => {
        if (!isSpeaking()) {
          setSpeaking(false)
          clearInterval(interval)
        }
      }, 300)
    }
  }

  if (!supported) return null

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'w-full flex items-center gap-3 rounded-2xl p-3 border transition-all active:scale-[0.98]',
        speaking
          ? 'bg-violet/20 border-violet/40'
          : 'bg-gradient-to-r from-violet/15 to-rose/10 border-violet/25',
        className
      )}
    >
      <div className="w-8 h-8 rounded-xl bg-violet/25 border border-violet/40 flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b0ff" strokeWidth="2.5" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 010 7.07"/>
          {speaking && <path d="M19.07 4.93a10 10 0 010 14.14"/>}
        </svg>
      </div>
      <div className="text-left">
        <p className="text-[10px] font-bold text-violet/90">
          {speaking ? 'Bhaiya bol raha hai...' : 'Bhaiya se puchho 🔊'}
        </p>
        <p className="text-[8px] text-white/30">Audio guide suniye — Hindi mein</p>
      </div>
      <div className="ml-auto w-6 h-6 rounded-full bg-violet/30 border border-violet/45 flex items-center justify-center shrink-0">
        {speaking ? (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="#c4b0ff">
            <rect x="1" y="1" width="3" height="8" rx="1"/>
            <rect x="6" y="1" width="3" height="8" rx="1"/>
          </svg>
        ) : (
          <svg width="8" height="10" viewBox="0 0 10 12" fill="#c4b0ff">
            <path d="M1 1l8 5-8 5V1z"/>
          </svg>
        )}
      </div>
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/audio/
git commit -m "feat: add BhaiyaAudioButton with Web Speech API play/stop toggle"
```

---

### Task 12: Shop detail screen

**Files:**
- Create: `src/app/shop/[id]/page.tsx`

- [ ] **Step 1: Create `src/app/shop/[id]/page.tsx`**

```typescript
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getShopById } from '@/lib/geo'
import { isOpenNow } from '@/lib/geo'
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge'
import { CategoryIcon } from '@/components/shop/CategoryIcon'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { Button } from '@/components/ui/Button'

interface Props {
  params: { id: string }
}

const DAY_LABELS: Record<string, string> = {
  mon: 'Somwar', tue: 'Mangal', wed: 'Budh', thu: 'Guruwar',
  fri: 'Shukra', sat: 'Shanivaar', sun: 'Raviwar',
}

export default async function ShopDetailPage({ params }: Props) {
  const shop = await getShopById(params.id)
  if (!shop) notFound()

  const open = isOpenNow(shop.opening_hours)
  const categorySlug = (shop.category as any)?.slug ?? 'more'
  const categoryName = (shop.category as any)?.name_hi ?? ''

  return (
    <main className="min-h-screen bg-bg-dark pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-20 left-1/2 -translate-x-1/2 bg-violet/[0.12] blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* Back button */}
        <div className="px-5 pt-12 pb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-xs">Wapas</span>
          </Link>
        </div>

        {/* Hero card */}
        <div className="mx-5 bg-white/[0.05] border border-white/[0.08] rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CategoryIcon slug={categorySlug} size={24} withBg />
              <div>
                <h1 className="font-syne text-lg font-bold text-white leading-tight">{shop.name}</h1>
                {categoryName && (
                  <CategoryBadge label={categoryName} color={(shop.category as any)?.color ?? '#7B5BFF'} className="mt-1" />
                )}
              </div>
            </div>
            <StatusBadge open={open} className="mt-1" />
          </div>

          {shop.address && (
            <p className="text-[11px] text-white/45 mt-3 flex items-start gap-1.5">
              <svg width="11" height="13" viewBox="0 0 12 14" fill="rgba(255,255,255,0.35)" className="mt-0.5 shrink-0">
                <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 116 3.5a1.5 1.5 0 010 3z"/>
              </svg>
              {shop.address}{shop.area ? `, ${shop.area}` : ''}
            </p>
          )}

          {shop.rating > 0 && (
            <p className="text-[11px] text-white/40 mt-1.5">⭐ {shop.rating} · {shop.review_count} reviews</p>
          )}
        </div>

        {/* Tap to call */}
        {shop.phone && (
          <div className="mx-5 mt-3">
            <a href={`tel:${shop.phone}`}>
              <Button variant="primary" size="lg" className="w-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.61 19.79 19.79 0 01.09 1a2 2 0 012-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Call: {shop.phone}
              </Button>
            </a>
          </div>
        )}

        {/* Opening hours */}
        {shop.opening_hours && Object.keys(shop.opening_hours).length > 0 && (
          <div className="mx-5 mt-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">Khulne ka waqt</p>
            <div className="space-y-1.5">
              {Object.entries(shop.opening_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-[10px]">
                  <span className="text-white/50">{DAY_LABELS[day] ?? day}</span>
                  <span className="text-white/80 font-medium">{hours.open} – {hours.close}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio guide */}
        {shop.audio_guide && (
          <div className="mx-5 mt-3">
            <BhaiyaAudioButton text={shop.audio_guide} />
          </div>
        )}

        {/* Report link */}
        <div className="mx-5 mt-4 text-center">
          <Link href={`/add?report=${shop.id}`} className="text-[10px] text-white/25 hover:text-white/50 transition-colors">
            Galat info hai? Report karo
          </Link>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/shop/
git commit -m "feat: add shop detail screen with tap-to-call, hours, and audio guide"
```

---

### Task 13: Map view

**Files:**
- Create: `src/components/map/LeafletMap.tsx`
- Create: `src/app/map/page.tsx`

- [ ] **Step 1: Create `src/components/map/LeafletMap.tsx`**

```typescript
'use client'
import { useEffect, useRef } from 'react'
import { Shop } from '@/lib/types'
import { isOpenNow } from '@/lib/geo'
import { getCategoryDef } from '@/lib/categories'

interface LeafletMapProps {
  shops: Shop[]
  center?: [number, number]
  categoryColors: Record<string, string>
  onShopClick?: (shop: Shop) => void
}

export function LeafletMap({ shops, center = [26.8467, 80.9462], categoryColors, onShopClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('leaflet').then(L => {
      if (!mapRef.current || mapInstanceRef.current) return

      // Fix Leaflet default icon paths for Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center,
        zoom: 14,
        zoomControl: false,
      })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then(L => {
      const map = mapInstanceRef.current
      // Remove existing shop markers (keep tile layer)
      map.eachLayer((layer: any) => {
        if (layer._bhaiyaShop) map.removeLayer(layer)
      })

      shops.forEach(shop => {
        const def = getCategoryDef(
          Object.keys(categoryColors).find(slug =>
            categoryColors[slug] === (shop.category as any)?.color
          ) ?? 'more'
        )
        const color = def?.color ?? '#7B5BFF'
        const open = isOpenNow(shop.opening_hours)

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:${color}33;border:2px solid ${color};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 8px ${color}55;
          ">
            <div style="width:8px;height:8px;border-radius:50%;background:${open ? '#00dc64' : '#ff7070'};"></div>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker([shop.lat, shop.lng], { icon }).addTo(map)
        ;(marker as any)._bhaiyaShop = true
        marker.bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <strong style="font-size:12px">${shop.name}</strong><br>
            <span style="font-size:10px;color:#666">${shop.area ?? ''}</span><br>
            ${shop.phone ? `<a href="tel:${shop.phone}" style="font-size:11px;color:#7B5BFF">📞 ${shop.phone}</a>` : ''}
          </div>
        `)
        marker.on('click', () => onShopClick?.(shop))
      })
    })
  }, [shops])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}
```

- [ ] **Step 2: Create `src/app/map/page.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap').then(m => m.LeafletMap),
  { ssr: false }
)

export default function MapPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [center, setCenter] = useState<[number, number]>([26.8467, 80.9462])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => { if (data) setCategories(data) })
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      setCenter([lat, lng])
      getNearbyShops(lat, lng, 3000).then(setShops)
    }, () => {
      getNearbyShops(26.8467, 80.9462, 3000).then(setShops)
    })
  }, [])

  const categoryColors = Object.fromEntries(categories.map(c => [c.slug, c.color]))

  return (
    <main className="h-screen flex flex-col bg-bg-dark">
      <div className="px-5 pt-10 pb-3 bg-bg-dark/90 backdrop-blur-xl border-b border-white/[0.06] z-10">
        <h2 className="font-syne text-base font-bold text-white mb-2">Naksha</h2>
        <CategoryGrid selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <div className="flex-1 relative z-0">
        <LeafletMap
          shops={shops}
          center={center}
          categoryColors={categoryColors}
        />
      </div>
      <BottomNav />
    </main>
  )
}
```

- [ ] **Step 3: Copy Leaflet marker assets**

```bash
mkdir -p public/leaflet
# Copy from node_modules/leaflet/dist/images/
cp node_modules/leaflet/dist/images/marker-icon.png public/leaflet/
cp node_modules/leaflet/dist/images/marker-icon-2x.png public/leaflet/
cp node_modules/leaflet/dist/images/marker-shadow.png public/leaflet/
```

- [ ] **Step 4: Commit**

```bash
git add src/components/map/ src/app/map/ public/leaflet/
git commit -m "feat: add Leaflet map view with colour-coded shop pins"
```

---

### Task 14: Search / Shop list screen

**Files:**
- Create: `src/app/search/page.tsx`

- [ ] **Step 1: Create `src/app/search/page.tsx`**

```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { ShopCard } from '@/components/shop/ShopCard'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type SortKey = 'distance' | 'rating' | 'open'

export default function SearchPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('distance')
  const [location, setLocation] = useState<[number, number]>([26.8467, 80.9462])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => { if (data) setCategories(data) })
    navigator.geolocation?.getCurrentPosition(
      pos => setLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }, [])

  useEffect(() => {
    getNearbyShops(location[0], location[1], 5000, selectedCat ?? undefined).then(setShops)
  }, [location, selectedCat])

  const sorted = [...shops].sort((a, b) => {
    if (sort === 'distance') return (a.dist_m ?? 0) - (b.dist_m ?? 0)
    if (sort === 'rating') return b.rating - a.rating
    return 0
  })

  const getCategorySlug = (categoryId: string | null) =>
    categories.find(c => c.id === categoryId)?.slug ?? 'more'

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <div className="px-5 pt-10 pb-3">
        <h2 className="font-syne text-lg font-bold text-white mb-3">Dhundho</h2>
        <div className="flex items-center gap-2 bg-white/[0.055] border border-white/10 rounded-2xl px-4 py-2.5 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-[11px] text-white/30">Kya dhundh rahe ho?</span>
        </div>
        <CategoryGrid selected={selectedCat} onSelect={setSelectedCat} />
      </div>

      {/* Sort controls */}
      <div className="flex gap-2 px-5 pb-3">
        {(['distance', 'rating'] as SortKey[]).map(key => (
          <button
            key={key}
            onClick={() => setSort(key)}
            className={`text-[9px] font-bold rounded-full px-3 py-1.5 border transition-all ${
              sort === key
                ? 'bg-violet/20 border-violet/40 text-violet/90'
                : 'bg-white/[0.04] border-white/[0.08] text-white/40'
            }`}
          >
            {key === 'distance' ? 'Nazdeeeki' : 'Best Rating'}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-2.5">
        {sorted.map(shop => (
          <ShopCard key={shop.id} shop={shop} categorySlug={getCategorySlug(shop.category_id)} />
        ))}
        {shops.length === 0 && (
          <p className="text-[11px] text-white/30 text-center py-8">Koi shop nahi mili</p>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/search/
git commit -m "feat: add shop search/list screen with category filter and sort"
```

---

### Task 15: Add a Shop screen

**Files:**
- Create: `src/app/add/page.tsx`

- [ ] **Step 1: Create `src/app/add/page.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'

export default function AddShopPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    phone: '',
    address: '',
    area: '',
    lat: '',
    lng: '',
    opening_note: '',
  })

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
    navigator.geolocation?.getCurrentPosition(pos => {
      setForm(f => ({
        ...f,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6),
      }))
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.category_id) return
    setSubmitting(true)
    try {
      await supabase.from('contributions').insert({
        shop_data: {
          name: form.name,
          category_id: form.category_id,
          phone: form.phone || null,
          address: form.address || null,
          area: form.area || null,
          city: 'Lucknow',
          lat: form.lat ? parseFloat(form.lat) : null,
          lng: form.lng ? parseFloat(form.lng) : null,
        },
        submitted_by: null,
        status: 'pending',
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-bg-dark flex flex-col items-center justify-center pb-24 px-8 text-center">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="font-syne text-xl font-bold text-white mb-2">Shukriya!</h2>
        <p className="text-sm text-white/50 mb-6">
          Aapki dukaan 24 ghante mein review hogi.<br />Aapki wajah se kisi ki madad hogi!
        </p>
        <Button variant="primary" onClick={() => router.push('/')}>Ghar wapas jaao</Button>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <div className="px-5 pt-10 pb-6">
        <h2 className="font-syne text-lg font-bold text-white mb-1">Dukaan Jodo</h2>
        <p className="text-[11px] text-white/40">Apne mohalle ki dukaan jodo — kisi ki madad karo</p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-3">
        {/* Name */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Dukaan ka naam *</label>
          <input
            required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Sharma General Store"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Category *</label>
          <select
            required value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet/50 appearance-none"
          >
            <option value="">Category chunein</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_hi} / {c.name_en}</option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Phone number</label>
          <input
            type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="9876543210"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Pata (Address)</label>
          <input value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder="e.g. Near Clock Tower, Hazratganj"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        {/* Area */}
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Area / Mohalla</label>
          <input value={form.area}
            onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
            placeholder="e.g. Hazratganj"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        {/* GPS coords (auto-filled) */}
        {form.lat && (
          <p className="text-[9px] text-white/30 flex items-center gap-1">
            <svg width="9" height="11" viewBox="0 0 12 14" fill="#7B5BFF"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"/></svg>
            Location detect ho gayi: {form.lat}, {form.lng}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={submitting}>
          {submitting ? 'Bhej rahe hain...' : 'Dukaan bhejo 🙏'}
        </Button>
      </form>
      <BottomNav />
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/add/
git commit -m "feat: add community 'Add a Shop' form with Supabase contributions"
```

---

### Task 16: Admin panel

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/contributions/page.tsx`

- [ ] **Step 1: Create admin auth guard `src/app/admin/layout.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/admin/login')
      setChecking(false)
    })
  }, [])

  if (checking) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white/40 text-sm">Loading...</div>
  }

  return <>{children}</>
}
```

- [ ] **Step 2: Create `src/app/admin/page.tsx`**

```typescript
import Link from 'next/link'
import { getServiceClient } from '@/lib/supabase'

export default async function AdminDashboard() {
  const client = getServiceClient()
  const [{ count: shopsTotal }, { count: pending }, { count: verified }] = await Promise.all([
    client.from('shops').select('*', { count: 'exact', head: true }),
    client.from('contributions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    client.from('shops').select('*', { count: 'exact', head: true }).eq('verified', true),
  ])

  return (
    <main className="min-h-screen bg-bg-dark p-6 font-jakarta">
      <h1 className="font-syne text-2xl font-bold text-white mb-6">Bhaiya App — Admin</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Shops', value: shopsTotal ?? 0 },
          { label: 'Verified', value: verified ?? 0 },
          { label: 'Pending Review', value: pending ?? 0, highlight: true },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl p-4 border ${stat.highlight ? 'bg-violet/10 border-violet/30' : 'bg-white/[0.04] border-white/[0.08]'}`}>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/admin/contributions" className="block bg-violet/10 border border-violet/30 rounded-2xl p-4 text-white font-semibold text-sm hover:bg-violet/20 transition-colors">
          Review Contributions →
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Create `src/app/admin/contributions/page.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contribution } from '@/lib/types'
import { Button } from '@/components/ui/Button'

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchPending() {
    const { data } = await supabase
      .from('contributions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (data) setContributions(data as Contribution[])
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  async function handleApprove(c: Contribution) {
    const d = c.shop_data as any
    if (!d.lat || !d.lng) {
      alert('Missing lat/lng — cannot approve without location')
      return
    }
    const { error } = await supabase.rpc('insert_shop_from_contribution', {
      p_name: d.name, p_category_id: d.category_id, p_lat: d.lat, p_lng: d.lng,
      p_address: d.address, p_phone: d.phone, p_area: d.area, p_city: d.city ?? 'Lucknow',
    })
    if (!error) {
      await supabase.from('contributions').update({ status: 'approved' }).eq('id', c.id)
      fetchPending()
    }
  }

  async function handleReject(id: string) {
    await supabase.from('contributions').update({ status: 'rejected' }).eq('id', id)
    fetchPending()
  }

  return (
    <main className="min-h-screen bg-bg-dark p-6 font-jakarta">
      <h1 className="font-syne text-xl font-bold text-white mb-4">Pending Contributions ({contributions.length})</h1>
      {loading && <p className="text-white/40 text-sm">Loading...</p>}
      <div className="flex flex-col gap-4">
        {contributions.map(c => {
          const d = c.shop_data as any
          return (
            <div key={c.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
              <p className="text-sm font-bold text-white">{d.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{d.phone} · {d.area} · {d.address}</p>
              <p className="text-[9px] text-white/25 mt-1">Submitted: {new Date(c.created_at).toLocaleDateString('en-IN')}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="primary" size="sm" onClick={() => handleApprove(c)}>Approve ✓</Button>
                <Button variant="ghost" size="sm" onClick={() => handleReject(c.id)}>Reject ✗</Button>
              </div>
            </div>
          )
        })}
        {!loading && contributions.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No pending contributions 🎉</p>
        )}
      </div>
    </main>
  )
}
```

Add the `insert_shop_from_contribution` helper function to Supabase SQL Editor:
```sql
CREATE OR REPLACE FUNCTION insert_shop_from_contribution(
  p_name TEXT, p_category_id UUID, p_lat FLOAT, p_lng FLOAT,
  p_address TEXT DEFAULT NULL, p_phone TEXT DEFAULT NULL,
  p_area TEXT DEFAULT NULL, p_city TEXT DEFAULT 'Lucknow'
)
RETURNS void LANGUAGE sql AS $$
  INSERT INTO shops(name, category_id, location, address, phone, area, city, verified, is_active)
  VALUES (p_name, p_category_id, ST_Point(p_lng, p_lat)::geometry, p_address, p_phone, p_area, p_city, true, true);
$$;
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin panel with contribution review, approve/reject workflow"
```

---

## Phase 3 — Data

### Task 17: OpenStreetMap importer

**Files:**
- Create: `scripts/import-osm.ts`

- [ ] **Step 1: Create `scripts/import-osm.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Lucknow bounding box: south, west, north, east
const BBOX = '26.75,80.85,26.95,81.05'

const OSM_QUERIES = [
  { overpassTag: 'shop=convenience', categorySlug: 'ration' },
  { overpassTag: 'shop=grocery',     categorySlug: 'ration' },
  { overpassTag: 'shop=greengrocer', categorySlug: 'vegetables' },
  { overpassTag: 'shop=dairy',       categorySlug: 'dairy' },
  { overpassTag: 'amenity=pharmacy', categorySlug: 'medical' },
  { overpassTag: 'shop=hardware',    categorySlug: 'hardware' },
  { overpassTag: 'shop=tailor',      categorySlug: 'tailor' },
  { overpassTag: 'shop=pet',         categorySlug: 'pet' },
  { overpassTag: 'shop=hairdresser', categorySlug: 'salon' },
  { overpassTag: 'shop=bakery',      categorySlug: 'bakery' },
  { overpassTag: 'amenity=pharmacy', categorySlug: 'medical' },
  { overpassTag: 'shop=mobile_phone',categorySlug: 'mobile-repair' },
  { overpassTag: 'amenity=atm',      categorySlug: 'bank' },
  { overpassTag: 'amenity=clinic',   categorySlug: 'clinic' },
]

async function fetchOSM(overpassTag: string): Promise<any[]> {
  const [key, value] = overpassTag.split('=')
  const query = `[out:json][timeout:30];node["${key}"="${value}"](${BBOX});out body;`
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'text/plain' },
  })
  const json = await res.json()
  return json.elements ?? []
}

async function getCategoryId(slug: string): Promise<string | null> {
  const { data } = await supabase.from('categories').select('id').eq('slug', slug).single()
  return data?.id ?? null
}

async function importOSM() {
  console.log('Starting OSM import for Lucknow...')
  let total = 0

  for (const { overpassTag, categorySlug } of OSM_QUERIES) {
    const categoryId = await getCategoryId(categorySlug)
    if (!categoryId) { console.warn(`Category not found: ${categorySlug}`); continue }

    const elements = await fetchOSM(overpassTag)
    console.log(`  ${overpassTag}: ${elements.length} nodes`)

    const shops = elements
      .filter(e => e.lat && e.lon && e.tags?.name)
      .map(e => ({
        name: e.tags.name,
        category_id: categoryId,
        location: `SRID=4326;POINT(${e.lon} ${e.lat})`,
        address: [e.tags['addr:street'], e.tags['addr:housenumber']].filter(Boolean).join(' ') || null,
        phone: e.tags.phone || e.tags['contact:phone'] || null,
        area: e.tags['addr:suburb'] || e.tags['addr:city_district'] || null,
        city: 'Lucknow',
        verified: false,
        is_active: true,
      }))

    if (shops.length > 0) {
      const { error } = await supabase.from('shops').upsert(shops, { onConflict: 'name,location' })
      if (error) console.error(`  Error: ${error.message}`)
      else { total += shops.length; console.log(`  Inserted ${shops.length} shops`) }
    }

    await new Promise(r => setTimeout(r, 1000)) // rate limit
  }

  console.log(`\nDone! Total imported: ${total} shops`)
}

importOSM().catch(console.error)
```

- [ ] **Step 2: Install ts-node for running the script**

```bash
npm install -D ts-node
```

- [ ] **Step 3: Run the importer**

```bash
npx ts-node --project tsconfig.json scripts/import-osm.ts
```

Expected output:
```
Starting OSM import for Lucknow...
  shop=convenience: 34 nodes
  Inserted 28 shops
  shop=greengrocer: 12 nodes
  ...
Done! Total imported: ~250 shops
```

- [ ] **Step 4: Commit**

```bash
git add scripts/
git commit -m "feat: add OpenStreetMap Overpass API importer for Lucknow"
```

---

### Task 18: Onboarding screen

**Files:**
- Create: `src/app/onboarding/page.tsx`
- Modify: `src/app/layout.tsx` (redirect first-time users)

- [ ] **Step 1: Create `src/app/onboarding/page.tsx`**

```typescript
'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function OnboardingPage() {
  const router = useRouter()

  function handleStart() {
    localStorage.setItem('bhaiya_onboarded', '1')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-bg-dark flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-20 left-1/2 -translate-x-1/2 bg-violet/20 blur-[100px]" />
        <div className="absolute w-64 h-64 rounded-full bottom-20 -right-10 bg-rose/10 blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-xs">
        <div className="w-20 h-20 rounded-3xl bg-violet/20 border border-violet/30 flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9b7dff" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>

        <h1 className="font-syne text-3xl font-extrabold text-white leading-tight mb-2">
          Bhaiya App
        </h1>
        <p className="text-violet/80 font-semibold text-sm mb-4">
          Naye sheher mein? Bhaiya hai na!
        </p>
        <p className="text-white/40 text-sm leading-relaxed mb-10">
          Aapke naye sheher mein ration, sabzi, doodh, dawai — sab kuch dhundhein. Local shops, numbers, audio guide — sab ek jagah.
        </p>

        <Button variant="primary" size="lg" className="w-full mb-3" onClick={handleStart}>
          Shuru karo →
        </Button>
        <p className="text-[10px] text-white/25">Filhaal: Lucknow · Aur sheher jald hi</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Redirect first-time visitors — add to `src/app/page.tsx` useEffect**

In `src/app/page.tsx`, inside the component, add at the top of the function:
```typescript
useEffect(() => {
  if (!localStorage.getItem('bhaiya_onboarded')) {
    router.push('/onboarding')
  }
}, [])
```

Add `import { useRouter } from 'next/navigation'` at the top.

- [ ] **Step 3: Commit**

```bash
git add src/app/onboarding/
git commit -m "feat: add onboarding/splash screen with first-visit redirect"
```

---

## Phase 4 — Polish & Deploy

### Task 19: Dark/Light mode toggle

**Files:**
- Create: `src/components/ui/ThemeToggle.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/TopBar.tsx`

- [ ] **Step 1: Create `src/components/ui/ThemeToggle.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('bhaiya_theme')
    if (saved === 'light') {
      setDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('bhaiya_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('bhaiya_theme', 'light')
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 dark:bg-white/[0.06] flex items-center justify-center"
    >
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      )}
    </button>
  )
}
```

- [ ] **Step 2: Add ThemeToggle to TopBar**

In `src/components/layout/TopBar.tsx`, replace the notification button with:
```typescript
import { ThemeToggle } from '@/components/ui/ThemeToggle'
// ...
// In the flex row alongside the logo:
<div className="flex items-center gap-2">
  <ThemeToggle />
  {/* notification bell button */}
</div>
```

- [ ] **Step 3: Add light mode Tailwind classes to globals.css**

```css
/* Light mode overrides */
:root:not(.dark) {
  --bg-page: #f5f4fe;
}
:root:not(.dark) body {
  background-color: var(--bg-page);
  color: #1a1035;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx src/components/layout/TopBar.tsx src/styles/globals.css
git commit -m "feat: add dark/light mode toggle with localStorage persistence"
```

---

### Task 20: Deploy to Vercel

**Files:** No code changes — configuration only.

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/bhaiya-app.git
git push -u origin master
```

- [ ] **Step 2: Import to Vercel**

1. Go to vercel.com → New Project → Import from GitHub → select `bhaiya-app`
2. Framework Preset: **Next.js** (auto-detected)
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key
4. Click Deploy

- [ ] **Step 3: Verify deployment**

Open the Vercel URL on your phone. Expected:
- Onboarding screen appears on first visit
- "Add to Home Screen" prompt appears (PWA)
- Location permission → nearby shops appear
- Tap a shop → detail page loads
- Phone number tap → calls

- [ ] **Step 4: Commit deploy config**

```bash
git add vercel.json 2>/dev/null || true
git commit -m "feat: deploy Bhaiya App to Vercel" --allow-empty
```

---

## Checklist: Spec Coverage

| Spec Section | Covered By |
|---|---|
| 7 screens | Tasks 10, 11, 12, 13, 14, 15, 16, 18 |
| Glassmorphism dark UI | Task 7, 8, 10 |
| Light mode toggle | Task 19 |
| SVG icons | Task 4, 9 |
| Syne + Plus Jakarta Sans fonts | Task 1 |
| PostGIS geospatial queries | Task 2 |
| 20 categories | Task 2 |
| Tap-to-call | Task 12 |
| "Bhaiya se puchho" audio | Task 6, 11 |
| GPS location detection | Task 8, 10 |
| Community Add a Shop | Task 15 |
| Admin panel | Task 16 |
| OSM import | Task 17 |
| PWA manifest | Task 3 |
| Vercel deployment | Task 20 |

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |

**VERDICT:** NO REVIEWS YET — recommend running `/plan-eng-review` before implementation starts.
