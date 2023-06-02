// 'use client'
// import { useEffect } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/_components/WorkoutDetails"
import WorkoutForm from "@/_components/WorkoutForm"

// import WorkoutStore from "@/stores/workoutStore"

import connectDB from "@/_lib/connectDB"
import workoutModel from "@/_models/workoutModel"

export default async function Home() {
  connectDB()
  const workoutsFetched = await workoutModel.find().sort({ createdAt: -1 })
  const workouts = JSON.parse(JSON.stringify(workoutsFetched))
  
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