import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role
  if (role !== 'admin' && role !== 'operator') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const technicians = await prisma.technician.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(technicians)
}
