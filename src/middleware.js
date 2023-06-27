import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"

export async function middleware(request) {
  const protectedApi = ['/api/workouts']

  const token = request.cookies.get('token') ? request.cookies.get('token') : null
  const { pathname } = request.nextUrl

  switch (true) {
    case Boolean(protectedApi.includes(pathname) && !token):
      return NextResponse.json('Authorization Token required', { status: 401 })
      
    case Boolean(protectedApi.includes(pathname) && token):
      try {
        const { id } = await decodeToken(token.value)
        const response = NextResponse.next()
        response.cookies.set('user', id)
        return response
      }
      catch (error) {
        return NextResponse.json(`Request is not authorized`, { status: 401 })
      }
      
    default:
      return NextResponse.next()
  }  

}

export const config = {
  matcher: ['/api/workouts']
}