import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"


export async function middleware(request) {
  // verify authentication
  const authorization = request.headers.get('Authorization')
  const ip = request.cookies
  console.log('middleware: ', ip);
  // const { origin, pathname } = request.nextUrl

  // if (!authorization && pathname.startsWith('/')) {
  //   return NextResponse.redirect(`${origin}/login`)
  // }

  // if (authorization && pathname.startsWith('/login')) {
  //   return NextResponse.redirect(`${origin}/`)
  // }
  
  if (!authorization) {
    return NextResponse.json('Authorization Token required', { status: 401 })
  }

  const token = authorization.split(' ')[1]
  
  try {
    await decodeToken(token)
    const response = NextResponse.next()
    return response
  } catch (error) {
    return NextResponse.json('Request is not authorized', { status: 401 })
  }
}

export const config = {
  matcher: ['/api/workouts/']
}