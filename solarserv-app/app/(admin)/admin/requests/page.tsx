export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import RequestsClient from './RequestsClient'

export default async function AdminRequestsPage() {
  const [requests, technicians] = await Promise.all([
    prisma.serviceRequest.findMany({
      include: {
        user: { select: { name: true, email: true } },
        asset: { select: { panelBrand: true } },
        technician: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.technician.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-extrabold mb-1"
          style={{ color: 'var(--color-primary-container)' }}
        >
          Service Requests
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>
          Manage and track all service requests.
        </p>
      </div>
      <RequestsClient initialRequests={requests as any} technicians={technicians} />
    </div>
  )
}
