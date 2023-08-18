import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

export async function genToken(payload, noExpire = false) {
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

export async function decodeToken(token) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.ADMIN_JWT_SECRET)
  const { payload } = await jwtVerify(token, secretKey)
  return payload
}

export function res(res, status) {
  return NextResponse.json(res, { status: status })
}

export function newDate(date = null) {
  if (!date) return new Date().toDateString()
  return new Date(date).toDateString()
}

export function getMedium(map) {
  const valArr = Array.from(map.values()),
        highest = Math.max(...valArr),
        newHighest = highest % 2 ? highest + 1 : highest,
        sum = valArr.reduce((acc, value) => acc + value, 0),
        average = sum / valArr.length,
        digit = Math.trunc(average).toString().length - 1 || 1,
        nearest = 10 ** digit

  let medium = average > 9 ? Math.floor(average / nearest) * nearest : 10,
      unit = ''

  if (medium * 2 < newHighest) {
    medium = Math.ceil((newHighest/2) / nearest) * nearest
  }

  switch (true) {
    case (medium/2 >= 1000000):
      unit = 'M'
      medium /= 1000000
      break
    case (medium/2 >= 1000):
      unit = 'K'
      medium /= 1000
      break
  }
  return { medium, unit }
}

export function createDateArr(period) {
  const dateArr = []
  let diff,
      endDate = new Date()
  
  if (period === 'Last 28 days') {
    diff = 27;
  } else if (period === 'Last 90 days') {
    diff = 89;
  } else if (period === 'Last 12 months') {
    diff = 364;
  } else if (period.startDate) {
    endDate = period.endDate;
    diff = (endDate - period.startDate) / (1000 * 60 * 60 * 24)
  } else {
    diff = 6;
  }

  for (let i = diff; i >= 0; i--) {
    const fullDate = new Date(endDate - i * 24 * 60 * 60 * 1000),
          day = String(fullDate.getDate()).padStart(2, '0'),
          month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(fullDate)
    let showdate = false
  
    if (diff < 7) {
      showdate = true;
    } else if (diff < 14) {
      showdate = i % 2 === 0;
    } else if (diff < 59) {
      showdate = i % 7 === 0;
    } else {
      showdate = fullDate.getDate() === 1;
    }

    dateArr.push({ fullDate, day, month, showdate })
  }
  
  return dateArr
}