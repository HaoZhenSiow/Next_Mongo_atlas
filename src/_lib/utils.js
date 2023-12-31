import mongoose from 'mongoose'
import { NextResponse } from 'next/server'
import axios from 'axios'
axios.defaults.validateStatus = false

export function res(res, status) {
  return NextResponse.json(res, { status: status })
}

export async function revalidateIndex(origin) {
  await axios.get(`${origin}/api/revalidate?path=/&secret=${process.env.REVALIDATE_SECRET}`)
}

export function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}