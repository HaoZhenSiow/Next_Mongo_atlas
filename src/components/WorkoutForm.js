'use client'

import { useState } from "react"
import axios from "axios"

const WorkoutForm = () => {
  
  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit() {
    const workout = {title, load, reps}
    try {
      await axios.post(`${process.env.BACKEND_SERVER}/api/workouts/`, workout)
      setError(null)
      setTitle('')
      setLoad('')
      setReps('')
    } catch (error) {
      setError(error.response.data.error)
    }
  }

  return (
    <form className="create"> 
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        onChange={(e) => setLoad(e.target.value)} 
        value={load}
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        onChange={(e) => setReps(e.target.value)} 
        value={reps} 
      />

      <button type="button" onClick={handleSubmit}>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default WorkoutForm