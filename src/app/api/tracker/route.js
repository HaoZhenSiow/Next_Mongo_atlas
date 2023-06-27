import { connectDB, disconnectDB } from "@/_lib/connectDB"
import sessionModel from "@/_models/sessionModel"
import { res } from "@/_lib/utils"

export async function POST(req) {
  await connectDB()

  const { path = '' } = await req.json()
  const ip = req.headers.get('x-forwarded-for')

  let response = ''
  
  try {
    const session = await sessionModel.create({ path, ip })
    response = res(session, 200)
  }
  
  catch (error) {
    response = res(error, 400)
  }

  await disconnectDB()
  return response
}