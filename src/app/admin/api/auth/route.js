import connectDB from "../../_mongoDB/connectDB";
import bcrypt from "bcrypt"
import { genToken } from "../../_lib/utils";
import { res } from "../../_lib/utils";

const conn = connectDB(),
      adminModel = conn.model('admin')


export async function POST(req) {
  const { request = '', username = '', password = '' } = await req.json()
  
  switch (request) {
    case "login":
      return await login(username, password)
    case "signup":
      return await signup(username, password)
    default:
      return res('Invalid request.', 400)
  }
  
}

async function login(username, password) {
  try {
    const user = await adminModel.findOne({ username })
    if (!user) return res('User not found.', 404)

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res('Password is incorrect.', 400)

    return await loginSuccess(user, username)
  }

  catch (error) {
    return res('Something went wrong, please try again.', 400)
  }

}

async function signup(username, password) {
  const salt = await bcrypt.genSalt(10),
        hashPassword = await bcrypt.hash(password, salt)

  try {
    const existingUser = await adminModel.findOne({ username })
    if (existingUser) return res('User already exist.', 400)

    const user = await adminModel.create({ username, password: hashPassword })
    return response = res({ user }, 200)
  }
  
  catch (error) {
    return res('Something went wrong, please try again.', 500)
  }

}

async function loginSuccess(user, username) {
  const token = await genToken({ id: user._id }),
        response = res({ username, token, id: user.id }, 200)

  response.cookies.set('adminToken', token, { sameSite: 'strict' })
                  .set('admin', user._id, { sameSite: 'strict' })

  return response
}