import { NextRequest, NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"
import { jwtVerify } from "jose"


export async function middleware(request) {

  const token = request.cookies.get('token') ? request.cookies.get('token') : null
  const { origin, pathname } = request.nextUrl

  // let response = NextResponse.next()

  if (!token && pathname === '/') {
    return NextResponse.redirect(`${origin}/login`)
  }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(`${origin}/`)
  }

  if (!token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.next()
  }
  
  if (!token && pathname.startsWith('/api/workouts')) {
    return NextResponse.json('Authorization Token required', { status: 401 })
  }

  if (token && pathname.startsWith('/api/workouts')) {
    try {
      // const encoder = new TextEncoder();
      // const secretKey = encoder.encode('e7e6e28ebe6571598cca056b963e207582ed9239')
      // await jwtVerify(token.value, secretKey)
      await decodeToken(token.value)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(`Request is not authorized`, { status: 401 })
    }
  }

  // if (!request.cookies.get('ip')) {
  //   const ip = request.headers.get('x-forwarded-for')
  //   response.cookies.set('ip', ip)
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/signup', '/api/workouts']
}