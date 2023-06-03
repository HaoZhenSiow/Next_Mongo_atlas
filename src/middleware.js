import { NextResponse } from "next/server"
import { decodeToken } from "./_lib/jwt"


export async function middleware(request) {
  // verify authentication
  const authorization = request.headers.get('Authorization')
  const { origin, pathname } = request.nextUrl

  // if (!authorization && pathname.startsWith('/')) {
  //   return NextResponse.redirect(`${origin}/login`)
  // }
  
  if (!authorization) {
    return NextResponse.json('Authorization Token required', { status: 401 })
  }

  const token = authorization.split(' ')[1]
  
  try {
    const { id } = await decodeToken(token)
    console.log(id);
    const response = NextResponse.next()
    response.cookies.set('id', id)
    return response
  } catch (error) {
    return NextResponse.json('Request is not authorized', { status: 401 })
  }
}

export const config = {
  matcher: ['/api/test/']
}