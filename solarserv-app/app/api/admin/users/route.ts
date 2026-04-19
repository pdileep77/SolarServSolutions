import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role
  if (role !== 'admin' && role !== 'operator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    include: {
      _count: { select: { assets: true, serviceRequests: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}
