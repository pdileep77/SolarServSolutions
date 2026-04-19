'use client'

import { useState } from 'react'

type NotificationType = 'booking_confirm' | 'tech_en_route' | 'service_complete' | 'reminder'

interface Notification {
  id: string
  type: NotificationType
  message: string
  readAt: Date | null
  createdAt: Date
}

const TYPE_FILTERS = ['All', 'Bookings', 'Technical'] as const
type FilterType = (typeof TYPE_FILTERS)[number]

const TYPE_ICONS: Record<NotificationType, string> = {
  booking_confirm: '✅',
  tech_en_route: '🚗',
  service_complete: '⭐',
  reminder: '🔔',
}

const FILTER_TYPES: Record<FilterType, NotificationType[] | null> = {
  All: null,
  Bookings: ['booking_confirm'],
  Technical: ['tech_en_route', 'service_complete'],
}

export default function NotificationsClient({
  initialNotifications,
}: {
  initialNotifications: Notification[]
}) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<FilterType>('All')
  const [loading, setLoading] = useState(false)

  const filtered =
    FILTER_TYPES[filter] === null
      ? notifications
      : notifications.filter((n) => FILTER_TYPES[filter]!.includes(n.type))

  const handleMarkAllRead = async () => {
    setLoading(true)
    try {
      await fetch('/api/notifications/read-all', { method: 'PATCH' })
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date() }))
      )
    } catch {}
    setLoading(false)
  }

  return (
    <div>
      {/* Filters + Action */}
      <div className="flex items-center justify-between mb-6">
        <div
          className="flex rounded-xl overflow-hidden"
          style={{ background: 'var(--color-surface-container)' }}
        >
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 text-sm font-semibold transition-all"
              style={{
                background: filter === f ? 'var(--color-primary-container)' : 'transparent',
                color:
                  filter === f
                    ? 'var(--color-surface-container-lowest)'
                    : 'var(--color-on-surface-variant)',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={loading}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80 disabled:opacity-50"
          style={{
            background: 'var(--color-surface-container-low)',
            color: 'var(--color-primary-container)',
          }}
        >
          {loading ? '...' : 'Mark All Read'}
        </button>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: 'var(--color-surface-container-lowest)' }}
        >
          <div className="text-4xl mb-3">🔔</div>
          <p style={{ color: 'var(--color-on-surface-variant)' }}>
            No notifications here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl p-5 flex items-start gap-4 transition-all"
              style={{
                background: n.readAt
                  ? 'var(--color-surface-container-lowest)'
                  : 'var(--color-surface-container-low)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--color-surface-container)' }}
              >
                {TYPE_ICONS[n.type]}
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
                    weekday: 'short',
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
  )
}
