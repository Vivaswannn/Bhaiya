'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { DEMO_SHOPS } from '@/lib/demo-shops'
import { useLang } from '@/lib/lang'

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap').then(m => m.LeafletMap),
  { ssr: false }
)

export default function MapPage() {
  const { lang } = useLang()
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [center, setCenter] = useState<[number, number]>([26.8467, 80.9462])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => { if (data) setCategories(data) })
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      setCenter([lat, lng])
      getNearbyShops(lat, lng, 3000).then(s => setShops(s.length > 0 ? s : DEMO_SHOPS))
        .catch(() => setShops(DEMO_SHOPS))
    }, () => {
      getNearbyShops(26.8467, 80.9462, 3000).then(s => setShops(s.length > 0 ? s : DEMO_SHOPS))
        .catch(() => setShops(DEMO_SHOPS))
    })
  }, [])

  const categoryColors = Object.fromEntries(categories.map(c => [c.slug, c.color]))

  return (
    <main className="h-screen flex flex-col">
      <div className="px-5 pt-10 pb-3 bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] z-10">
        <h2 className="font-syne text-base font-bold text-gray-900 dark:text-white mb-2">
          {lang === 'en' ? 'Map' : 'नक्शा'}
        </h2>
        <CategoryGrid selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <div className="flex-1 relative z-0">
        <LeafletMap shops={shops} center={center} categoryColors={categoryColors} />
      </div>
      <BottomNav />
    </main>
  )
}
