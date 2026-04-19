import HomeNav from '@/components/homeowner/HomeNav'

export default function HomeownerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <HomeNav />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  )
}
