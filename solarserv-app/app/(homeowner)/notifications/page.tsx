export const dynamic = 'force-dynamic'

import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NotificationsClient from './NotificationsClient'

export default async function NotificationsPage() {
  const user = await requireUser()

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-extrabold mb-1"
            style={{ color: 'var(--color-primary-container)' }}
          >
            Notifications
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)' }}>
            {notifications.filter((n) => !n.readAt).length} unread
          </p>
        </div>
      </div>
      <NotificationsClient initialNotifications={notifications} />
    </div>
  )
}
