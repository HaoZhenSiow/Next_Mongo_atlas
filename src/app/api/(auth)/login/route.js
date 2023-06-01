import connectDB from "@/lib/connectDB"
import workoutModel from "@/models/workoutModel"

connectDB()

// login api
export async function POST(req) {
  const workout = await workoutModel.findOne()
  const workoutId = workout.json()
  const val = workoutId.valueOf()
  return new Response(JSON.stringify(workoutId))
}