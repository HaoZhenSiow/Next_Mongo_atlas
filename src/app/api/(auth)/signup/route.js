import connectDB from "@/_lib/connectDB"
import { signup } from "@/_controllers/authController"

connectDB()

export async function POST(req) {
  return await signup(req)
}