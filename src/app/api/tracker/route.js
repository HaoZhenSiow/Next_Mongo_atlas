import mongoose from "mongoose"
import connectDB from "@/_lib/connectDB"
import sessionModel from "@/_models/sessionModel"
import { res } from "@/_lib/utils"
import { genToken, decodeToken } from "@/_lib/jwt"

connectDB()

export async function POST(req) {
  const body = await req.json(),
        ip = req.headers.get('x-forwarded-for'),
        uidToken = req.cookies.get('uidToken'),
        uid = await decodeCookie(uidToken)

  try {
    let session = uid ? await sessionModel.findOne({ uid }) : await findSession({ ip })
    if (!session) { session = await findSession({ ip }) }
    if (!session) return await createSession(ip, body)

    const isSessionExpired = (new Date() - session.updatedAt) > 30 * 60 * 1000
    if (isSessionExpired) return await createSession(ip, body)

    return await continueSession(session, body)
  }
  
  catch (error) {
    return res(error, 400)
  }
}

async function createSession(ip, body) {
  try {
    const session = await sessionModel.create({
      uid: new mongoose.Types.ObjectId(),
      ip,
      events: [
        {
          ...body,
          event: `${body.device}`
        },
        body
      ]
    })

    return await returnUIDtoken(session.uid, 'created new event')
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}

async function continueSession(session, body) {
  try {
    const prevEvent = session.events.at(-1),
          isPageEvent = prevEvent.event.startsWith('/'),
          isRefreshEvent = prevEvent.event === body.event,
          isNotSameDevice = prevEvent.device !== body.device

    if (isPageEvent && isRefreshEvent && isNotSameDevice) {
      session.events.push({
        ...body,
        event: `${body.device}`
      })
      await session.save()

      return await returnUIDtoken(session.uid, 'added new event')
    }

    if (isPageEvent && isRefreshEvent) return res('refresh page', 200)
    
    const prevEventDuration = new Date() - prevEvent.createdAt
    prevEvent.duration = prevEventDuration

    if (isNotSameDevice) {
      prevEvent.duration = 0
      session.events.push({
        ...body,
        event: `${body.device}`
      })
    }

    session.events.push(body)
    await session.save()

    return await returnUIDtoken(session.uid, 'added new event')
  }
  
  catch (error) {
    return res(error, 400)
  }
}

async function findSession(query) {
  try {
    return await sessionModel.findOne(query).sort({ updatedAt: -1 })
  }
  
  catch (error) {
    return null
  }
}

async function decodeCookie(uidToken) {
  try {
    const { uid } = uidToken ? await decodeToken(uidToken.value) : { uid: null }
    return uid
  }
  catch {
    return null
  }
}

async function returnUIDtoken(uid, message) {
  const uidToken = await genToken({ uid }, true)
  const response = res(message, 200)
  response.cookies.set('uidToken', uidToken, { maxAge: 10 * 365 * 24 * 60 * 60 })
  return response
}