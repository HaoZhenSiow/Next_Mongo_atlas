import bcrypt from "bcrypt"
import { genToken } from "@/_lib/jwt";

import userModel from "@/_models/userModel";
import { res } from "@/_lib/utils";

export async function login(req) {
  const { email, password } = await req.json()
  try {
    const user = await userModel.findOne({ email })
    if (!user) return res('User not found.', 404)
    if (!await bcrypt.compare(password, user.password)) {return res('Password is incorrect.', 400)}
    const token = await genToken({ id: user._id })
    return res({ email, token }, 200)
  } catch (error) {
    return res('Something went wrong, please try again.', 400)
  }
}

export async function signup(req) {
  const { email, password } = await req.json()
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    const exist = await userModel.findOne({ email })
    if (exist) return res('User already exist.', 400)
    const user = await userModel.create({ email, password: hashPassword })
    const token = await genToken({ id: user._id })
    return res({ email, token }, 200)
  } catch (error) {
    return res('Something went wrong, please try again.', 500)
  }
}