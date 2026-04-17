import { LocationChip } from './LocationChip'

interface TopBarProps {
  onLocation?: (lat: number, lng: number) => void
}

export function TopBar({ onLocation }: TopBarProps) {
  return (
    <div className="flex flex-col gap-2 pt-8 pb-0 px-5">
      <div className="flex items-center justify-between">
        <h1 className="font-syne text-xl font-extrabold tracking-tight bg-gradient-to-br from-white to-violet/70 bg-clip-text text-transparent">
          Bhaiya App
        </h1>
        <button className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center" aria-label="Notifications">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </div>
      <LocationChip onLocation={onLocation} />
    </div>
  )
}
