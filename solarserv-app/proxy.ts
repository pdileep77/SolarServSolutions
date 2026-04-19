import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

const isDashboardRoute = createRouteMatcher(['/dashboard'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  const { userId } = await auth()

  if (userId) {
    // Fetch live user metadata — session claims don't include publicMetadata by default
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    const role = (clerkUser.publicMetadata as any)?.role

    // Redirect admin/operator away from homeowner dashboard to admin dashboard
    if (isDashboardRoute(req) && (role === 'admin' || role === 'operator')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Guard admin routes from non-admin users
    if (isAdminRoute(req) && role !== 'admin' && role !== 'operator') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
