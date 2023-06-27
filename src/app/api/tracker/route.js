import mongoose from "mongoose"
import connectDB from "@/_lib/connectDB"
import sessionModel from "@/_models/sessionModel"
import { res } from "@/_lib/utils"

connectDB()

export async function POST(req) {
  return await createSession(req)
}

async function createSession(req) {
  const { path = '' } = await req.json()
  const ip = req.headers.get('x-forwarded-for')

  try {
    const session = await sessionModel.create({
      uid: new mongoose.Types.ObjectId(),
      path,
      ip 
    })
    const response = res(session, 200)
    response.cookies.set('uid', session.uid)
    return response
  }
  
  catch (error) {
    return res(error, 400)
  }
  
}