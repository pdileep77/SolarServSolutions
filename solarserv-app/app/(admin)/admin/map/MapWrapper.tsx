'use client'

import dynamic from 'next/dynamic'

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'var(--color-surface-container-low)' }}
    >
      <p style={{ color: 'var(--color-on-surface-variant)' }}>Loading map...</p>
    </div>
  ),
})

interface Asset {
  id: string
  lat: number | null
  lng: number | null
  panelBrand: string
  capacityKw: number
  user: { name: string }
}

export default function MapWrapper({ assets }: { assets: Asset[] }) {
  return <MapClient assets={assets} />
}
