export const dynamic = 'force-dynamic'

import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function AssetsPage() {
  const user = await requireUser()

  const assets = await prisma.solarAsset.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-extrabold mb-1"
            style={{ color: 'var(--color-primary-container)' }}
          >
            My Solar Assets
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)' }}>
            {assets.length} asset{assets.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <Link
          href="/assets/new"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all hover:opacity-90"
          style={{
            background: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
          }}
        >
          <span>➕</span>
          Register New Asset
        </Link>
      </div>

      {assets.length === 0 ? (
        <div
          className="rounded-3xl p-16 text-center"
          style={{ background: 'var(--color-surface-container-lowest)' }}
        >
          <div className="text-6xl mb-4">⚡</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--color-primary-container)' }}
          >
            No assets yet
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            Register your first solar asset to get started.
          </p>
          <Link
            href="/assets/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{
              background: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
            }}
          >
            ➕ Register Asset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
              style={{ background: 'var(--color-surface-container-lowest)' }}
            >
              {/* Photo */}
              <div
                className="h-40 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'var(--color-surface-container)' }}
              >
                {asset.photoUrl ? (
                  <Image
                    src={asset.photoUrl}
                    alt={`${asset.panelBrand} solar panels`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-5xl opacity-40">☀️</div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: 'var(--color-primary-container)' }}
                  >
                    {asset.panelBrand}
                  </h3>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      color: 'var(--color-secondary-container)',
                    }}
                  >
                    {asset.capacityKw} kW
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { icon: '🔢', label: 'Panels', value: `${asset.panelCount} panels` },
                    {
                      icon: '📅',
                      label: 'Installed',
                      value: new Date(asset.installDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      }),
                    },
                    ...(asset.propertyZone
                      ? [{ icon: '📍', label: 'Zone', value: asset.propertyZone }]
                      : []),
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {asset.lat && asset.lng && (
                  <div
                    className="mt-3 pt-3 flex items-center gap-1 text-xs"
                    style={{
                      borderTop: '1px solid var(--color-outline-variant)',
                      color: 'var(--color-on-surface-variant)',
                    }}
                  >
                    <span>📌</span>
                    <span>
                      {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
