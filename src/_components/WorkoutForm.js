'use client'
import { useRef } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutStore from "@/_stores/workoutStore"

const WorkoutForm = () => {
  const errRef = useRef()
  const { insertWorkout } = WorkoutStore.useStoreActions(actions => actions)

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add a New Workout</h3>

      <label>Excersize Title:</label>
      <input 
        type="text"
        name="title"
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        name="load"
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        name="reps"
      />

      <button name="submit">Add Workout</button>
      <div className="error" ref={errRef} hidden>Please fill out all fields</div>
    </form>
  )

  async function handleSubmit(e) {
    e.preventDefault()

    const form = e.target,
          title = form.title,
          load = form.load,
          reps = form.reps,
          button = form.submit,
          workouts = { title: title.value, load: load.value, reps: reps.value }

    button.disabled = true
    errRef.current.hidden = true

    for (let x in workouts) {
      if (!workouts[x]) {
        addErrorClass(form[x])
        return button.disabled = false
      } else {
        removeErrorClass(form[x])
      }
    }

    const { status, data } = await axios.post(process.env.NEXT_PUBLIC_WORKOUT_API, workouts)

    if (status === 201) {
      insertWorkout(data)
      form.reset()
    }
    button.disabled = false
  }

  function addErrorClass(field) {
    field.classList.add('error')
    errRef.current.hidden = false
  }

  function removeErrorClass(field) {
    field.classList.remove('error')
  }
}

export default WorkoutForm