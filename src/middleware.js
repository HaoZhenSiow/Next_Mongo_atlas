import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"


export async function middleware(request) {

  const token = request.cookies.get('token') ? request.cookies.get('token') : null
  const { pathname } = request.nextUrl

  const protectedApi = ['/api/workouts']

  let response = ''

  switch (true) {
    case Boolean(protectedApi.includes(pathname) && !token):
      response = NextResponse.json('Authorization Token required', { status: 401 })
      break
    case Boolean(protectedApi.includes(pathname) && token):
      try {
        const { id } = await decodeToken(token.value)
        response = NextResponse.next()
        response.cookies.set('user', id)
      } catch (error) {
        response = NextResponse.json(`Request is not authorized`, { status: 401 })
      }
      break
    default:
      response = NextResponse.next()
  }  

  // if (!request.cookies.get('ip')) {
  //   const ip = request.headers.get('x-forwarded-for')
  //   response.cookies.set('ip', ip)
  // }

  return response
}

export const config = {
  matcher: ['/api/workouts']
}