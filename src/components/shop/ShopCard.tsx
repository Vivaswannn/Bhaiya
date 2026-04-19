import Link from 'next/link'
import { Shop } from '@/lib/types'
import { distanceLabel, isOpenNow } from '@/lib/geo'
import { StatusBadge } from '@/components/ui/Badge'
import { CategoryIcon } from './CategoryIcon'

interface ShopCardProps {
  shop: Shop
  categorySlug?: string
}

export function ShopCard({ shop, categorySlug }: ShopCardProps) {
  const open = isOpenNow(shop.opening_hours)
  const slug = categorySlug ?? shop.category?.slug ?? 'more'
  return (
    <Link
      href={`/shop/${shop.id}`}
      className="flex items-center gap-3 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl p-3 backdrop-blur-xl active:scale-[0.98] transition-transform relative overflow-hidden"
    >
      {shop.featured && (
        <div className="absolute top-0 right-0 bg-amber-400 text-[7px] font-black text-amber-900 px-2 py-0.5 rounded-bl-xl tracking-wider">
          FEATURED
        </div>
      )}
      <CategoryIcon slug={slug} size={18} withBg />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{shop.name}</p>
        <p className="text-[9px] text-gray-500 dark:text-white/40 mt-0.5">
          {shop.dist_m != null && distanceLabel(shop.dist_m)} · ⭐ {shop.rating}
          {shop.area && ` · ${shop.area}`}
        </p>
      </div>
      <StatusBadge open={open} />
    </Link>
  )
}
