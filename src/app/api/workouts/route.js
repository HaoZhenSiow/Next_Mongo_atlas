import connectDB from "@/_lib/connectDB"
import { createWorkout, getWorkouts, deleteWorkout } from "@/_controllers/workoutController"

connectDB()

export async function POST(req) {
  return await createWorkout(req)
}

export async function GET(req) {
  return await getWorkouts(req)
}

export async function DELETE(req) {
  return await deleteWorkout(req)
}