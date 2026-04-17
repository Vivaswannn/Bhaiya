# Bhaiya App — Design Specification
**Date:** 2026-04-17  
**Status:** Approved  
**Author:** Brainstorming session

---

## 1. Vision

Bhaiya App is a hyperlocal discovery PWA for people starting fresh in a new city. It works like a trusted local bhaiya — 24/7 in your pocket — helping you find small shops, get their phone number, check if they're open, and get audio-guided directions in Hindi.

**Core pain it solves:** Google Maps covers big places. Nothing covers the small, real, everyday places — the ration shop, the sabziwala, the local dairy — that you desperately need when you arrive in a new city.

**Dual benefit:** Helps newcomers settle in. Gives small local businesses their first digital presence and customer reach.

**Demo city:** Lucknow (Hazratganj, Gomti Nagar, Indira Nagar)  
**App name:** Bhaiya App  
**Tagline:** "Naye sheher mein? Bhaiya hai na!"

---

## 2. Platform & Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Platform | PWA (Progressive Web App) | No app store needed for demo, installs on mobile, works in any browser for investor demos |
| Frontend | Next.js 14 (App Router) | PWA support, SSR, SEO, fast |
| Styling | Tailwind CSS | Mobile-first, fast to build |
| Maps | Leaflet.js + OpenStreetMap | Free, no API cost |
| Database | Supabase (PostgreSQL + PostGIS) | Real geospatial queries ("find nearest shop within 500m"), open source, generous free tier |
| Auth | Supabase Auth | Built-in, covers admin + contributors |
| Audio | Web Speech API (browser TTS) | Free, no API cost, works offline |
| Hosting | Vercel | Free tier, instant deploy, custom domain |
| Icons | Custom inline SVG | Professional, no emoji, no dependencies |
| Typography | Syne (headings) + Plus Jakarta Sans (body) | Distinctive, non-generic |

---

## 3. Design System

### Visual Identity
- **Dark mode:** Midnight Violet — `#07071c` background, `#7B5BFF` violet primary, glassmorphism cards with `backdrop-filter: blur`, animated gradient orbs
- **Light mode:** Pearl Violet — deep purple hero header (`#1e0a4a` → `#2d1472`), `#f5f4fe` body, clean white cards, same violet accent
- **Fonts:** Syne 700/800 for logo/headings, Plus Jakarta Sans 400/600/700 for body
- **Icons:** Inline SVG (Lucide-style), colour-coded per category
- **Open status:** Green `#00dc64` "KHULA", Red `#ff7070` "BAND"

### Colour Tokens
```
--violet:        #7B5BFF
--violet-dim:    rgba(123,91,255,0.18)
--violet-border: rgba(123,91,255,0.3)
--rose:          #FF4E8B
--cyan:          #00D9FF
--open-green:    #00dc64
--closed-red:    #ff7070
```

### Category Icon Colours
| Category | Icon | Colour |
|---|---|---|
| Ration / Kirana | Shopping bag | `#9b7dff` violet |
| Sabzi / Vegetables | Leaf | `#00dc64` green |
| Milk / Dairy | Milk bottle | `#38bdf8` blue |
| Medical / Pharmacy | Heartbeat | `#fb7185` rose |
| Hardware | Wrench | `#fbbf24` amber |
| Tailor | Scissors | `#2dd4bf` teal |
| Pet Shop | Paw | `#fb923c` peach |
| More | Dots | `rgba(255,255,255,0.6)` |

---

## 4. Screens (7 total)

### Screen 1 — Splash / Onboarding
- Full-screen branded splash with tagline
- City selector (dropdown: Lucknow for demo, "More cities coming soon")
- Language toggle: Hindi / English
- "Shuru karo" CTA button

### Screen 2 — Home (main screen)
- **Top bar:** Logo + notification bell
- **Location chip:** GPS-detected area + manual override chevron
- **Search bar:** Text search + mic button (voice search)
- **Category grid:** 4×2 grid, 8 visible categories + "More" (20 total)
- **Nearby open shops strip:** Sorted by distance, open/closed badge, distance in metres
- **"Bhaiya se puchho" audio card:** Plays contextual audio guide
- **Bottom nav:** Home · Naksha · Dhundho · Jodo

