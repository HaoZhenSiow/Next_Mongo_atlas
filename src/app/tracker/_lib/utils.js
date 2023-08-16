import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

export async function genToken(payload, noExpire = false) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET);
  let token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME)
    .sign(secretKey)

  if (noExpire) {
    token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secretKey)
  }
  
  return token
}

export async function decodeToken(token) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET)
  const { payload } = await jwtVerify(token, secretKey)
  return payload
}

export function res(res, status) {
  return NextResponse.json(res, { status: status })
}

export function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}