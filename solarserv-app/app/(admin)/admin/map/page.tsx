export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import MapWrapper from './MapWrapper'

export default async function AdminMapPage() {
  const assets = await prisma.solarAsset.findMany({
    include: { user: { select: { name: true } } },
  })

  const assetsWithCoords = assets.filter((a) => a.lat && a.lng)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between shrink-0" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-container)' }}>
            Asset Map
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {assetsWithCoords.length} assets with GPS coordinates
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapWrapper assets={assets} />

        {/* Glassmorphism overlay */}
        <div
          className="absolute top-4 left-4 z-[1000] glass-effect rounded-2xl p-4 min-w-[160px]"
          style={{ boxShadow: '0 4px 16px rgba(15,31,61,0.12)' }}
        >
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Assets on Map
          </div>
          <div
            className="text-3xl font-extrabold"
            style={{ color: 'var(--color-primary-container)' }}
          >
            {assetsWithCoords.length}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            of {assets.length} total
          </div>
        </div>
      </div>
    </div>
  )
}
