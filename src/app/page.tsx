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

export default function HomePage() {
  const router = useRouter()
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

        {/* Categories */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Categories</span>
          <span className="text-[9px] font-semibold text-violet">Sab dekho →</span>
        </div>
        <CategoryGrid selected={selectedCat} onSelect={handleCategorySelect} />

        {/* Nearby shops */}
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

        {/* Audio card */}
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
