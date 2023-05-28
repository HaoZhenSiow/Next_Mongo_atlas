'use client'

import axios from "axios"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Number of reps: </strong>{workout.reps}</p>
      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
    </div>
  )

  async function handleDelete() {
    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/workouts/${workout['_id']}`)
    await axios.get(`${window.location.origin}/api/revalidate?path=/&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`)
    window.location.reload()
  }
}

export default WorkoutDetails