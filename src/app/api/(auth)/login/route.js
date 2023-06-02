import connectDB from "@/_lib/connectDB"
import { login } from "@/_controllers/authController"

connectDB()

export async function POST(req) {
  return await login(req)
}