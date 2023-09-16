'use client'
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/_components/WorkoutDetails"

import AuthStore from '@/_stateManagement/stores/authStore'
import WorkoutStore from "@/_stateManagement/stores/workoutStore"
import { useEffect } from "react"

export default function WorkoutList() {
  const { workouts } = WorkoutStore.useStoreState(state => state)
  const { loadWorkouts } = WorkoutStore.useStoreActions(actions => actions)
  const { logout } = AuthStore.useStoreActions(actions => actions)

  useEffect (() => {
    fetchWorkouts()
  }, [loadWorkouts])
  

  return (
    <div className="workouts">
      {workouts && workouts.map(workout => (
        <WorkoutDetails workout={workout} key={workout._id} />
      ))}
    </div>
  )

  async function fetchWorkouts() {
    const { status, data } = await axios.get(process.env.NEXT_PUBLIC_WORKOUT_API)
    switch (status) {
      case 200:
        loadWorkouts(data)
        break
      case 401:
        alert('You token are unauthorized, please log in again')
        logout()
    }
    status === 200 && loadWorkouts(data)
  }
}