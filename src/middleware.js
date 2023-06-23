import { NextRequest, NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"


export async function middleware(request) {
  console.log(request.cookies.get('ip'));

  const token = request.cookies.get('token') ? request.cookies.get('token') : null
  const { origin, pathname } = request.nextUrl
  
  let response = NextResponse.next()

  if (!token && pathname === '/') {
    response = NextResponse.redirect(`${origin}/login`)
  }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    response = NextResponse.redirect(`${origin}/`)
  }
  
  if (!token && pathname.startsWith('/api/workouts')) {
    response = NextResponse.json('Authorization Token required', { status: 401 })
  }

  if (token && pathname.startsWith('/api/workouts')) {
    try {
      await decodeToken(token.value)
      response = NextResponse.next()
    } catch (error) {
      response = NextResponse.json('Request is not authorized', { status: 401 })
    }
  }

  if (!request.cookies.get('ip')) {
    const ip = request.headers.get('x-forwarded-for')
    response.cookies.set('ip', ip)
  }

  return response
}

export const config = {
  matcher: ['/', '/login', '/signup', '/api/workouts']
}