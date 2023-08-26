import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import CryptoJS from 'crypto-js';

export {
  genToken,
  decodeToken,
  res,
  getHashIp,
  str
}

async function genToken(payload, noExpire = false) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.ADMIN_JWT_SECRET);
  let token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.ADMIN_JWT_EXPIRATION_TIME)
    .sign(secretKey)

  if (noExpire) {
    token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secretKey)
  }
  
  return token
}

async function decodeToken(token) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.ADMIN_JWT_SECRET)
  const { payload } = await jwtVerify(token, secretKey)
  return payload
}

function res(res, status) {
  return NextResponse.json(res, { status: status })
}

function getHashIp(req) {
  const ip = req.headers.get('x-forwarded-for')
  const key = process.env.IP_SECRET
  const hash = CryptoJS.HmacSHA256(ip, key)
  return hash.toString(CryptoJS.enc.Hex)
}

function str(date) {
  return new Date(date).toDateString()
}