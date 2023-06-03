import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"


export async function middleware(request) {
  // verify authentication
  const token = request.cookies.get('token') ? request.cookies.get('token') : null
  
  const { origin, pathname } = request.nextUrl

  if (!token && pathname === '/') {
    return NextResponse.redirect(`${origin}/login`)
  }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(`${origin}/`)
  }
  
  // if (!authorization) {
  //   return NextResponse.json('Authorization Token required', { status: 401 })
  // }

  
  // try {
  //   await decodeToken(token)
  //   const response = NextResponse.next()
  //   return response
  // } catch (error) {
  //   return NextResponse.json('Request is not authorized', { status: 401 })
  // }
}

export const config = {
  matcher: ['/', '/login', '/signup']
}