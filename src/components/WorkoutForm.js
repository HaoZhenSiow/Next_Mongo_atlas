'use client'

import axios from "axios"
import { useState } from "react"

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
    try {
      setLoading(true)
await createWorkout()
      resetForm()
await revalidateIndexPage()
      location.reload()
    } 
    catch (error) {
      const message = error.response.data.error
      const emptyFields = error.response.data.emptyFields

      if (message && emptyFields) {
        setError(message)
        setEmptyFields(emptyFields)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } 
    finally { setLoading(false) }
  }

  function resetForm() {
    setWorkouts({ title: '', load: '', reps: '' })
    setError(null)
    setEmptyFields([])
  }

  async function createWorkout() {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER}/api/workouts/`, workouts)
  }

  async function revalidateIndexPage() {
    await axios.get(`${window.location.origin}/api/revalidate?path=/&secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}`)
  }
}

export default WorkoutForm