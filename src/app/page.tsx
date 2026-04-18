'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { ShopCard } from '@/components/shop/ShopCard'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/lang'
import { DEMO_SHOPS } from '@/lib/demo-shops'

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
      if (nearby.length > 0) { setShops(nearby); setUsingDemo(false) }
      else { setShops(DEMO_SHOPS); setUsingDemo(true) }
    } catch {
      setShops(DEMO_SHOPS); setUsingDemo(true)
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
      if (nearby.length > 0) { setShops(nearby); setUsingDemo(false) }
      else { setShops(slug ? [] : DEMO_SHOPS); setUsingDemo(!slug) }
    } catch {
      setShops(DEMO_SHOPS); setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }, [location])

  const getCategorySlug = (categoryId: string | null) =>
    categories.find(c => c.id === categoryId)?.slug ?? 'more'

  const T = {
    search: lang === 'en' ? 'Search shops, areas...' : 'Kya dhundh rahe ho?',
    categories: lang === 'en' ? 'Categories' : 'श्रेणियाँ',
    seeAll: lang === 'en' ? 'See all →' : 'Sab dekho →',
    nearby: lang === 'en' ? 'Open nearby' : 'Aas-paas khule hain',
    loading: lang === 'en' ? 'Finding shops...' : 'Dhundh rahe hain...',
    noShops: lang === 'en' ? 'No shops found here.' : 'Is area mein koi shop nahi mili.',
    addOne: lang === 'en' ? 'Add one?' : 'Kya aap ek jodenge?',
    allowLocation: lang === 'en' ? 'Allow location to see nearby shops' : 'Location allow karein shops dekhne ke liye',
    demo: lang === 'en' ? 'Demo · Connect Supabase for live data' : 'Demo · Live data ke liye Supabase jodein',
    claimTitle: lang === 'en' ? 'Own a shop in Lucknow?' : 'Lucknow mein dukaan hai?',
    claimSub: lang === 'en' ? 'List it free — early access' : 'Free mein add karo — early access',
    claimBtn: lang === 'en' ? 'Add your shop →' : 'Apni dukaan jodein →',
    audio: lang === 'en'
      ? 'Welcome to Bhaiya App! Find grocery, vegetables, dairy, medicines — all local shops near you with one tap.'
      : 'Bhaiya App mein aapka swagat hai! Apne aas-paas ki dukaanein dhundhen aur unke malik se seedha baat karein.',
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full -top-32 -left-20 bg-violet/[0.12] blur-[100px] animate-pulse" />
        <div className="absolute w-[350px] h-[350px] rounded-full top-60 -right-16 bg-rose/[0.06] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <TopBar onLocation={handleLocation} />

        {/* Stats bar */}
        <div className="mx-5 mt-3 flex items-center justify-center gap-5 py-2.5 bg-violet/[0.07] border border-violet/[0.15] rounded-2xl">
          <div className="text-center">
            <p className="font-syne text-sm font-bold text-violet">200+</p>
            <p className="text-[8px] text-gray-500 dark:text-white/35">{lang === 'en' ? 'Shops' : 'दुकानें'}</p>
          </div>
          <div className="w-px h-6 bg-violet/20" />
          <div className="text-center">
            <p className="font-syne text-sm font-bold text-violet">8</p>
            <p className="text-[8px] text-gray-500 dark:text-white/35">{lang === 'en' ? 'Categories' : 'श्रेणियाँ'}</p>
          </div>
          <div className="w-px h-6 bg-violet/20" />
          <div className="text-center">
            <p className="font-syne text-sm font-bold text-violet">Lucknow</p>
            <p className="text-[8px] text-gray-500 dark:text-white/35">{lang === 'en' ? 'City' : 'शहर'}</p>
          </div>
        </div>

        {/* Search bar */}
        <Link href="/search" className="mx-5 mt-3 flex items-center gap-2.5 bg-black/[0.04] dark:bg-white/[0.055] border border-black/[0.07] dark:border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-2xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400 dark:text-white/30">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-[11px] text-gray-400 dark:text-white/30 flex-1">{T.search}</span>
        </Link>

        {/* Categories */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">{T.categories}</span>
          <Link href="/search" className="text-[9px] font-semibold text-violet">{T.seeAll}</Link>
        </div>
        <CategoryGrid selected={selectedCat} onSelect={handleCategorySelect} />

        {/* Nearby shops header */}
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
            <Link href="/add" className="text-violet">{T.addOne}</Link>
          </div>
        )}

        {!location && (
          <div className="px-5 text-[11px] text-gray-400 dark:text-white/30 text-center py-6">
            {T.allowLocation}
          </div>
        )}

        <div className="px-5 flex flex-col gap-2.5">
          {shops.slice(0, 8).map(shop => (
            <ShopCard key={shop.id} shop={shop} categorySlug={getCategorySlug(shop.category_id)} />
          ))}
        </div>

        {/* Claim your shop banner */}
        <Link href="/add" className="mx-5 mt-4 flex items-center justify-between gap-3 bg-violet/[0.08] border border-violet/[0.2] rounded-2xl px-4 py-3">
          <div>
            <p className="text-[11px] font-bold text-violet">{T.claimTitle}</p>
            <p className="text-[9px] text-gray-500 dark:text-white/40 mt-0.5">{T.claimSub}</p>
          </div>
          <span className="text-[10px] font-bold text-violet shrink-0">{T.claimBtn}</span>
        </Link>

        {/* Audio card */}
        <div className="mx-5 mt-3">
          <BhaiyaAudioButton text={T.audio} />
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
