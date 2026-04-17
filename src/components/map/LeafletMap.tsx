'use client'
import { useEffect, useRef } from 'react'
import { Shop } from '@/lib/types'
import { isOpenNow } from '@/lib/geo'
import { getCategoryDef } from '@/lib/categories'

interface LeafletMapProps {
  shops: Shop[]
  center?: [number, number]
  categoryColors: Record<string, string>
  onShopClick?: (shop: Shop) => void
}

export function LeafletMap({ shops, center = [26.8467, 80.9462], categoryColors, onShopClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('leaflet').then(L => {
      if (!mapRef.current || mapInstanceRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center,
        zoom: 14,
        zoomControl: false,
      })
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then(L => {
      const map = mapInstanceRef.current
      map.eachLayer((layer: any) => {
        if (layer._bhaiyaShop) map.removeLayer(layer)
      })

      shops.forEach(shop => {
        const def = getCategoryDef(
          Object.keys(categoryColors).find(slug =>
            categoryColors[slug] === (shop.category as any)?.color
          ) ?? 'more'
        )
        const color = def?.color ?? '#7B5BFF'
        const open = isOpenNow(shop.opening_hours)

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:${color}33;border:2px solid ${color};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 8px ${color}55;
          ">
            <div style="width:8px;height:8px;border-radius:50%;background:${open ? '#00dc64' : '#ff7070'};"></div>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker([shop.lat, shop.lng], { icon }).addTo(map)
        ;(marker as any)._bhaiyaShop = true
        marker.bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <strong style="font-size:12px">${shop.name}</strong><br>
            <span style="font-size:10px;color:#666">${shop.area ?? ''}</span><br>
            ${shop.phone ? `<a href="tel:${shop.phone}" style="font-size:11px;color:#7B5BFF">📞 ${shop.phone}</a>` : ''}
          </div>
        `)
        marker.on('click', () => onShopClick?.(shop))
      })
    })
  }, [shops])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}
