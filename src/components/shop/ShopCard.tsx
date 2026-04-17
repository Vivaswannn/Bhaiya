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
  return (
    <Link
      href={`/shop/${shop.id}`}
      className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-3 backdrop-blur-xl active:scale-[0.98] transition-transform"
    >
      <CategoryIcon slug={categorySlug ?? 'more'} size={18} withBg />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-white truncate">{shop.name}</p>
        <p className="text-[9px] text-white/40 mt-0.5">
          {shop.dist_m != null && distanceLabel(shop.dist_m)} · ⭐ {shop.rating}
          {shop.phone && ` · ${shop.phone}`}
        </p>
      </div>
      <StatusBadge open={open} />
    </Link>
  )
}
