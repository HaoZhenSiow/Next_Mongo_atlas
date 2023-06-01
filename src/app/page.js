import connectDB from "@/lib/connectDB"
import workoutModel from "@/models/workoutModel"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/components/WorkoutDetails"
import WorkoutForm from "@/components/WorkoutForm"


export default async function Home() {
  connectDB()
  const workoutsFetched = await workoutModel.find().sort({ createdAt: -1 })
  const workouts = JSON.parse(JSON.stringify(workoutsFetched))
  
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