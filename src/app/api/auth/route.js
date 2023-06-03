import bcrypt from "bcrypt"
import { NextResponse } from "next/server";
import connectDB from "@/_lib/connectDB"
import { genToken } from "@/_lib/jwt";
import { res } from "@/_lib/utils";
import userModel from "@/_models/userModel";


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
    const token = await genToken({ id: user._id })
    const response = NextResponse.json({ email, token }, { status: 200 })
    response.cookies.set('token', token)
    response.cookies.set('user', user._id)
    return response
  } catch (error) {
    return res('Something went wrong, please try again.', 400)
  }
}

async function signup(email, password) {
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    const exist = await userModel.findOne({ email })
    if (exist) return res('User already exist.', 400)
    const user = await userModel.create({ email, password: hashPassword })
    const token = await genToken({ id: user._id })
    const response = NextResponse.json({ email, token }, { status: 200 })
    response.cookies.set('token', token)
    response.cookies.set('user', user._id)
    return response
  } catch (error) {
    return res('Something went wrong, please try again.', 500)
  }
}

async function logout() {
  const response = NextResponse.json('logout success', { status: 200 })
  response.cookies.delete('token')
  response.cookies.delete('user')
  return response
}