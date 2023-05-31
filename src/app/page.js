import connectDB from "@/lib/connectDB"
import workoutModel from "@/models/workout"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/components/WorkoutDetails"
import WorkoutForm from "@/components/WorkoutForm"


export default async function Home() {
  connectDB()
  const workouts = await workoutModel.find().sort({ createdAt: -1 })
  
  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <WorkoutForm />
    </div> 
  )
}