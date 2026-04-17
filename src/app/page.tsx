'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { ShopCard } from '@/components/shop/ShopCard'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/lang'

const DEMO_SHOPS: Shop[] = [
  {
    id: 'demo-1',
    name: 'Ram Lal Kirana Store',
    category_id: null,
    address: 'Hazratganj Market',
    phone: '+91 94150 12345',
    opening_hours: { mon: { open: '07:00', close: '21:00' }, tue: { open: '07:00', close: '21:00' }, wed: { open: '07:00', close: '21:00' }, thu: { open: '07:00', close: '21:00' }, fri: { open: '07:00', close: '21:00' }, sat: { open: '07:00', close: '21:00' } },
    area: 'Hazratganj',
    city: 'Lucknow',
    audio_guide: null,
    rating: 4.2,
    review_count: 18,
    verified: true,
    lat: 26.8467,
    lng: 80.9462,
    dist_m: 320,
  },
  {
    id: 'demo-2',
    name: 'Shyam Sabzi Wale',
    category_id: null,
    address: 'Gomti Nagar Crossing',
    phone: '+91 98390 55432',
    opening_hours: { mon: { open: '06:00', close: '13:00' }, tue: { open: '06:00', close: '13:00' }, wed: { open: '06:00', close: '13:00' }, thu: { open: '06:00', close: '13:00' }, fri: { open: '06:00', close: '13:00' }, sat: { open: '06:00', close: '13:00' }, sun: { open: '06:00', close: '11:00' } },
    area: 'Gomti Nagar',
    city: 'Lucknow',
    audio_guide: null,
    rating: 4.5,
    review_count: 34,
    verified: true,
    lat: 26.852,
    lng: 80.999,
    dist_m: 680,
  },
  {
    id: 'demo-3',
    name: 'Gopal Dairy',
    category_id: null,
    address: 'Near Indira Nagar Chowk',
    phone: '+91 75231 88901',
    opening_hours: { mon: { open: '05:30', close: '10:00' }, tue: { open: '05:30', close: '10:00' }, wed: { open: '05:30', close: '10:00' }, thu: { open: '05:30', close: '10:00' }, fri: { open: '05:30', close: '10:00' }, sat: { open: '05:30', close: '10:00' }, sun: { open: '05:30', close: '09:00' } },
    area: 'Indira Nagar',
    city: 'Lucknow',
    audio_guide: null,
    rating: 4.0,
    review_count: 12,
    verified: false,
    lat: 26.875,
    lng: 81.002,
    dist_m: 1100,
  },
  {
    id: 'demo-4',
    name: 'City Medical Store',
    category_id: null,
    address: 'Alambagh, Near Bus Stand',
    phone: '+91 52220 44321',
    opening_hours: { mon: { open: '08:00', close: '22:00' }, tue: { open: '08:00', close: '22:00' }, wed: { open: '08:00', close: '22:00' }, thu: { open: '08:00', close: '22:00' }, fri: { open: '08:00', close: '22:00' }, sat: { open: '08:00', close: '22:00' }, sun: { open: '09:00', close: '20:00' } },
    area: 'Alambagh',
    city: 'Lucknow',
    audio_guide: null,
    rating: 4.3,
    review_count: 27,
    verified: true,
    lat: 26.831,
    lng: 80.921,
    dist_m: 1450,
  },
  {
    id: 'demo-5',
    name: 'Mukesh Hardware',
    category_id: null,
    address: 'Aishbagh Road',
    phone: '+91 94500 77623',
    opening_hours: { mon: { open: '09:00', close: '19:30' }, tue: { open: '09:00', close: '19:30' }, wed: { open: '09:00', close: '19:30' }, thu: { open: '09:00', close: '19:30' }, fri: { open: '09:00', close: '19:30' }, sat: { open: '09:00', close: '19:30' } },
    area: 'Aishbagh',
    city: 'Lucknow',
    audio_guide: null,
    rating: 3.8,
    review_count: 9,
    verified: false,
    lat: 26.861,
    lng: 80.924,
    dist_m: 1820,
  },
]

