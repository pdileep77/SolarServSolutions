import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-primary-container)' }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'var(--color-secondary-container)' }}
      />
      <div
        className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full opacity-5"
        style={{ background: 'var(--color-secondary-container)' }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-secondary-container)' }}
          >
            <span className="text-2xl">☀️</span>
          </div>
          <span
            className="text-2xl font-bold tracking-wide"
            style={{ color: 'var(--color-surface-container-lowest)' }}
          >
            SOLARSERV
          </span>
        </div>

        <h1
          className="text-5xl font-extrabold leading-tight mb-4"
          style={{ color: 'var(--color-surface-container-lowest)' }}
        >
          Harvesting Precision Energy.
        </h1>
        <p
          className="text-xl mb-10 leading-relaxed"
          style={{ color: 'var(--color-on-primary-container)' }}
        >
          Manage your solar assets, schedule maintenance, and track performance
          — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-in"
            className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
            }}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: 'var(--color-surface-container-lowest)',
            }}
          >
            Create Account
          </Link>
        </div>

        <p
          className="mt-12 text-sm"
          style={{ color: 'var(--color-on-primary-container)' }}
        >
          Trusted by homeowners and operators across the region.
        </p>
      </div>
    </main>
  )
}
