'use client'
import { cn } from '@/lib/utils'
import { CATEGORY_DEFS } from '@/lib/categories'
import { CategoryIcon } from './CategoryIcon'

interface CategoryGridProps {
  selected?: string | null
  onSelect?: (slug: string | null) => void
}

const VISIBLE = CATEGORY_DEFS.slice(0, 8)

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 px-5">
      {VISIBLE.map(cat => {
        const active = selected === cat.slug
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect?.(active ? null : cat.slug)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-2xl py-2.5 border transition-all active:scale-95',
              active
                ? 'bg-violet/20 border-violet/45'
                : 'bg-white/[0.05] border-white/[0.08]'
            )}
          >
            <CategoryIcon slug={cat.slug} size={22} />
            <span className={cn('text-[8px] font-semibold', active ? 'text-violet/90' : 'text-white/45')}>
              {cat.name_en === 'More' ? cat.name_en : cat.name_hi}
            </span>
          </button>
        )
      })}
    </div>
  )
}
