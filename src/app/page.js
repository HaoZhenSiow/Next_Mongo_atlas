'use client'
import { useEffect } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/_components/WorkoutDetails"
import WorkoutForm from "@/_components/WorkoutForm"

import AuthStore from "@/_stores/authStore"
import WorkoutStore from "@/_stores/workoutStore"

export default function Home() {
  const { email } = AuthStore.useStoreState(state => state)
  const { workouts } = WorkoutStore.useStoreState(state => state)
  const { loadWorkouts } = WorkoutStore.useStoreActions(actions => actions)
 
  useEffect(() => {
    const token = JSON.parse(sessionStorage['[EasyPeasyStore][0]']).data.token

    async function fetchWorkouts() {
      const { status, data } = await axios.get(process.env.NEXT_PUBLIC_WORKOUT_API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (status === 200) {
        loadWorkouts(data)
      }
    }
    fetchWorkouts()
  }, [loadWorkouts])

  
  return (
    <div className="home">
      <div className="workouts">
        {email && workouts && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <WorkoutForm/>
    </div> 
  )
}