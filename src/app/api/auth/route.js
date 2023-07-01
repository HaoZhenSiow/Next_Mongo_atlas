import connectDB from "@/_lib/connectDB"
import userModel from "@/_models/userModel";
import bcrypt from "bcrypt"
import { genToken } from "@/_lib/jwt";
import { res } from "@/_lib/utils";

connectDB()

export async function POST(req) {
  const { request = '', email = '', password = '' } = await req.json()
  
  switch (request) {
    case "login":
      return await login(email, password)
    case "signup":
      return await signup(email, password)
    case "logout":
      return await logout()
    default:
      return res('Invalid request.', 400)
  }

}

async function login(email, password) {
  try {
    const user = await userModel.findOne({ email })
    if (!user) return res('User not found.', 404)

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res('Password is incorrect.', 400)

    return await loginSuccess(user, email)
  }

  catch (error) {
    return res('Something went wrong, please try again.', 400)
  }
}

async function signup(email, password) {
  const salt = await bcrypt.genSalt(10),
        hashPassword = await bcrypt.hash(password, salt)

  try {
    const existingUser = await userModel.findOne({ email })
    if (existingUser) return res('User already exist.', 400)

    const user = await userModel.create({ email, password: hashPassword })
    return loginSuccess(user, email)
  }
  
  catch (error) {
    return res('Something went wrong, please try again.', 500)
  }
}

async function logout() {
  const response = res('logout success', 200)

  response.cookies.delete('token')
                  .delete('user')

  return response
}

async function loginSuccess(user, email) {
  const token = await genToken({ id: user._id }),
        response = res({ email, token }, 200)

  response.cookies.set('token', token)
                  .set('user', user._id)

  return response
}