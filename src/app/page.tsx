'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { ShopCard } from '@/components/shop/ShopCard'
import { ShopCardSkeleton } from '@/components/shop/ShopCardSkeleton'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { InstallPrompt } from '@/components/layout/InstallPrompt'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/lang'
import { DEMO_SHOPS } from '@/lib/demo-shops'

export default function HomePage() {
  const router = useRouter()
  const { lang } = useLang()
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [shops, setShops] = useState<Shop[]>(DEMO_SHOPS)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [usingDemo, setUsingDemo] = useState(true)

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
        setSelectedCat(null)
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

    if (usingDemo) {
      const filtered = slug
        ? DEMO_SHOPS.filter(s => s.category?.slug === slug)
        : DEMO_SHOPS
      setShops(filtered)
      return
    }

    if (!location) return
    setLoading(true)
    try {
      const nearby = await getNearbyShops(location.lat, location.lng, 2000, slug ?? undefined)
      setShops(nearby.length > 0 ? nearby : (slug ? [] : DEMO_SHOPS))
      setUsingDemo(nearby.length === 0 && !slug)
    } catch {
      setShops(DEMO_SHOPS)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }, [location, usingDemo])

  const T = {
    search: lang === 'en' ? 'Search shops, areas...' : 'Kya dhundh rahe ho?',
    categories: lang === 'en' ? 'Categories' : 'श्रेणियाँ',
    seeAll: lang === 'en' ? 'See all →' : 'Sab dekho →',
    nearby: lang === 'en' ? 'Nearby Shops' : 'Aas-paas ki Dukaanein',
    loading: lang === 'en' ? 'Finding shops...' : 'Dhundh rahe hain...',
    noShops: lang === 'en' ? 'No shops in this category nearby.' : 'Is category mein koi shop nahi.',
    demo: lang === 'en' ? 'Demo · Add real data via Supabase' : 'Demo data',
    claimTitle: lang === 'en' ? 'Own a shop in Lucknow?' : 'Lucknow mein dukaan hai?',
    claimSub: lang === 'en' ? 'List it free — be found by thousands' : 'Free mein add karo — hazaaron log dekhenge',
    claimBtn: lang === 'en' ? 'Add your shop →' : 'Apni dukaan jodein →',
    featuredNote: lang === 'en' ? '⭐ Featured shops get 5× more calls' : '⭐ Featured dukaanon ko 5× zyada calls milti hain',
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
          <span className="text-[9px] text-violet font-semibold">🎤</span>
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

        <div className="px-5 flex flex-col gap-2.5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <ShopCardSkeleton key={i} />)
            : shops.length === 0
              ? (
                <div className="flex flex-col items-center gap-3 py-10">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-20">
                    <rect x="8" y="14" width="32" height="26" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 14V10a8 8 0 0116 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="24" cy="27" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <p className="text-[11px] text-gray-400 dark:text-white/30 text-center">{T.noShops}</p>
                </div>
              )
              : shops.slice(0, 10).map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))
          }
        </div>

        {/* Claim your shop banner */}
        <Link href="/add" className="mx-5 mt-4 flex flex-col gap-1 bg-violet/[0.08] border border-violet/[0.2] rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-violet">{T.claimTitle}</p>
              <p className="text-[9px] text-gray-500 dark:text-white/40 mt-0.5">{T.claimSub}</p>
            </div>
            <span className="text-[10px] font-bold text-violet shrink-0">{T.claimBtn}</span>
          </div>
          <p className="text-[8px] text-amber-500/70">{T.featuredNote}</p>
        </Link>

        {/* Install prompt */}
        <InstallPrompt />

        {/* Audio card */}
        <div className="mx-5 mt-3">
          <BhaiyaAudioButton text={T.audio} />
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
