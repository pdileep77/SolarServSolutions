import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // Lazy-create on first login if webhook hasn't fired yet
  if (!user) {
    const clerkUser = await currentUser()
    if (!clerkUser) return null

    const email =
      clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@unknown.com`
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      email.split('@')[0]

    try {
      user = await prisma.user.upsert({
        where: { clerkId: userId },
        create: { clerkId: userId, name, email },
        update: { name, email },
      })
    } catch {
      // Concurrent request already created the row — just fetch it
      user = await prisma.user.findUnique({ where: { clerkId: userId } })
    }
  }

  return user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}
