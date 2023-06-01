'use server'
import axios from 'axios'
axios.defaults.validateStatus = false

export async function getWorkouts() {
  const { status, data } = await axios.get(process.env.WORKOUT_API)
  return { status, data  }
}