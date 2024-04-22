import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const authorizedRoutes = ['settings', 'upload']
const unauthorizedRoutes = ['login', 'registration']


export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const username = request.cookies.get('username')
  const authorized = token && username
  const path = request.nextUrl.pathname
  const redirectHome = NextResponse.redirect(new URL('/', request.url))

  if (authorized) {
    for (const r of unauthorizedRoutes) {
      if (path.startsWith(`/${r}`)) return redirectHome
    }
  } else {
    for (const r of authorizedRoutes) {
      if (path.startsWith(`/${r}`)) return redirectHome
    }
  }

  return NextResponse.next()
}