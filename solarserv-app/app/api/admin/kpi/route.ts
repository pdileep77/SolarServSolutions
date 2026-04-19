import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role
  if (role !== 'admin' && role !== 'operator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [totalUsers, totalAssets, openRequests, completedThisMonth] = await Promise.all([
    prisma.user.count(),
    prisma.solarAsset.count(),
    prisma.serviceRequest.count({
      where: { status: { in: ['Scheduled', 'InProgress'] } },
    }),
    prisma.serviceRequest.count({
      where: {
        status: 'Completed',
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ])

  return NextResponse.json({ totalUsers, totalAssets, openRequests, completedThisMonth })
}
