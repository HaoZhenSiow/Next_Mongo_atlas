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

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}