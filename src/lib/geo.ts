import type { OpeningHours, Shop } from './types'
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
