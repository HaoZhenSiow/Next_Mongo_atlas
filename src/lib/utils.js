import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import axios from 'axios'
axios.defaults.validateStatus = false

export function res(res, status) {
  const data = typeof res === 'object' ? JSON.stringify(res) : res
  return new Response(data, { status: status })
}

export async function revalidateIndex(origin) {
  await axios.get(`${origin}/api/revalidate?path=/&secret=${process.env.REVALIDATE_SECRET}`)
}

export function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

export function genToken(payload) {
  return jwt.sign(payload, process.env.JWTKEY, { expiresIn: '3d' })
}

export function decodeToken(token) {
  return jwt.verify(token, process.env.JWTKEY)
}