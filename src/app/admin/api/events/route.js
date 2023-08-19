import mongoose from "mongoose"
import connectDB from "../../_mongoDB/connectDB"
import { res, genToken, decodeToken, hashIp } from "../../_lib/utils"

const conn = connectDB(),
      sessionModel = conn.model('session')

export async function POST(req) {
  const { referrer, ...body } = await req.json(),
        ip = hashIp(req.headers.get('x-forwarded-for')),
        uidToken = req.cookies.get('uidToken'),
        uid = await decodeCookie(uidToken)

   // Wait until 'conn' is connected (readyState === 1)
  if (conn['_readyState'] === 2) {
    await new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (conn['_readyState'] === 1 || conn['_readyState'] === 0) {
          clearInterval(checkConnection);
          resolve();
        }
      }, 100); // Adjust the interval as needed
    });
  }

  try {
    if (conn['_readyState'] === 0) return res('', 200)

    let session = uid ? await findSession({ uid }) : await findSession({ ip })
    if (!session) { session = await findSession({ ip }) }
    if (!session) return await createSession({ ip, newUser: true, referrer }, body)

    const isSessionExpired = (new Date() - session.updatedAt) > 30 * 60 * 1000
    if (isSessionExpired) return await createSession({ ip, newUser: false, referrer }, body)

    return await continueSession(session, body)
  }
  
  catch (error) {
    return res(error, 400)
  }

}

async function createSession(details, body) {
  try {
    const session = await sessionModel.create({
      uid: new mongoose.Types.ObjectId(),
      ...details,
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

    // when user switch device and same page
    if (isPageEvent && isRefreshEvent && isNotSameDevice) {
      session.events.push({
        ...body,
        event: `${body.device}`
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
  response.cookies.set('uidToken', uidToken, { maxAge: 10 * 365 * 24 * 60 * 60, sameSite: 'strict' })
  return response
}