import mongoose from "mongoose"
import connectDB from "../../_mongoDB/connectDB"
import { res, genToken, decodeToken, getHashIp } from "../../_lib/utils"

const conn = connectDB(),
      sessionModel = conn.model('session')

export async function POST(req) {
  const referer = req.headers.referer || '';
  const url = new URL(referer);
  const { referrer, ...eventDetails } = await req.json(),
        ip = getHashIp(req),
        uidToken = req.cookies.get('uidToken'),
        uid = await decodeCookie(uidToken)

  await waitForConnection()
  
  if (conn['_readyState'] === 0) return res('', 200)

  try {
    let session = uid ? await findSession({ uid }) : await findSession({ ip })
    if (!session) { session = await findSession({ ip }) }
    if (!session) return await createSession({ ip, newUser: true, referrer: url }, eventDetails)

    const sessionIsExpired = (new Date() - session.updatedAt) > 30 * 60 * 1000
    if (sessionIsExpired) return await createSession({ ip, newUser: false, referrer: url }, eventDetails)

    return await continueSession(session, eventDetails)
  }
  
  catch (error) {
    return res(error, 400)
  }

}

async function createSession(details, eventDetails) {
  try {
    const session = await sessionModel.create({
      uid: new mongoose.Types.ObjectId(),
      ...details,
      events: [
        {
          ...eventDetails,
          event: `${eventDetails.device}`
        },
        eventDetails
      ]
    })

    return await returnUIDtoken(session.uid, 'created new session')
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}

async function continueSession(session, eventDetails) {
  try {
    const prevEvent = session.events.at(-1),
          isPageEvent = prevEvent.event.startsWith('/'),
          isRefreshEvent = prevEvent.event === eventDetails.event,
          isNotSameDevice = prevEvent.device !== eventDetails.device

    // when user switch device and same page
    if (isPageEvent && isRefreshEvent && isNotSameDevice) {
      session.events.push({
        ...eventDetails,
        event: `${eventDetails.device}`
      })
      await session.save()

      return await returnUIDtoken(session.uid, 'added new event')
    }

    // do nothing when user refresh page
    if (isPageEvent && isRefreshEvent) return res('refresh page', 200)
    
    const prevEventDuration = new Date() - prevEvent.createdAt
    prevEvent.duration = prevEventDuration

    if (isNotSameDevice) {
      prevEvent.duration = 0
      session.events.push({
        ...eventDetails,
        event: `${eventDetails.device}`
      })
    }

    session.events.push(eventDetails)
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
  response.cookies.set('uidToken', uidToken, { maxAge: 10 * 365 * 24 * 60 * 60, sameSite: 'strict' })
  return response
}

async function waitForConnection() {
  // 0 = disconnected, 1 = connected, 2 = connecting
  if (conn['_readyState'] === 2) {
    await new Promise((resolve) => {
      const checkConnectionStatus = setInterval(() => {
        if (conn['_readyState'] === 1 || conn['_readyState'] === 0) {
          clearInterval(checkConnectionStatus)
          resolve()
        }
      }, 100) // Adjust the interval as needed
    })
  }
}