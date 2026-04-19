'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { BottomNav } from '@/components/layout/BottomNav'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop } from '@/lib/types'
import { DEMO_SHOPS } from '@/lib/demo-shops'
import { useLang } from '@/lib/lang'

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap').then(m => m.LeafletMap),
  { ssr: false }
)

export default function MapPage() {
  const { lang } = useLang()
  const [allShops, setAllShops] = useState<Shop[]>(DEMO_SHOPS)
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [center, setCenter] = useState<[number, number]>([26.8467, 80.9462])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords
      setCenter([lat, lng])
      getNearbyShops(lat, lng, 3000)
        .then(s => setAllShops(s.length > 0 ? s : DEMO_SHOPS))
        .catch(() => setAllShops(DEMO_SHOPS))
    }, () => {
      getNearbyShops(26.8467, 80.9462, 3000)
        .then(s => setAllShops(s.length > 0 ? s : DEMO_SHOPS))
        .catch(() => setAllShops(DEMO_SHOPS))
    })
  }, [])

  const visibleShops = useMemo(() =>
    selectedCat
      ? allShops.filter(s => s.category?.slug === selectedCat)
      : allShops,
    [allShops, selectedCat]
  )

  return (
    <main className="h-screen flex flex-col">
      <div className="px-5 pt-10 pb-3 bg-white/80 dark:bg-bg-dark/90 backdrop-blur-2xl border-b border-black/[0.05] dark:border-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:shadow-none z-10">
        <h2 className="font-syne text-base font-bold text-gray-900 dark:text-white mb-2">
          {lang === 'en' ? 'Map' : 'नक्शा'}
        </h2>
        <CategoryGrid selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <div className="flex-1 relative z-0">
        <LeafletMap shops={visibleShops} center={center} />
      </div>
      <BottomNav />
    </main>
  )
}
