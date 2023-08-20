import mongoose from "mongoose"
import connectDB from "../../_mongoDB/connectDB"
import { res, genToken, decodeToken, getHashIp } from "../../_lib/utils"
import chalk from "chalk"

const conn = connectDB(),
      sessionModel = conn.model('session')

export async function POST(req) {
  const { referrer, ...eventDetails } = await req.json(),
        ip = process.env.DEV_MODE ? 'dev mode' : getHashIp(req),
        uid = await getUID(req)

  const sessionDetails = {
    ip,
    newUser: false,
    referrer,
    devices: {
      [eventDetails.device]: {
        browser: eventDetails.browser,
        resolution: eventDetails.resolution
      }
    }
  }

  await waitForConnection()
  
  if (conn['_readyState'] === 0) return res('', 200)

  try {
    let session = await findSession({ uid }) || await findSession({ ip })

    if (!session) {
      return await createSession({ 
        ...sessionDetails,
        newUser: true
      }, eventDetails)
    }

    const sessionIsExpired = (new Date() - session.updatedAt) > 30 * 60 * 1000
    if (sessionIsExpired) {
      return await createSession({
        ...sessionDetails,
        uid: session.uid,
      }, eventDetails)
    }

    return await continueSession(session, eventDetails)
  }
  
  catch (error) {
    return res(error, 400)
  }

}

async function createSession(sessionDetails, eventDetails) {
  try {
    const session = await sessionModel.create({
      ...sessionDetails,
      uid: sessionDetails.newUser ? new mongoose.Types.ObjectId() : sessionDetails.uid,
      events: [eventDetails]
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
          isSameEvent = prevEvent.event === eventDetails.event,
          isSameDevice = prevEvent.device === eventDetails.device,
          isPageRefresh = isPageEvent && isSameEvent && isSameDevice,
          isNotSameDevice = prevEvent.device !== eventDetails.device

    // do nothing when user refresh page
    if (isPageRefresh) return res('refresh page', 200)
    
    const prevEventDuration = new Date() - prevEvent.createdAt
    prevEvent.duration = prevEventDuration

    // when user switch device
    if (isNotSameDevice) {
      session.devices.set(eventDetails.device, {
        browser: eventDetails.browser,
        resolution: eventDetails.resolution
      })
      session.events.push({
        ...eventDetails,
        type: 'switch device',
        event: `from ${prevEvent.device} to ${eventDetails.device}`
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

async function getUID(req) {
  const uidToken = req.cookies.get('uidToken')
  return  await decodeCookie(uidToken)
}