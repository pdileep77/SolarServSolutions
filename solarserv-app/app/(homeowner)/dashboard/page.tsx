export const dynamic = 'force-dynamic'

import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await requireUser()

  const [assetsCount, serviceRequests, notifications] = await Promise.all([
    prisma.solarAsset.count({ where: { userId: user.id } }),
    prisma.serviceRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ])

  const upcoming = serviceRequests.filter(
    (r) => r.status === 'Scheduled' || r.status === 'InProgress'
  ).length
  const completed = serviceRequests.filter((r) => r.status === 'Completed').length

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const firstName = user.name.split(' ')[0]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          Here's an overview of your solar assets and services.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Assets Registered',
            value: assetsCount,
            icon: '⚡',
            color: 'var(--color-primary-container)',
          },
          {
            label: 'Upcoming Services',
            value: upcoming,
            icon: '📅',
            color: '#1d6fa8',
          },
          {
            label: 'Completed Services',
            value: completed,
            icon: '✅',
            color: 'var(--color-on-tertiary-container)',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                className="text-3xl font-extrabold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2
          className="text-lg font-bold mb-4"
          style={{ color: 'var(--color-primary-container)' }}
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/assets/new"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
            }}
          >
            <span className="text-xl">➕</span>
            Register Asset
          </Link>
          <Link
            href="/book"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: 'var(--color-primary-container)',
              color: 'var(--color-surface-container-lowest)',
            }}
          >
            <span className="text-xl">🔧</span>
            Book Service
          </Link>
          <Link
            href="/assets"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: 'var(--color-surface-container)',
              color: 'var(--color-on-surface)',
            }}
          >
            <span className="text-xl">⚡</span>
            View Assets
          </Link>
        </div>
      </div>

      {/* Recent Notifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Recent Notifications
          </h2>
          <Link
            href="/notifications"
            className="text-sm font-semibold"
            style={{ color: 'var(--color-secondary-container)' }}
          >
            View all →
          </Link>
        </div>

        {notifications.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <div className="text-3xl mb-2">🔔</div>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
              No notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-2xl p-4 flex items-start gap-4"
                style={{
                  background: n.readAt
                    ? 'var(--color-surface-container-lowest)'
                    : 'var(--color-surface-container-low)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
                  style={{ background: 'var(--color-surface-container)' }}
                >
                  {n.type === 'booking_confirm'
                    ? '✅'
                    : n.type === 'tech_en_route'
                    ? '🚗'
                    : n.type === 'service_complete'
                    ? '⭐'
                    : '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    {n.message}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    {new Date(n.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!n.readAt && (
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ background: 'var(--color-secondary-container)' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