export default function HomePage() {
  const router = useRouter()
  const { lang } = useLang()
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [usingDemo, setUsingDemo] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('bhaiya_onboarded')) {
      router.push('/onboarding')
    }
  }, [])

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
      if (nearby.length > 0) {
        setShops(nearby)
        setUsingDemo(false)
      } else {
        setShops(DEMO_SHOPS)
        setUsingDemo(true)
      }
    } catch {
      setShops(DEMO_SHOPS)
      setUsingDemo(true)
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
      if (nearby.length > 0) {
        setShops(nearby)
        setUsingDemo(false)
      } else {
        setShops(slug ? [] : DEMO_SHOPS)
        setUsingDemo(!slug)
      }
    } catch {
      setShops(DEMO_SHOPS)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }, [location])

  const getCategorySlug = (categoryId: string | null) =>
    categories.find(c => c.id === categoryId)?.slug ?? 'more'

  const T = {
    search: lang === 'en' ? 'What are you looking for?' : 'Kya dhundh rahe ho?',
    categories: lang === 'en' ? 'Categories' : 'श्रेणियाँ',
    seeAll: lang === 'en' ? 'See all →' : 'Sab dekho →',
    nearby: lang === 'en' ? 'Open nearby' : 'Aas-paas khule hain',
    loading: lang === 'en' ? 'Finding shops...' : 'Dhundh rahe hain...',
    noShops: lang === 'en' ? 'No shops found here.' : 'Is area mein koi shop nahi mili.',
    addOne: lang === 'en' ? 'Add one?' : 'Kya aap ek jodenge?',
    allowLocation: lang === 'en' ? 'Allow location to see nearby shops' : 'Location allow karein shops dekhne ke liye',
    demo: lang === 'en' ? 'Demo data — connect Supabase for live shops' : 'Demo data — live shops ke liye Supabase jodein',
    audio: lang === 'en'
      ? 'Welcome to Bhaiya App! Find grocery, vegetables, dairy, medicines — all local shops near you with one tap.'
      : 'Bhaiya App mein aapka swagat hai! Apne aas-paas ki dukaanein dhundhen aur unke malik se seedha baat karein.',
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full -top-32 -left-20 bg-violet/[0.12] blur-[100px] animate-pulse" />
        <div className="absolute w-[350px] h-[350px] rounded-full top-60 -right-16 bg-rose/[0.06] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <TopBar onLocation={handleLocation} />

        {/* Search bar */}
        <div className="mx-5 mt-3 flex items-center gap-2.5 bg-black/[0.04] dark:bg-white/[0.055] border border-black/[0.07] dark:border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-2xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400 dark:text-white/30">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-[11px] text-gray-400 dark:text-white/30 flex-1">{T.search}</span>
          <button className="w-6 h-6 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center">
            <svg width="10" height="11" viewBox="0 0 24 24" fill="none" stroke="#9b7dff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">{T.categories}</span>
          <span className="text-[9px] font-semibold text-violet">{T.seeAll}</span>
        </div>
        <CategoryGrid selected={selectedCat} onSelect={handleCategorySelect} />

        {/* Nearby shops */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">{T.nearby}</span>
          {usingDemo && (
            <span className="text-[8px] text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
              {T.demo}
            </span>
          )}
        </div>

        {loading && (
          <div className="px-5 text-[11px] text-gray-400 dark:text-white/30 text-center py-4">{T.loading}</div>
        )}

        {!loading && shops.length === 0 && location && (
          <div className="px-5 text-[11px] text-gray-400 dark:text-white/30 text-center py-6">
            {T.noShops} <br />
            <span className="text-violet">{T.addOne}</span>
          </div>
        )}

        {!location && (
          <div className="px-5 text-[11px] text-gray-400 dark:text-white/30 text-center py-6">
            {T.allowLocation}
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

        {/* Audio card */}
        <div className="mx-5 mt-4">
          <BhaiyaAudioButton text={T.audio} />
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
