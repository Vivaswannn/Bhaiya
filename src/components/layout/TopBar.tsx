import { LocationChip } from './LocationChip'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import LangToggle from './LangToggle'

interface TopBarProps {
  onLocation?: (lat: number, lng: number) => void
}

export function TopBar({ onLocation }: TopBarProps) {
  return (
    <div className="flex flex-col gap-2 pt-8 pb-0 px-5">
      <div className="flex items-center justify-between">
        <h1 className="font-syne text-xl font-extrabold tracking-tight bg-gradient-to-br from-violet to-violet/50 bg-clip-text text-transparent">
          Bhaiya App
        </h1>
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <button className="w-8 h-8 rounded-xl bg-black/[0.06] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white/70" aria-label="Notifications">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
        </div>
      </div>
      <LocationChip onLocation={onLocation} />
    </div>
  )
}
