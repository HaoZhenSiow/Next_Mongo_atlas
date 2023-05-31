import workout from '../models/workout'
import { res, revalidateIndex, isValidId } from '@/lib/utils'

export async function createWorkout(req) {
  const { origin } = new URL(req.url)
  const payload = await req.json()
  const { title, load, reps } = payload
  const emptyFields = []

  if (!title) { emptyFields.push('title') }
  if (!load) { emptyFields.push('load') }
  if (!reps) { emptyFields.push('reps') }

  if (emptyFields.length > 0) {
    return res({ error: 'Please fill in all fields', emptyFields }, 400)
  }

  try {
    const new_workout = await workout.create(payload)
    await revalidateIndex(origin)
    return res(new_workout, 201)
  } catch (error) {
    return res({ error: 'Something went wrong. Please try again.' }, 500)
  }
}

export async function getWorkouts(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id && id.length > 0 && !isValidId(id)) {
    return res('invalid ID', 400)
  }
  try {
    if (isValidId(id)) {
      const Workout = await workout.findById(id)
      return Workout ? res(Workout, 200) : res('no such workout', 404)
    }
    const workouts = await workout.find().sort({ createdAt: -1 })
    return res(workouts, 200)
  } catch (error) {
    return res('Something went wrong. Please try again.', 500)
  }
}

export async function deleteWorkout(req) {
  const { origin, searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!isValidId(id)) {
    return res('invalid ID', 400)
  }
  try {
    const Workout = await workout.findByIdAndDelete(id)
    if (!Workout) return res('no such workout', 404)
    await revalidateIndex(origin)
    return res(Workout, 200)
  } catch (error) {
    return res('Something went wrong. Please try again.', 500)
  }
}

// async function updateWorkout(req, res) {
//   const { id } = req.params
//   if (isValidId(id)) return res.status(400).send('invalid ID')

//   try {
//     const workout = await Workout.findByIdAndUpdate(id, { ...req.body })
//     workout ? res.status(200).end() : res.status(404).send('no such workout')
//   } catch (error) {
//     res.status(500).send('Something went wrong. Please try again.')
//   }
// }