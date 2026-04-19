import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireUser()
    const assets = await prisma.solarAsset.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(assets)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser()
    const body = await req.json()

    const { panelBrand, capacityKw, panelCount, installDate, lat, lng, propertyZone, photoUrl, assetType } =
      body

    if (!panelBrand || !capacityKw || !panelCount || !installDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validAssetTypes = ['Residential', 'Commercial', 'Agriculture']
    const resolvedAssetType = validAssetTypes.includes(assetType) ? assetType : 'Residential'

    const asset = await prisma.solarAsset.create({
      data: {
        userId: user.id,
        panelBrand,
        capacityKw: Number(capacityKw),
        panelCount: Number(panelCount),
        installDate: new Date(installDate),
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        propertyZone: propertyZone || null,
        photoUrl: photoUrl || null,
        assetType: resolvedAssetType,
      },
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/assets error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
