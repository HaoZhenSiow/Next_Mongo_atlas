import connectDB from "@/lib/connectDB"
import { login } from "@/controllers/authController"

connectDB()

export async function POST(req) {
  return await login(req)
}