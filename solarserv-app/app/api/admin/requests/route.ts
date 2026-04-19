import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

async function checkAdmin() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as any)?.role
  return role === 'admin' || role === 'operator'
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  const where: any = {}
  if (status) where.status = status
  if (type) where.serviceType = type

  const requests = await prisma.serviceRequest.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      asset: { select: { panelBrand: true } },
      technician: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(requests)
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { id, status, assignedTechnicianId } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const data: any = {}
  if (status) data.status = status
  if (assignedTechnicianId !== undefined)
    data.assignedTechnicianId = assignedTechnicianId || null

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data,
    include: { technician: true },
  })

  return NextResponse.json(updated)
}
