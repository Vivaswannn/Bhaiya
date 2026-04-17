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

    await new Promise(r => setTimeout(r, 1000))
  }

  console.log(`\nDone! Total imported: ${total} shops`)
}

importOSM().catch(console.error)