### Screen 3 — Map View (Naksha)
- Leaflet + OpenStreetMap tiles
- Colour-coded pins by category
- User's GPS location pin (blue dot)
- Tap a pin → mini shop card popup (name, distance, open status, tap-to-call)
- "Nearest open [category]" floating button
- Filter bar by category at the top

### Screen 4 — Shop List (Dhundho)
- Category filtered list
- Sort: Distance / Rating / Open now
- Each card: icon, name, area, distance, rating stars, open/closed badge, phone number
- Tap → Shop Detail

### Screen 5 — Shop Detail
- Shop name, category badge, address
- Distance + directions button (opens map)
- Phone number — large tap-to-call button (tel: link)
- Opening hours table (Mon–Sun)
- Open/Closed status with live time logic
- ⭐ Rating + review count
- 🔊 **"Bhaiya se puchho"** button — plays Web Speech API TTS in Hindi: scripted direction text from a landmark
- "Galat info hai? Report karo" link → community correction form

### Screen 6 — Add a Shop (Jodo)
- "Apne mohalle ki dukaan jodo!"
- Form: Name, Category (dropdown), Address, Phone, Opening hours
- Drop pin on map to set location
- Photo upload (optional)
- Submit for admin review
- "Aapki wajah se kisi ki madad hogi 🙏"

### Screen 7 — Admin Panel (protected, /admin)
- Login with Supabase Auth (email/password)
- Pending contributions queue: Approve / Reject / Edit
- All shops table with search + filter
- Bulk import from OpenStreetMap (Overpass API)
- Basic stats: total shops, total categories, pending reviews

---

## 5. Database Schema

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en     TEXT NOT NULL,
  name_hi     TEXT NOT NULL,
  icon_svg    TEXT,           -- inline SVG string
  color       TEXT,           -- hex color
  osm_tags    JSONB           -- for OpenStreetMap import matching
);

-- Shops
CREATE TABLE shops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category_id     UUID REFERENCES categories(id),
  location        GEOMETRY(Point, 4326) NOT NULL,  -- PostGIS point
  address         TEXT,
  phone           TEXT,
  opening_hours   JSONB,    -- { mon: {open:"08:00", close:"21:00"}, ... }
  area            TEXT,     -- "Hazratganj"
  city            TEXT NOT NULL DEFAULT 'Lucknow',
  audio_guide     TEXT,     -- Hindi TTS script text
  rating          NUMERIC(2,1) DEFAULT 0,
  review_count    INTEGER DEFAULT 0,
  verified        BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Spatial index for fast nearest-shop queries
CREATE INDEX shops_location_idx ON shops USING GIST(location);

-- Contributions (community-submitted shops)
CREATE TABLE contributions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_data     JSONB NOT NULL,
  submitted_by  TEXT,         -- optional email
  status        TEXT DEFAULT 'pending',  -- pending | approved | rejected
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

**Key geospatial query** (find 10 nearest open shops by category):
```sql
SELECT *, ST_Distance(location::geography, ST_Point($lng, $lat)::geography) AS dist_m
FROM shops
WHERE category_id = $category_id AND is_active = true AND verified = true
ORDER BY location <-> ST_Point($lng, $lat)::geometry
LIMIT 10;
```

---

## 6. Data Plan — Lucknow Demo

### Phase 1 — OpenStreetMap Import (automated)
- Query Overpass API for Lucknow bounding box
- Pull: grocery, pharmacy, hardware, dairy, tailor, pet_shop, vegetable_shop
- Auto-import into Supabase with category mapping
- Expected yield: ~300–500 shops, mostly main areas

### Phase 2 — Manual Curation (3 areas)
Focus areas for demo: **Hazratganj**, **Gomti Nagar**, **Indira Nagar**

For each curated shop:
- Verify name, address, phone number
- Add correct opening hours
- Write 1–2 sentence Hindi audio guide script
- Mark `verified = true`

Target: 50–80 fully enriched shops across 3 areas for the demo.

### Phase 3 — Post-Funding
- Community contributions (Add a Shop screen)
- Paid data entry team to cover all of Lucknow
- Expand to next cities: Delhi, Mumbai, Bangalore

