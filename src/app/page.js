import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/components/WorkoutDetails"
import WorkoutForm from "@/components/WorkoutForm"


export default async function Home() {
  
  const { status, data: workouts } = await axios.get(process.env.WORKOUTS_API)
  
  return (
    <div className="home">
      <div className="workouts">
        {status === 200 && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <WorkoutForm />
    </div> 
  )
}