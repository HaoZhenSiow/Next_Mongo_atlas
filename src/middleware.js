import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"

export async function middleware(request) {
  const protectedApi = ['/api/workouts'],
        protectedPages = ['/'],
        token = request.cookies.get('token'),
        { pathname } = request.nextUrl

  // const protectedAdminPages = ['/admin'],
  //       adminToken = request.cookies.get('adminToken'),
        
  switch (true) {
    case Boolean(protectedApi.includes(pathname) && !token):
      return NextResponse.json('Authorization Token required', { status: 401 })
      
    case Boolean(token):
      return await verifyToken(token, NextResponse, protectedPages, pathname) 

    default:
      return NextResponse.next()
  }  

}

export const config = {
  matcher: ['/', '/login', '/signup', '/api/workouts']
}

async function verifyToken(token, NextResponse, protectedPages, pathname) {
  try {
    const { id } = await decodeToken(token.value)
    const response = NextResponse.next()
    response.cookies.set('user', id, { sameSite: 'strict' })
    return response
  }
  catch (error) {
    const response = protectedPages.includes(pathname)?
                     NextResponse.next():
                     NextResponse.json(`Request is not authorized`, { status: 401 })
    response.cookies.delete('token')
                    .delete('user')
    return response
  }
}