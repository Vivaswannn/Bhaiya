'use client'
import { useState, useEffect, useMemo } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { ShopCard } from '@/components/shop/ShopCard'
import { CategoryGrid } from '@/components/shop/CategoryGrid'
import { getNearbyShops } from '@/lib/geo'
import { Shop, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { DEMO_SHOPS } from '@/lib/demo-shops'
import { useLang } from '@/lib/lang'

type SortKey = 'distance' | 'rating'

export default function SearchPage() {
  const { lang } = useLang()
  const [allShops, setAllShops] = useState<Shop[]>(DEMO_SHOPS)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('distance')
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState<[number, number]>([26.8467, 80.9462])
  const [usingDemo, setUsingDemo] = useState(true)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => { if (data) setCategories(data) })
    navigator.geolocation?.getCurrentPosition(
      pos => setLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }, [])

  useEffect(() => {
    getNearbyShops(location[0], location[1], 5000, selectedCat ?? undefined).then(shops => {
      if (shops.length > 0) {
        setAllShops(shops)
        setUsingDemo(false)
      } else {
        const base = selectedCat
          ? DEMO_SHOPS.filter(s => s.category?.slug === selectedCat)
          : DEMO_SHOPS
        setAllShops(base)
        setUsingDemo(true)
      }
    }).catch(() => {
      const base = selectedCat
        ? DEMO_SHOPS.filter(s => s.category?.slug === selectedCat)
        : DEMO_SHOPS
      setAllShops(base)
      setUsingDemo(true)
    })
  }, [location, selectedCat])

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    rec.interimResults = false
    rec.onresult = (e: any) => setQuery(e.results[0][0].transcript)
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.start()
    setListening(true)
  }

  const getCategorySlug = (categoryId: string | null) =>
    categories.find(c => c.id === categoryId)?.slug ?? 'more'

  const filtered = useMemo(() => {
    let list = allShops
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.area ?? '').toLowerCase().includes(q) ||
        (s.address ?? '').toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : (a.dist_m ?? 0) - (b.dist_m ?? 0)
    )
  }, [allShops, query, sort])

  const T = {
    title: lang === 'en' ? 'Search' : 'खोजें',
    placeholder: lang === 'en' ? 'Shop name, area...' : 'Shop ka naam, area...',
    nearest: lang === 'en' ? 'Nearest' : 'सबसे नज़दीक',
    bestRated: lang === 'en' ? 'Best Rated' : 'Best Rating',
    noResults: lang === 'en' ? 'No shops found' : 'Koi shop nahi mili',
    demo: lang === 'en' ? 'Demo data' : 'Demo data',
    voiceHint: lang === 'en' ? 'Listening...' : 'Bol rahe hain...',
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="px-5 pt-10 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne text-lg font-bold text-gray-900 dark:text-white">{T.title}</h2>
          {usingDemo && (
            <span className="text-[8px] text-amber-500/80 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
              {T.demo}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/[0.055] border border-black/[0.07] dark:border-white/10 rounded-2xl px-4 py-2.5 mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-400 dark:text-white/30 shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={listening ? T.voiceHint : T.placeholder}
            className="flex-1 bg-transparent text-[11px] text-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-gray-400 dark:text-white/30 text-xs">✕</button>
          ) : (
            <button
              onClick={startVoice}
              className={`transition-colors ${listening ? 'text-violet animate-pulse' : 'text-gray-400 dark:text-white/30'}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
              </svg>
            </button>
          )}
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
                ? 'bg-violet/20 border-violet/40 text-violet'
                : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-gray-500 dark:text-white/40'
            }`}
          >
            {key === 'distance' ? T.nearest : T.bestRated}
          </button>
        ))}
        <span className="ml-auto text-[9px] text-gray-400 dark:text-white/30 self-center">
          {filtered.length} {lang === 'en' ? 'shops' : 'shops'}
        </span>
      </div>

      <div className="px-5 flex flex-col gap-2.5">
        {filtered.map(shop => (
          <ShopCard key={shop.id} shop={shop} categorySlug={getCategorySlug(shop.category_id)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-[11px] text-gray-400 dark:text-white/30 text-center py-8">{T.noResults}</p>
        )}
      </div>
      <BottomNav />
    </main>
  )
}
