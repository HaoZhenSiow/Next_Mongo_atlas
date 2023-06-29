import mongoose from "mongoose"
import connectDB from "@/_lib/connectDB"
import sessionModel from "@/_models/sessionModel"
import { res } from "@/_lib/utils"
import { genToken, decodeToken } from "@/_lib/jwt"

connectDB()

export async function POST(req) {
  const body = await req.json()
  const ip = req.headers.get('x-forwarded-for')
  const uidToken = req.cookies.get('uidToken')
  const { uid } = uidToken ? await decodeToken(uidToken.value) : { uid: null }
  
  if (uid) {
    return await continueSessionWithUID(uid, ip, body)
  }
  return await createSession(ip, body)
}

async function createSession(ip, body) {
  try {
    const session = await sessionModel.create({
      uid: new mongoose.Types.ObjectId(),
      ip,
      events: [body]
    })
    
    const uidToken = await genToken({ uid: session.uid }, true)
    const response = res('created new session', 200)
    response.cookies.set('uidToken', uidToken, { maxAge: 10 * 365 * 24 * 60 * 60 })
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}

async function continueSession(session, body) {
  try {
    const prevEvent = session.events.at(-1),
          isPageEvent = prevEvent.event.startsWith('/'),
          isRefreshEvent = prevEvent.event === body.event
    if (isPageEvent && isRefreshEvent) return res('refresh page', 200)
    
    const prevEventDuration = new Date() - prevEvent.createdAt
    prevEvent.duration = prevEventDuration
    session.events.push(body)
    await session.save()

    const uidToken = await genToken({ uid: session.uid }, true)
    const response = res('added new event', 200)
    response.cookies.set('uidToken', uidToken, { maxAge: 10 * 365 * 24 * 60 * 60 })
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
}

async function continueSessionWithUID(uid, ip, body) {
  try {
    const session = await sessionModel.findOne({ uid })
    if (!session) return await createSession(ip, body)
    return await continueSession(session, body)
  }
  
  catch (error) {
    return res(error, 400)
  }
}