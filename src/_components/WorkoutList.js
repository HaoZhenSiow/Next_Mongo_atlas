'use client'
import { useEffect } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from '@/_stores/authStore'
import WorkoutDetails from "@/_components/WorkoutDetails"

import WorkoutStore from "@/_stores/workoutStore"

export default function WorkoutList(props) {
  const { workouts } = WorkoutStore.useStoreState(state => state)
  const { loadWorkouts } = WorkoutStore.useStoreActions(actions => actions)
  const { logout } = AuthStore.useStoreActions(actions => actions)

  useEffect(() => {
    async function fetchWorkouts() {
      const { status, data } = await axios.get(process.env.NEXT_PUBLIC_WORKOUT_API)
      switch (status) {
        case 200:
          loadWorkouts(data)
          break
        case 401:
          alert('You token is unauthorized, please log in again')
          logout()
          break
      }
    }
    fetchWorkouts()
  }, [loadWorkouts])

  return (
    <div className="workouts">
      {workouts && workouts.map(workout => (
        <WorkoutDetails workout={workout} key={workout._id} />
      ))}
    </div>
  )
    
  
}