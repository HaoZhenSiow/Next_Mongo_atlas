'use client'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { trackRemoveWorkout } from '@/_hooks/useEventTracker'
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from '@/_stores/authStore'
import WorkoutStore from "@/_stores/workoutStore"

const WorkoutDetails = ({ workout }) => {

  const { removeWorkout } = WorkoutStore.useStoreActions(actions => actions)
  const { logout } = AuthStore.useStoreActions(actions => actions)

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
    switch (status) {
      case 200:
        trackRemoveWorkout()
        removeWorkout(data)
        break
      case 401:
        alert('You token is unauthorized, please log in again')
        logout()
        break
    }
  }
}

export default WorkoutDetails