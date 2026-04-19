import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface)' }}>
      {/* Left Panel - Brand */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'var(--color-primary-container)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'var(--color-secondary-container)' }}
        />
        <div
          className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full opacity-8"
          style={{ background: 'var(--color-secondary-container)' }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-secondary-container)' }}
          >
            <span className="text-xl">☀️</span>
          </div>
          <span
            className="text-xl font-bold tracking-widest"
            style={{ color: 'var(--color-surface-container-lowest)' }}
          >
            SOLARSERV
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
            style={{ background: 'rgba(245,158,11,0.15)' }}
          >
            <span className="text-5xl">⚡</span>
          </div>
          <h2
            className="text-4xl font-extrabold leading-tight mb-4"
            style={{ color: 'var(--color-surface-container-lowest)' }}
          >
            Harvesting<br />Precision Energy.
          </h2>
          <p
            className="text-lg leading-relaxed max-w-sm"
            style={{ color: 'var(--color-on-primary-container)' }}
          >
            Your complete solar asset management platform. Monitor performance,
            schedule services, and optimize your energy production.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-6">
          {[
            { value: '2,400+', label: 'Assets Managed' },
            { value: '98%', label: 'Uptime' },
            { value: '5★', label: 'Rated Service' },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="text-2xl font-bold"
                style={{ color: 'var(--color-secondary-container)' }}
              >
                {stat.value}
              </div>
              <div
                className="text-sm"
                style={{ color: 'var(--color-on-primary-container)' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8" style={{ background: 'var(--color-surface-container-lowest)' }}>
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--color-primary-container)' }}
            >
              Welcome back
            </h1>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
              Sign in to your SolarServ account
            </p>
          </div>
          <SignIn
            appearance={{
              variables: {
                colorPrimary: '#f59e0b',
                colorBackground: '#ffffff',
                colorText: '#0b1c30',
                colorTextSecondary: '#45474e',
                colorInputBackground: '#eff4ff',
                colorInputText: '#0b1c30',
                borderRadius: '12px',
                fontFamily: 'Manrope, sans-serif',
              },
              elements: {
                card: 'shadow-none p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'border-none bg-surface-container-low hover:bg-surface-container',
                formButtonPrimary:
                  'bg-[#f59e0b] hover:bg-[#d97706] text-[#684000] font-semibold',
                footerActionLink: 'text-[#f59e0b] hover:text-[#d97706]',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
