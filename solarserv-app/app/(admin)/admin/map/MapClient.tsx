'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap } from 'leaflet'

interface Asset {
  id: string
  lat: number | null
  lng: number | null
  panelBrand: string
  capacityKw: number
  user: { name: string }
}

interface MapClientProps {
  assets: Asset[]
}

export default function MapClient({ assets }: MapClientProps) {
  const mapRef = useRef<LeafletMap | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Destroy any leftover Leaflet instance on the container (Strict Mode / HMR safe)
    const container = containerRef.current as HTMLDivElement & { _leaflet_id?: number }
    if (container._leaflet_id) {
      mapRef.current?.remove()
      mapRef.current = null
      delete container._leaflet_id
    }
    if (mapRef.current) return

    let cancelled = false

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      if (cancelled || !containerRef.current) return

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const assetsWithCoords = assets.filter((a) => a.lat && a.lng)
      const defaultCenter: [number, number] =
        assetsWithCoords.length > 0
          ? [assetsWithCoords[0].lat!, assetsWithCoords[0].lng!]
          : [3.139, 101.6869]

      const map = L.map(containerRef.current, {
        center: defaultCenter,
        zoom: 10,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      assetsWithCoords.forEach((asset) => {
        L.circleMarker([asset.lat!, asset.lng!], {
          radius: 10,
          fillColor: '#f59e0b',
          color: '#0f1f3d',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:Manrope,sans-serif;min-width:160px">
              <strong style="color:#0f1f3d">${asset.user.name}</strong><br/>
              <span style="color:#45474e">${asset.panelBrand} · ${asset.capacityKw} kW</span>
            </div>`
          )
      })
    }

    initMap()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [assets])

  return <div ref={containerRef} className="w-full h-full" />
}
