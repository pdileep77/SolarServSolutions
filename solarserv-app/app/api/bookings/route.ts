import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireUser()
    const requests = await prisma.serviceRequest.findMany({
      where: { userId: user.id },
      include: { asset: true, technician: true },
      orderBy: { requestedDatetime: 'desc' },
    })
    return NextResponse.json(requests)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser()
    const body = await req.json()
    const { serviceType, assetId, requestedDatetime, notes } = body

    if (!serviceType || !assetId || !requestedDatetime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify asset belongs to user
    const asset = await prisma.solarAsset.findFirst({
      where: { id: assetId, userId: user.id },
    })
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId: user.id,
        assetId,
        serviceType,
        requestedDatetime: new Date(requestedDatetime),
        notes: notes || null,
        status: 'Scheduled',
      },
    })

    // Create booking confirmation notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'booking_confirm',
        message: `Your ${serviceType} service has been scheduled for ${new Date(requestedDatetime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`,
      },
    })

    return NextResponse.json(serviceRequest, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/bookings error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
