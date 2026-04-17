import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getShopById, isOpenNow } from '@/lib/geo'
import { StatusBadge, CategoryBadge } from '@/components/ui/Badge'
import { CategoryIcon } from '@/components/shop/CategoryIcon'
import { BhaiyaAudioButton } from '@/components/audio/BhaiyaAudioButton'
import { Button } from '@/components/ui/Button'

interface Props {
  params: { id: string }
}

const DAY_LABELS: Record<string, string> = {
  mon: 'Somwar', tue: 'Mangal', wed: 'Budh', thu: 'Guruwar',
  fri: 'Shukra', sat: 'Shanivaar', sun: 'Raviwar',
}

export default async function ShopDetailPage({ params }: Props) {
  const shop = await getShopById(params.id)
  if (!shop) notFound()

  const open = isOpenNow(shop.opening_hours)
  const categorySlug = (shop.category as any)?.slug ?? 'more'
  const categoryName = (shop.category as any)?.name_hi ?? ''

  return (
    <main className="min-h-screen bg-bg-dark pb-24 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-20 left-1/2 -translate-x-1/2 bg-violet/[0.12] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <div className="px-5 pt-12 pb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-xs">Wapas</span>
          </Link>
        </div>

        <div className="mx-5 bg-white/[0.05] border border-white/[0.08] rounded-3xl p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <CategoryIcon slug={categorySlug} size={24} withBg />
              <div>
                <h1 className="font-syne text-lg font-bold text-white leading-tight">{shop.name}</h1>
                {categoryName && (
                  <CategoryBadge label={categoryName} color={(shop.category as any)?.color ?? '#7B5BFF'} className="mt-1" />
                )}
              </div>
            </div>
            <StatusBadge open={open} className="mt-1" />
          </div>

          {shop.address && (
            <p className="text-[11px] text-white/45 mt-3 flex items-start gap-1.5">
              <svg width="11" height="13" viewBox="0 0 12 14" fill="rgba(255,255,255,0.35)" className="mt-0.5 shrink-0">
                <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 116 3.5a1.5 1.5 0 010 3z"/>
              </svg>
              {shop.address}{shop.area ? `, ${shop.area}` : ''}
            </p>
          )}

          {shop.rating > 0 && (
            <p className="text-[11px] text-white/40 mt-1.5">⭐ {shop.rating} · {shop.review_count} reviews</p>
          )}
        </div>

        {shop.phone && (
          <div className="mx-5 mt-3">
            <a href={`tel:${shop.phone}`}>
              <Button variant="primary" size="lg" className="w-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.61 19.79 19.79 0 01.09 1a2 2 0 012-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Call: {shop.phone}
              </Button>
            </a>
          </div>
        )}

        {shop.opening_hours && Object.keys(shop.opening_hours).length > 0 && (
          <div className="mx-5 mt-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-3">Khulne ka waqt</p>
            <div className="space-y-1.5">
              {Object.entries(shop.opening_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-[10px]">
                  <span className="text-white/50">{DAY_LABELS[day] ?? day}</span>
                  <span className="text-white/80 font-medium">{hours.open} – {hours.close}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {shop.audio_guide && (
          <div className="mx-5 mt-3">
            <BhaiyaAudioButton text={shop.audio_guide} />
          </div>
        )}

        <div className="mx-5 mt-4 text-center">
          <Link href={`/add?report=${shop.id}`} className="text-[10px] text-white/25 hover:text-white/50 transition-colors">
            Galat info hai? Report karo
          </Link>
        </div>
      </div>
    </main>
  )
}
