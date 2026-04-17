'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/lang'

const NAV_ITEMS = [
  {
    href: '/',
    label_en: 'Home',
    label_hi: 'होम',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/map',
    label_en: 'Map',
    label_hi: 'नक्शा',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
  },
  {
    href: '/search',
    label_en: 'Search',
    label_hi: 'खोजें',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: '/add',
    label_en: 'Add',
    label_hi: 'जोड़ें',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-dark/90 dark:bg-bg-dark/90 backdrop-blur-2xl border-t border-black/[0.07] dark:border-white/[0.06] flex pb-safe">
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors',
              active ? 'text-violet' : 'text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60'
            )}
          >
            {item.icon}
            <span className="text-[8px] font-semibold">
              {lang === 'en' ? item.label_en : item.label_hi}
            </span>
            {active && <span className="w-1 h-1 rounded-full bg-violet" />}
          </Link>
        )
      })}
    </nav>
  )
}
