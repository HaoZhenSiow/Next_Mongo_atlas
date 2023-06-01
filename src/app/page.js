// 'use client'
// import { useEffect } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/components/WorkoutDetails"
import WorkoutForm from "@/components/WorkoutForm"

// import WorkoutStore from "@/stores/workoutStore"

import connectDB from "@/lib/connectDB"

export default function Home() {
  const workouts = []
  connectDB()
  // const { workouts } = WorkoutStore.useStoreState(state => state)
  // const { loadWorkouts } = WorkoutStore.useStoreActions(actions => actions)
  // useEffect(() => {
  //   const fetchWorkouts = async () => {
  //     const { status, data } = await axios.get(process.env.NEXT_PUBLIC_WORKOUT_API)
  //     console.log(data);
  //     if (status === 200) {
  //       loadWorkouts(data)
  //     }
  //   }
  //   fetchWorkouts()
    
  // }, [loadWorkouts])
  
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