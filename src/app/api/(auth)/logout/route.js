import { logout } from "@/_controllers/authController"

export async function POST(req) {
  return await logout(req)
}