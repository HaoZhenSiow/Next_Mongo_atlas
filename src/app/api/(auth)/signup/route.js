import connectDB from "@/lib/connectDB"

connectDB()

// login api
export async function POST(req) {
  return new Response('signup api')
}