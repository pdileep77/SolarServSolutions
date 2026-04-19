'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/assets', label: 'Assets', icon: '⚡' },
  { href: '/book', label: 'Book', icon: '📅' },
  { href: '/history', label: 'History', icon: '📋' },
]

export default function HomeNav() {
  const pathname = usePathname()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 gap-6"
      style={{
        background: 'var(--color-primary-container)',
        boxShadow: '0 2px 16px rgba(15,31,61,0.18)',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--color-secondary-container)' }}
        >
          <span className="text-sm">☀️</span>
        </div>
        <span
          className="text-base font-bold tracking-widest hidden sm:block"
          style={{ color: 'var(--color-surface-container-lowest)' }}
        >
          SOLARSERV
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isActive ? 'rgba(245,158,11,0.2)' : 'transparent',
                color: isActive
                  ? 'var(--color-secondary-container)'
                  : 'var(--color-on-primary-container)',
              }}
            >
              <span className="hidden sm:inline">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link
          href="/notifications"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          title="Notifications"
        >
          <span style={{ color: 'var(--color-on-primary-container)' }}>🔔</span>
        </Link>
        <UserButton
          appearance={{
            variables: {
              colorPrimary: '#f59e0b',
            },
          }}
        />
      </div>
    </header>
  )
}
