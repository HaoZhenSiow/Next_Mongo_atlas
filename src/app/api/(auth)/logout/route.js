import { logout } from "@/_controllers/authController"

export async function GET(req) {
  return await logout(req)
}