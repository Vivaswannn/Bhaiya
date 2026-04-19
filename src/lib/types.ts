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
  featured?: boolean
}

export interface Contribution {
  id: string
  shop_data: Partial<Shop>
  submitted_by: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
}