---

## 7. Audio Guide Feature

**Technology:** Web Speech API (`window.speechSynthesis`) — free, no API cost, works offline, built into all modern browsers.

**How it works:**
1. Admin writes a Hindi script per shop in the `audio_guide` field
2. On Shop Detail screen, user taps "Bhaiya se puchho 🔊"
3. App calls `speechSynthesis.speak()` with the script text, Hindi voice
4. Browser speaks the guide aloud

**Example script for Sharma General Store:**
> "Sharma General Store Hazratganj mein hai. Apne ghar se seedha jaiye, 120 metre ke baad ek peeli building aayegi — uske niche ground floor par yeh dukaan hai. Subah 8 baje se raat 9 baje tak khuli rehti hai. Mobile number hai 0522-234567."

**Demo scope:** 10 hand-scripted shops across Hazratganj.  
**Post-funding:** AI-generated scripts for all shops.

---

## 8. PWA Configuration

```json
// manifest.json
{
  "name": "Bhaiya App",
  "short_name": "Bhaiya",
  "description": "Naye sheher ka naya saathi",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#07071c",
  "theme_color": "#7B5BFF",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Offline support: Service worker caches home screen + last-viewed shops.

---

## 9. Key User Flows

### Flow A — New user, first day in Lucknow
1. Opens bhaiyaapp.in → splash with tagline
2. Allows GPS or selects "Hazratganj"
3. Taps "Ration" category
4. Sees Sharma General Store 120m away, open now
5. Taps → Shop Detail → taps phone number → calls
6. Taps "Bhaiya se puchho" → Hindi audio directions play

### Flow B — Shop owner gets listed
1. User taps "Jodo" → Add a Shop
2. Fills name, category, drops pin, adds phone + hours
3. Submits → "Shukriya! 24 ghante mein review hoga"
4. Admin approves → shop live on map

### Flow C — Investor demo
1. Open bhaiyaapp.in on phone
2. Auto-detects Lucknow
3. Show categories → tap Ration → see map with pins
4. Tap a shop → tap-to-call works live
5. Tap "Bhaiya se puchho" → Hindi voice plays directions

---

## 10. MVP Scope (for funding demo)

### In scope
- [ ] Home screen with category grid and nearby shops
- [ ] Map view with Leaflet + shop pins
- [ ] Shop detail with tap-to-call
- [ ] "Bhaiya se puchho" audio guide (10 scripted shops)
- [ ] Shop list with distance sorting
- [ ] Add a Shop (contribution form)
- [ ] Admin panel (approve/reject contributions)
- [ ] Lucknow data: 3 areas, 50-80 verified shops
- [ ] Dark mode + Light mode toggle
- [ ] PWA manifest (installable on mobile)
- [ ] Hindi + English UI

### Out of scope (post-funding)
- User accounts / saved favourites
- Reviews and ratings system
- Push notifications
- Payment integrations
- Multi-city automated expansion
- Native Android/iOS apps
- AI-generated audio scripts

---

## 11. Project Structure

```
D:/MummyApp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Home screen
│   │   ├── map/page.tsx        # Map view
│   │   ├── shop/[id]/page.tsx  # Shop detail
│   │   ├── add/page.tsx        # Add a shop
│   │   ├── admin/              # Admin panel (protected)
│   │   └── layout.tsx          # Root layout + PWA meta
│   ├── components/
│   │   ├── ui/                 # Base components (Button, Card, Badge)
│   │   ├── shop/               # ShopCard, ShopList, ShopDetail
│   │   ├── map/                # LeafletMap, ShopPin, MiniCard
│   │   ├── audio/              # BhaiyaAudioButton
│   │   └── layout/             # BottomNav, TopBar, LocationChip
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── geo.ts              # Geospatial helpers
│   │   └── audio.ts            # Web Speech API wrapper
│   └── styles/
│       └── globals.css         # Tailwind + CSS variables
├── public/
│   ├── manifest.json
│   ├── sw.js                   # Service worker
│   └── icons/
├── scripts/
│   └── import-osm.ts           # OpenStreetMap Overpass import script
└── docs/
    └── superpowers/specs/
        └── 2026-04-17-bhaiya-app-design.md
```
