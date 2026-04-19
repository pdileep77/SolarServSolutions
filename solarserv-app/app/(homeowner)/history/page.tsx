export const dynamic = 'force-dynamic'

import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatusBadge from '@/components/ui/StatusBadge'

export default async function HistoryPage() {
  const user = await requireUser()

  const requests = await prisma.serviceRequest.findMany({
    where: { userId: user.id },
    include: { asset: true, technician: true },
    orderBy: { requestedDatetime: 'desc' },
  })

  const upcoming = requests.filter(
    (r) => r.status === 'Scheduled' || r.status === 'InProgress'
  )
  const past = requests.filter(
    (r) => r.status === 'Completed' || r.status === 'Cancelled'
  )

  const completed = requests.filter((r) => r.status === 'Completed').length
  const total = requests.length

  const healthScore =
    total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          Service History
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          Track all your service requests and their status.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Stats */}
        <div className="lg:w-72 shrink-0 space-y-4">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--color-primary-container)' }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: 'var(--color-on-primary-container)' }}
            >
              Operational Health
            </h3>
            {/* Health Score Ring */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="8"
                    strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: 'var(--color-surface-container-lowest)' }}
                  >
                    {healthScore}%
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--color-on-primary-container)' }}
                  >
                    Score
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Total Requests', value: total, color: 'var(--color-surface-container-lowest)' },
                { label: 'Completed', value: completed, color: 'var(--color-tertiary-fixed)' },
                { label: 'Upcoming', value: upcoming.length, color: 'var(--color-secondary-container)' },
                { label: 'Cancelled', value: requests.filter((r) => r.status === 'Cancelled').length, color: '#f97171' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-on-primary-container)' }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Timeline */}
        <div className="flex-1 space-y-8">
          {/* Upcoming */}
          <section>
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--color-primary-container)' }}
            >
              <span>📅</span> Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: 'var(--color-surface-container-lowest)' }}
              >
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  No upcoming services.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcoming.map((req) => (
                  <RequestCard key={req.id} req={req} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          <section>
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--color-primary-container)' }}
            >
              <span>📋</span> Past
            </h2>
            {past.length === 0 ? (
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: 'var(--color-surface-container-lowest)' }}
              >
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  No past services.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {past.map((req) => (
                  <RequestCard key={req.id} req={req} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function RequestCard({ req }: { req: any }) {
  const serviceIcons: Record<string, string> = {
    cleaning: '🧹',
    inspection: '🔍',
    maintenance: '🔧',
  }

  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4"
      style={{ background: 'var(--color-surface-container-lowest)' }}
    >
      {/* Timeline dot */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: 'var(--color-surface-container-low)' }}
      >
        {serviceIcons[req.serviceType] || '🔧'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span
              className="font-bold capitalize"
              style={{ color: 'var(--color-primary-container)' }}
            >
              {req.serviceType}
            </span>
            <span
              className="text-sm ml-2"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              — {req.asset?.panelBrand}
            </span>
          </div>
          <StatusBadge status={req.status} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          <span>
            📅{' '}
            {new Date(req.requestedDatetime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {req.technician && (
            <span>👷 {req.technician.name}</span>
          )}
        </div>

        {req.notes && (
          <p
            className="mt-2 text-sm italic"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            "{req.notes}"
          </p>
        )}
      </div>
    </div>
  )
}
