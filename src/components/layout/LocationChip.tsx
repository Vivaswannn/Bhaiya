'use client'
import { useState, useEffect } from 'react'

interface LocationChipProps {
  onLocation?: (lat: number, lng: number) => void
}

export function LocationChip({ onLocation }: LocationChipProps) {
  const [area, setArea] = useState('Lucknow')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        onLocation?.(lat, lng)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await res.json()
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district
          if (suburb) setArea(suburb)
        } catch {}
        setLoading(false)
      },
      () => setLoading(false)
    )
  }, [])

  return (
    <button className="inline-flex items-center gap-1.5 bg-violet/10 border border-violet/25 rounded-full px-3 py-1 backdrop-blur-md">
      <svg width="9" height="11" viewBox="0 0 12 14" fill="#7B5BFF">
        <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 116 3.5a1.5 1.5 0 010 3z"/>
      </svg>
      <span className="text-[9px] font-semibold text-white/65">
        {loading ? '...' : area}
      </span>
      <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
        <path d="M3 4.5l3 3 3-3"/>
      </svg>
    </button>
  )
}
