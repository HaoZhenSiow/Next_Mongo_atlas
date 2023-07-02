'use client'
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/_components/WorkoutDetails"

import AuthStore from '@/_stores/authStore'
import WorkoutStore from "@/_stores/workoutStore"

export default function WorkoutList() {
  const { workouts } = WorkoutStore.useStoreState(state => state)
  const { loadWorkouts } = WorkoutStore.useStoreActions(actions => actions)
  const { email } = AuthStore.useStoreState(state => state)
  const { logout } = AuthStore.useStoreActions(actions => actions)

  // fetchWorkouts()

  return (
    <div className="workouts">
      {workouts && workouts.map(workout => (
        <WorkoutDetails workout={workout} key={workout._id} />
      ))}
    </div>
  )

  async function fetchWorkouts() {
    const { status, data } = await axios.get(process.env.NEXT_PUBLIC_WORKOUT_API)
    status === 200 && loadWorkouts(data)
  }
}