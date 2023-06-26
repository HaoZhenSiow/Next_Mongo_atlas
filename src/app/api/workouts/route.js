import { connectDB, disconnectDB } from "@/_lib/connectDB"
import workoutModel from '@/_models/workoutModel'
import { res, revalidateIndex, isValidId } from '@/_lib/utils'

export async function POST(req) {
  return await handleRequest(req, createWorkout)
}

export async function GET(req) {
  return await handleRequest(req, getWorkouts)
}

export async function DELETE(req) {
  return await handleRequest(req, deleteWorkout)
}

async function handleRequest(req, callback) {
  await connectDB()
  const response = await callback(req)
  await disconnectDB()
  return response
}

async function createWorkout(req) {
  // const { origin } = req.nextUrl
  const payload = await req.json()
 
  try {
    const user_id = req.cookies.get('user').value,
          new_workout = await workoutModel.create({ ...payload, user_id })
    // await revalidateIndex(origin)
    return res(new_workout, 201)
  }

  catch (error) {
    return res('Something went wrong. Please try again.', 500)
  }
}

async function getWorkouts(req) {
  const { searchParams } = req.nextUrl,
        id = searchParams.get('id'),
        user_id = req.cookies.get('user').value

  if (id && id.length > 0 && !isValidId(id)) {
    return res('invalid ID', 400)
  }

  try {
    if (isValidId(id)) {
      const Workout = await workoutModel.find({ _id: id, user_id })
      return Workout ? res(Workout, 200) : res('no such workout', 404)
    }

    const workouts = await workoutModel.find({ user_id }).sort({ createdAt: -1 })
    return res(workouts, 200)
  }
  
  catch (error) {
    return res('Something went wrong. Please try again.', 500)
  }
}

async function deleteWorkout(req) {
  const { origin, searchParams } = req.nextUrl,
        id = searchParams.get('id')

  if (!isValidId(id)) return res('invalid ID', 400)
  
  try {
    const Workout = await workoutModel.findByIdAndDelete(id)
    if (!Workout) return res('no such workout', 404)
    // await revalidateIndex(origin)
    return res(Workout, 200)
  }
  
  catch (error) {
    return res('Something went wrong. Please try again.', 500)
  }
}