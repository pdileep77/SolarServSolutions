export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalAssets,
    openRequests,
    completedThisMonth,
    recentRequests,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.solarAsset.count(),
    prisma.serviceRequest.count({
      where: { status: { in: ['Scheduled', 'InProgress'] } },
    }),
    prisma.serviceRequest.count({
      where: {
        status: 'Completed',
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.serviceRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, asset: true },
    }),
  ])

  const kpis = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: '#1d6fa8' },
    { label: 'Solar Assets', value: totalAssets, icon: '⚡', color: '#f59e0b' },
    { label: 'Open Requests', value: openRequests, icon: '🔧', color: '#ba1a1a' },
    { label: 'Completed This Month', value: completedThisMonth, icon: '✅', color: '#009b6b' },
    {
      label: 'Completion Rate',
      value:
        totalAssets > 0
          ? `${Math.round((completedThisMonth / Math.max(completedThisMonth + openRequests, 1)) * 100)}%`
          : '0%',
      icon: '📈',
      color: 'var(--color-primary-container)',
    },
  ]

  // Mock monthly data for bar chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const barData = [12, 19, 15, 25, 22, completedThisMonth]
  const maxBar = Math.max(...barData, 1)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          System overview and key performance indicators.
        </p>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl p-5"
            style={{ background: 'var(--color-surface-container-lowest)' }}
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div
              className="text-3xl font-extrabold mb-1"
              style={{ color: kpi.color }}
            >
              {kpi.value}
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-surface-container-lowest)' }}
        >
          <h2
            className="text-lg font-bold mb-6"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Services Completed (Last 6 Months)
          </h2>
          <div className="flex items-end gap-3 h-48">
            {barData.map((val, i) => (
              <div key={months[i]} className="flex-1 flex flex-col items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {val}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(val / maxBar) * 160}px`,
                    background:
                      i === barData.length - 1
                        ? 'var(--color-secondary-container)'
                        : 'var(--color-surface-container-highest)',
                    minHeight: '4px',
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {months[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-surface-container-lowest)' }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Recent Activity
          </h2>
          {recentRequests.length === 0 ? (
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
              No recent activity.
            </p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: '1px solid var(--color-surface-container)' }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0"
                    style={{ background: 'var(--color-surface-container-low)' }}
                  >
                    {req.serviceType === 'cleaning'
                      ? '🧹'
                      : req.serviceType === 'inspection'
                      ? '🔍'
                      : '🔧'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      {req.user.name}
                    </p>
                    <p
                      className="text-xs capitalize"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      {req.serviceType} · {req.asset.panelBrand}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full shrink-0"
                    style={{
                      background:
                        req.status === 'Completed'
                          ? 'rgba(0,155,107,0.12)'
                          : req.status === 'InProgress'
                          ? 'rgba(29,111,168,0.12)'
                          : req.status === 'Cancelled'
                          ? 'rgba(186,26,26,0.1)'
                          : 'rgba(245,158,11,0.12)',
                      color:
                        req.status === 'Completed'
                          ? '#009b6b'
                          : req.status === 'InProgress'
                          ? '#1d6fa8'
                          : req.status === 'Cancelled'
                          ? '#ba1a1a'
                          : '#b45309',
                    }}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
