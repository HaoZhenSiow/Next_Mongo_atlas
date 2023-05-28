import axios from "axios"

import WorkoutDetails from "@/components/WorkoutDetails"
import WorkoutForm from "@/components/WorkoutForm"

export default async function Home() {
  
  const { data: workouts } = await axios.get(`${process.env.BACKEND_SERVER}/api/workouts/`)
  
  return (
    <div className="home">
      <div className="workouts">
        {workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  )
}