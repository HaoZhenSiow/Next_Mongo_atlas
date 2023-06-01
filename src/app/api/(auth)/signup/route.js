import connectDB from "@/lib/connectDB"
import { signup } from "@/controllers/authController"

connectDB()

export async function POST(req) {
  return await signup(req)
}