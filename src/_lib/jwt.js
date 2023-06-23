import { SignJWT, jwtVerify } from 'jose'

export async function genToken(payload) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME)
    .sign(secretKey)
  return token
}

export async function decodeToken(token) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET)
  const { payload } = await jwtVerify(token, secretKey)
  return payload
}