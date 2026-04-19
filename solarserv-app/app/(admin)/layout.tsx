import AdminSidebar from '@/components/admin/AdminSidebar'
import { UserButton } from '@clerk/nextjs'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header
          className="fixed top-0 right-0 h-16 flex items-center px-6 gap-4 z-30"
          style={{
            left: '256px',
            background: 'var(--color-surface-container-lowest)',
            boxShadow: '0 1px 0 var(--color-surface-container)',
          }}
        >
          <input
            type="search"
            placeholder="Search..."
            className="flex-1 max-w-xs px-4 py-2 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--color-surface-container-low)',
              color: 'var(--color-on-surface)',
            }}
          />
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              🔔
            </button>
            <UserButton
              appearance={{
                variables: { colorPrimary: '#f59e0b' },
              }}
            />
          </div>
        </header>

        <main className="pt-16 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
