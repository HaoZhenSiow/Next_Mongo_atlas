'use client'
import axios from "axios"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p><strong>Load (kg): </strong>{workout.load}</p>
      <p><strong>Number of reps: </strong>{workout.reps}</p>
      {/*when the page revalidate on demand, the date might be different if use formDistancetoNow and will throw an error*/}
      {/* <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p> */}
      <p>{workout.createdAt}</p>
      <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
    </div>
  )

  async function handleDelete() {
    await axios.delete(`${process.env.NEXT_PUBLIC_WORKOUT_API}?id=${workout._id}`)
    location.reload()
  }
}

export default WorkoutDetails