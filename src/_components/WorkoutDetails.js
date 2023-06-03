'use client'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutStore from "@/_stores/workoutStore"

const WorkoutDetails = ({ workout }) => {

  const { removeWorkout } = WorkoutStore.useStoreActions(actions => actions)

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Number of reps: </strong>{workout.reps}</p>
      {/*when the page revalidate on demand, the date might be different if use formDistancetoNow and will throw an error, do not use for stale content*/}
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
    </div>
  )

  async function handleDelete() {
    const { status, data } = await axios.delete(process.env.NEXT_PUBLIC_WORKOUT_API, { 
      params: { id: workout._id }
    })
    status === 200 && removeWorkout(data)
  }
}

export default WorkoutDetails