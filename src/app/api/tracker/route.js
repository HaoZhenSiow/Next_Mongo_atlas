import mongoose from "mongoose"
import connectDB from "@/_lib/connectDB"
import sessionModel from "@/_models/sessionModel"
import { res } from "@/_lib/utils"

connectDB()

export async function POST(req) {
  const body = await req.json()
  const ip = req.headers.get('x-forwarded-for')
  const uid = req.cookies.get('uid')

  if (uid) {
    return await continueSession(uid.value, body)
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
    
    const response = res('created new session', 200)
    response.cookies.set('uid', session.uid)
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}

async function continueSession(uid, body) {
  try {
    const session = await sessionModel.findOne({ uid })
    if (!session) throw new Error('Session not found')

    const prevEvent = session.events.at(-1),
          isPageEvent = prevEvent.event.startsWith('/'),
          isRefreshEvent = prevEvent.event === body.event
    if (isPageEvent && isRefreshEvent) return res('refresh page', 200)
    
    const prevEventDuration = new Date() - prevEvent.createdAt
    prevEvent.duration = prevEventDuration
    session.events.push(body)
    await session.save()

    const response = res('added new event', 200)
    response.cookies.set('uid', session.uid)
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}