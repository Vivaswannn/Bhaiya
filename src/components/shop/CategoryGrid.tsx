'use client'
import { cn } from '@/lib/utils'
import { CATEGORY_DEFS } from '@/lib/categories'
import { CategoryIcon } from './CategoryIcon'
import { useLang } from '@/lib/lang'

interface CategoryGridProps {
  selected?: string | null
  onSelect?: (slug: string | null) => void
}

const VISIBLE = CATEGORY_DEFS.slice(0, 8)

export function CategoryGrid({ selected, onSelect }: CategoryGridProps) {
  const { lang } = useLang()
  return (
    <div className="grid grid-cols-4 gap-2 px-5">
      {VISIBLE.map(cat => {
        const active = selected === cat.slug
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect?.(active ? null : cat.slug)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl py-3 border transition-all active:scale-95',
              active
                ? 'bg-violet/20 border-violet/45'
                : 'bg-black/[0.04] dark:bg-white/[0.05] border-black/[0.08] dark:border-white/[0.08]'
            )}
          >
            <CategoryIcon slug={cat.slug} size={26} />
            <span className={cn(
              'text-[9px] font-semibold leading-tight text-center',
              active ? 'text-violet' : 'text-gray-500 dark:text-white/45'
            )}>
              {lang === 'en' ? cat.name_en : cat.name_hi}
            </span>
          </button>
        )
      })}
    </div>
  )
}
