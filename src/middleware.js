import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"

export async function middleware(request) {
  const protectedApi = ['/api/workouts']
  const protectedPages = ['/']

  const token = request.cookies.get('token') ? request.cookies.get('token') : null
  const { origin, pathname } = request.nextUrl

  switch (true) {
    case Boolean(protectedApi.includes(pathname) && !token):
      return NextResponse.json('Authorization Token required', { status: 401 })
      
    case Boolean((protectedApi.includes(pathname) || protectedPages.includes(pathname)) && token):
      try {
        const { id } = await decodeToken(token.value)
        const response = NextResponse.next()
        response.cookies.set('user', id)
        return response
      }
      catch (error) {
        if (protectedApi.includes(pathname)) {
          return NextResponse.json(`Request is not authorized`, { status: 401 })
        }
        return NextResponse.redirect(new URL('/login', origin))
      }

    case Boolean(protectedPages.includes(pathname) && !token):
      return NextResponse.redirect(new URL('/login', origin))

    default:
      return NextResponse.next()
  }  

}

export const config = {
  matcher: ['/', '/api/workouts']
}