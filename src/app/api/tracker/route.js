import mongoose from "mongoose"
import connectDB from "@/_lib/connectDB"
import sessionModel from "@/_models/sessionModel"
import { res } from "@/_lib/utils"

connectDB()

export async function POST(req) {
  const { path = '' } = await req.json()
  const ip = req.headers.get('x-forwarded-for')
  const uid = req.cookies.get('uid')

  // if (uid) {
  //   return await continueSession(path, ip, uid.value)
  // }
  // console.log(uid);
  // return res('done', 200)
  return await createSession(path, ip)
}

async function createSession(path, ip) {
  try {
    const session = await sessionModel.create({
      uid: new mongoose.Types.ObjectId(),
      ip,
      path: [{
        event: path,
        duration: 0
      }]
    })
    
    const response = res('created new session', 200)
    response.cookies.set('uid', session.uid)
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}

async function continueSession(path, ip, uid) {
  try {
    const session = await sessionModel.findOne({ uid })
    if (!session) throw new Error('Session not found')

    const prevEvent = session.path.at(-1)
    if (prevEvent.event.startsWith('/') && prevEvent.event === path) {
      return res(session, 200)
    }
    
    const prevEventDuration = new Date() - prevEvent.createdAt
    const newEvent = {
      event: path,
      duration: 0
    }

    prevEvent.duration = prevEventDuration
    session.path.push(newEvent)
    await session.save()

    const response = res(session, 200)
    response.cookies.set('uid', session.uid)
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}