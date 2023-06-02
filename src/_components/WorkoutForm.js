'use client'
import { useState } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

const WorkoutForm = () => {

  const [workouts, setWorkouts] = useState({ title: '', load: '', reps: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emptyFields, setEmptyFields] = useState([])

  return (
    <form className="create"> 
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input 
        type="text"
        name="title"
        onChange={handleChange} 
        value={workouts.title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        name="load"
        onChange={handleChange} 
        value={workouts.load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        name="reps"
        onChange={handleChange} 
        value={workouts.reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button type="button" onClick={handleSubmit} disabled={loading}>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  )

  function handleChange(e) {
    const { name, value } = e.target
    setWorkouts(prevWorkouts => ({ ...prevWorkouts, [name]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    const { status, data } = await axios.post(process.env.NEXT_PUBLIC_WORKOUT_API, workouts)
    if (status !== 201) {
      setError(data.error)
      setEmptyFields(data.emptyFields)
      return setLoading(false)
    } 
    setWorkouts({ title: '', load: '', reps: '' })
    setError(null)
    setEmptyFields([])
    location.reload()
  }
}

export default WorkoutForm