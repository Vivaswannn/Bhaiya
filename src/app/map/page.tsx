'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap').then(m => m.LeafletMap),
  { ssr: false }
)

export default function MapPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [center, setCenter] = useState<[number, number]>([26.8467, 80.9462])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => { if (data) setCategories(data) })
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      setCenter([lat, lng])
      getNearbyShops(lat, lng, 3000).then(setShops)
    }, () => {
      getNearbyShops(26.8467, 80.9462, 3000).then(setShops)
    })
  }, [])

  const categoryColors = Object.fromEntries(categories.map(c => [c.slug, c.color]))

  return (
    <main className="h-screen flex flex-col bg-bg-dark">
      <div className="px-5 pt-10 pb-3 bg-bg-dark/90 backdrop-blur-xl border-b border-white/[0.06] z-10">
        <h2 className="font-syne text-base font-bold text-white mb-2">Naksha</h2>
        <CategoryGrid selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <div className="flex-1 relative z-0">
        <LeafletMap
          shops={shops}
          center={center}
          categoryColors={categoryColors}
        />
      </div>
      <BottomNav />
    </main>
  )
}
