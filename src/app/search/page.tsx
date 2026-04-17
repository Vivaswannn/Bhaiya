'use client'
import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { ShopCard } from '@/components/shop/ShopCard'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type SortKey = 'distance' | 'rating'

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
            {key === 'distance' ? 'Nazdeeki' : 'Best Rating'}
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
