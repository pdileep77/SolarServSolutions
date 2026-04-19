import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)
  let event: any

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'user.created') {
    const { id: clerkId, email_addresses, first_name, last_name } = event.data
    const email = email_addresses?.[0]?.email_address ?? `${clerkId}@unknown.com`
    const name =
      [first_name, last_name].filter(Boolean).join(' ') || email.split('@')[0]

    try {
      await prisma.user.upsert({
        where: { clerkId },
        create: { clerkId, name, email },
        update: { name, email },
      })
    } catch (err) {
      console.error('Error creating user from webhook:', err)
    }
  }

  return NextResponse.json({ received: true })
}
