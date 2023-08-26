import { NextResponse } from "next/server"
import { genToken, decodeToken } from "./_lib/jwt"

const protectedApi = ['/api/workouts'],
      protectedPages = ['/']

export async function middleware(request) {
  const token = request.cookies.get('token'),
        tokenA = request.cookies.get('tokenA'),
        tokenB = request.cookies.get('tokenB'),
        { pathname } = request.nextUrl

  // const protectedAdminPages = ['/admin'],
  //       adminToken = request.cookies.get('adminToken'),

  switch (true) {
    case Boolean(pathname === '/about'):
      if (tokenA) return await verifyABcookie(tokenA, 'tokenASecret')
      if (tokenB) return await verifyABcookie(tokenB, 'tokenBSecret')
      return await createABcookie()
    
    case Boolean(protectedApi.includes(pathname) && !token):
      return NextResponse.json('Authorization Token required', { status: 401 })
      
    case Boolean(token):
      return await verifyToken(token, pathname) 

    default:
      return NextResponse.next()
  }  

}

export const config = {
  matcher: ['/', '/about', '/login', '/signup', '/api/workouts']
}

async function verifyToken(token, pathname) {
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

async function createABcookie() {
  const response = NextResponse.next(),
        cookieOptions = { sameSite: 'strict', maxAge: 365 * 24 * 60 * 60 * 1000 },
        AorB = Math.random() > 0.5 ? true : false,
        ABtoken = await genToken({ AorB: AorB?'tokenASecret':'tokenBSecret' }, true)

  response.cookies.delete('tokenA')
  response.cookies.delete('tokenB')

  AorB ? response.cookies.set('tokenA', ABtoken, cookieOptions) : response.cookies.set('tokenB', ABtoken, cookieOptions) 
  return response
}

async function verifyABcookie(token, secret) {
  try {
    const { AorB } = await decodeToken(token.value)
    return AorB === secret ? NextResponse.next() : await createABcookie()
  }
  
  catch {
    return await createABcookie()
  }
}