'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getShopById, isOpenNow } from '@/lib/geo'
import { getDemoShop } from '@/lib/demo-shops'
import { Shop } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge'
import { CategoryIcon } from '@/components/shop/CategoryIcon'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { Button } from '@/components/ui/Button'
import { useLang } from '@/lib/lang'
import { CATEGORY_DEFS } from '@/lib/categories'

const DAY_EN: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}
const DAY_HI: Record<string, string> = {
  mon: 'Somwar', tue: 'Mangal', wed: 'Budh', thu: 'Guruwar',
  fri: 'Shukra', sat: 'Shanivaar', sun: 'Raviwar',
}

export function ShopDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const { lang } = useLang()
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id.startsWith('demo-')) {
      const demo = getDemoShop(id)
      setShop(demo ?? null)
      setLoading(false)
      return
    }
    getShopById(id).then(s => { setShop(s); setLoading(false) })
  }, [id])

  const T = {
    back: lang === 'en' ? 'Back' : 'Wapas',
    call: lang === 'en' ? 'Call' : 'Call karo',
    hours: lang === 'en' ? 'Opening Hours' : 'Khulne ka waqt',
    directions: lang === 'en' ? 'Get Directions' : 'Raasta batao',
    report: lang === 'en' ? 'Wrong info? Report it' : 'Galat info hai? Report karo',
    loading: lang === 'en' ? 'Loading...' : 'Load ho raha hai...',
    notFound: lang === 'en' ? 'Shop not found' : 'Shop nahi mili',
    featuredBadge: lang === 'en' ? '⭐ Featured Shop' : '⭐ Featured Dukaan',
  }

  const DAY = lang === 'en' ? DAY_EN : DAY_HI

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-white/40">{T.loading}</p>
      </main>
    )
  }

  if (!shop) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-400 dark:text-white/40">{T.notFound}</p>
        <button onClick={() => router.back()} className="text-violet text-sm">{T.back}</button>
      </main>
    )
  }

  const open = isOpenNow(shop.opening_hours)
  const catDef = CATEGORY_DEFS.find(c => c.slug === (shop.category as any)?.slug)
  const categorySlug = (shop.category as any)?.slug ?? 'more'
  const categoryName = lang === 'en'
    ? ((shop.category as any)?.name_en ?? catDef?.name_en ?? '')
    : ((shop.category as any)?.name_hi ?? catDef?.name_hi ?? '')

  return (
    <main className="min-h-screen pb-24 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-20 left-1/2 -translate-x-1/2 bg-violet/[0.12] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <div className="px-5 pt-12 pb-2">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-xs">{T.back}</span>
          </button>
        </div>

        <div className="mx-5 bg-white/70 dark:bg-white/[0.05] border border-white/90 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(123,91,255,0.07)] dark:shadow-none rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CategoryIcon slug={categorySlug} size={24} withBg />
              <div>
                <h1 className="font-syne text-lg font-bold text-gray-900 dark:text-white leading-tight">{shop.name}</h1>
                {categoryName && (
                  <CategoryBadge label={categoryName} color={catDef?.color ?? '#7B5BFF'} className="mt-1" />
                )}
              </div>
            </div>
            <StatusBadge open={open} lang={lang} className="mt-1" />
          </div>

          {shop.address && (
            <p className="text-[11px] text-gray-500 dark:text-white/45 mt-3 flex items-start gap-1.5">
              <svg width="11" height="13" viewBox="0 0 12 14" fill="currentColor" className="mt-0.5 shrink-0 opacity-50">
                <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 116 3.5a1.5 1.5 0 010 3z"/>
              </svg>
              {shop.address}{shop.area ? `, ${shop.area}` : ''}
            </p>
          )}

          {shop.rating > 0 && (
            <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1.5">
              ⭐ {shop.rating} · {shop.review_count} {lang === 'en' ? 'reviews' : 'reviews'}
            </p>
          )}
        </div>

        {shop.phone && (
          <div className="mx-5 mt-3 flex gap-2">
            <a
              href={`tel:${shop.phone}`}
              className="flex-1"
              onClick={() => {
                if (!id.startsWith('demo-'))
                  supabase.from('call_events').insert({ shop_id: id, ts: new Date().toISOString() })
              }}
            >
              <Button variant="primary" size="lg" className="w-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.61 19.79 19.79 0 01.09 1a2 2 0 012-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                {T.call}
              </Button>
            </a>
            <a
              href={`https://wa.me/${shop.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(lang === 'en' ? `Hi! I found your shop on Bhaiya App.` : `Namaste! Maine aapki dukaan Bhaiya App par dekhi.`)}`}
              target="_blank" rel="noopener noreferrer"
              onClick={() => {
                if (!id.startsWith('demo-'))
                  supabase.from('call_events').insert({ shop_id: id, ts: new Date().toISOString() })
              }}
              className="flex items-center justify-center gap-1.5 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] rounded-2xl px-4 font-semibold text-xs"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 23.625a.75.75 0 00.918.918l5.78-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.513-5.228-1.407l-.374-.217-3.882.988.988-3.882-.217-.374A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        )}

        {shop.opening_hours && Object.keys(shop.opening_hours).length > 0 && (
          <div className="mx-5 mt-3 bg-white/70 dark:bg-white/[0.05] border border-white/90 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(123,91,255,0.07)] dark:shadow-none rounded-2xl p-4 backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">{T.hours}</p>
            <div className="space-y-1.5">
              {Object.entries(shop.opening_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-[10px]">
                  <span className="text-gray-500 dark:text-white/50">{DAY[day] ?? day}</span>
                  <span className="text-gray-700 dark:text-white/80 font-medium">{hours.open} – {hours.close}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shop.lat && shop.lng && (
          <div className="mx-5 mt-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/70 dark:bg-white/[0.05] border border-white/90 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(123,91,255,0.07)] dark:shadow-none rounded-2xl px-4 py-3 text-[11px] font-semibold text-gray-700 dark:text-white/70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"/>
              </svg>
              {T.directions}
            </a>
          </div>
        )}

        {shop.featured && (
          <div className="mx-5 mt-3 flex items-center justify-center gap-1.5 py-2 bg-amber-400/10 border border-amber-400/30 rounded-2xl">
            <span className="text-[10px] font-bold text-amber-500">{T.featuredBadge}</span>
            <span className="text-[9px] text-amber-500/60">· Sponsored listing</span>
          </div>
        )}

        {shop.audio_guide && (
          <div className="mx-5 mt-3">
            <BhaiyaAudioButton text={shop.audio_guide} />
          </div>
        )}

        <div className="mx-5 mt-3">
          <button
            onClick={() => navigator.share?.({
              title: shop.name,
              text: `${lang === 'en' ? 'Found this shop on Bhaiya App' : 'Bhaiya App par yeh dukaan mili'}: ${shop.name}${shop.area ? `, ${shop.area}` : ''}`,
              url: window.location.href,
            })}
            className="w-full flex items-center justify-center gap-2 bg-white/70 dark:bg-white/[0.05] border border-white/90 dark:border-white/[0.08] shadow-[0_4px_24px_rgba(123,91,255,0.07)] dark:shadow-none rounded-2xl px-4 py-3 text-[11px] font-semibold text-gray-600 dark:text-white/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {lang === 'en' ? 'Share this shop' : 'Share karo'}
          </button>
        </div>

        <div className="mx-5 mt-3 text-center flex flex-col gap-2">
          {!shop.featured && (
            <Link
              href={`/claim?shop=${encodeURIComponent(shop.name)}`}
              className="text-[10px] font-semibold text-violet/70 hover:text-violet transition-colors"
            >
              {lang === 'en' ? 'Is this your shop? Claim it →' : 'Kya yeh aapki dukaan hai? Claim karein →'}
            </Link>
          )}
          <Link href={`/add?report=${shop.id}`} className="text-[10px] text-gray-300 dark:text-white/25 hover:text-gray-500 dark:hover:text-white/50 transition-colors">
            {T.report}
          </Link>
        </div>
      </div>
    </main>
  )
}
