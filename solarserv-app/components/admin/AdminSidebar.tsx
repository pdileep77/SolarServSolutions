'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/map', label: 'Map View', icon: '🗺️' },
  { href: '/admin/requests', label: 'Service Requests', icon: '🔧' },
  { href: '/admin/users', label: 'User Management', icon: '👥' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-64 flex flex-col z-40"
      style={{ background: 'var(--color-surface-container-low)' }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center gap-3 px-6"
        style={{ borderBottom: '1px solid var(--color-surface-container)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--color-secondary-container)' }}
        >
          <span className="text-sm">☀️</span>
        </div>
        <div>
          <div
            className="text-sm font-bold tracking-wider"
            style={{ color: 'var(--color-primary-container)' }}
          >
            SOLARSERV
          </div>
          <div
            className="text-xs"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Admin Console
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div
          className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Management
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isActive
                    ? 'var(--color-primary-container)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--color-surface-container-lowest)'
                    : 'var(--color-on-surface)',
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--color-secondary-container)' }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* System Status */}
      <div
        className="px-6 py-4"
        style={{ borderTop: '1px solid var(--color-surface-container)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
            System Operational
          </span>
        </div>
        <SignOutButton>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: 'rgba(186,26,26,0.08)',
              color: 'var(--color-error)',
            }}
          >
            <span>🚪</span> Sign Out
          </button>
        </SignOutButton>
      </div>
    </aside>
  )
}
