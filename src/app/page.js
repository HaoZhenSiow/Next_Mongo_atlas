'use client'
import { useEffect } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/_components/WorkoutDetails"
import WorkoutForm from "@/_components/WorkoutForm"

import WorkoutStore from "@/_stores/workoutStore"

export default function Home() {  
  const { workouts } = WorkoutStore.useStoreState(state => state)
  const { loadWorkouts } = WorkoutStore.useStoreActions(actions => actions)
 
  useEffect(() => {
    async function fetchWorkouts() {
      const { status, data } = await axios.get(process.env.NEXT_PUBLIC_WORKOUT_API)
      if (status === 200) {
        loadWorkouts(data)
      }
    }
    fetchWorkouts()
  }, [loadWorkouts])

  
  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <WorkoutForm/>
    </div> 
  )
}