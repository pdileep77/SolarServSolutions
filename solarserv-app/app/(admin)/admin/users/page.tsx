export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      assets: { select: { id: true, assetType: true } },
      _count: { select: { serviceRequests: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch live roles from Clerk for all users in one batch
  const client = await clerkClient()
  const clerkIds = users.map((u) => u.clerkId)
  const clerkUsers = await Promise.all(clerkIds.map((id) => client.users.getUser(id).catch(() => null)))
  const roleMap: Record<string, string> = {}
  clerkUsers.forEach((cu) => {
    if (cu) roleMap[cu.id] = (cu.publicMetadata as any)?.role ?? 'homeowner'
  })

  const roleBadge = (role: string) => {
    const config: Record<string, { bg: string; color: string }> = {
      admin:     { bg: 'rgba(186,26,26,0.1)',   color: '#ba1a1a' },
      operator:  { bg: 'rgba(29,111,168,0.12)', color: '#1d6fa8' },
      homeowner: { bg: 'rgba(245,158,11,0.12)', color: '#b45309' },
    }
    const c = config[role] ?? config.homeowner
    return (
      <span
        className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
        style={{ background: c.bg, color: c.color }}
      >
        {role}
      </span>
    )
  }

  const assetTypeBadge = (type: string) => {
    const config: Record<string, { bg: string; color: string; icon: string }> = {
      Residential:  { bg: 'rgba(80,94,128,0.1)',  color: '#384667', icon: '🏠' },
      Commercial:   { bg: 'rgba(0,155,107,0.1)',  color: '#005236', icon: '🏢' },
      Agriculture:  { bg: 'rgba(133,83,0,0.1)',   color: '#653e00', icon: '🌾' },
    }
    const c = config[type] ?? config.Residential
    return (
      <span
        key={type}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mr-1 mb-1"
        style={{ background: c.bg, color: c.color }}
      >
        {c.icon} {type}
      </span>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          User Management
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          {users.length} registered users
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--color-surface-container-lowest)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--color-surface-container-low)' }}>
                {['User', 'Email', 'Role', 'Asset Types', 'Assets', 'Requests', 'Joined'].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const liveRole = roleMap[user.clerkId] ?? 'homeowner'
                // Collect unique asset types for this user
                const uniqueTypes = [...new Set(user.assets.map((a) => a.assetType))]

                return (
                  <tr
                    key={user.id}
                    className="hover:opacity-80 transition-opacity"
                    style={{
                      borderTop: i > 0 ? '1px solid var(--color-surface-container)' : 'none',
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{
                            background: 'var(--color-surface-container)',
                            color: 'var(--color-primary-container)',
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: 'var(--color-on-surface)' }}
                        >
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {user.email}
                    </td>
                    <td className="px-5 py-4">{roleBadge(liveRole)}</td>
                    <td className="px-5 py-4">
                      {uniqueTypes.length === 0 ? (
                        <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>—</span>
                      ) : (
                        <div className="flex flex-wrap">{uniqueTypes.map(assetTypeBadge)}</div>
                      )}
                    </td>
                    <td
                      className="px-5 py-4 text-sm font-bold text-center"
                      style={{ color: 'var(--color-primary-container)' }}
                    >
                      {user.assets.length}
                    </td>
                    <td
                      className="px-5 py-4 text-sm font-bold text-center"
                      style={{ color: 'var(--color-primary-container)' }}
                    >
                      {user._count.serviceRequests}
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                )
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-sm"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
