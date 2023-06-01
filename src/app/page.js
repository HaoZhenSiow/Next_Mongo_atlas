'use client'
import { useEffect } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import WorkoutDetails from "@/components/WorkoutDetails"
import WorkoutForm from "@/components/WorkoutForm"

import WorkoutStore from "@/stores/workoutStore"
import CounterStore from "@/stores/counterStore"

export default function Home() {
  return (
    <div className="home">
      <div className="workouts">
        {/* {workouts && workouts.map(workout => (
          <WorkoutDetails workout={workout} key={workout._id} />
        ))} */}
        <Display/>
        <Button></Button>
      </div>
      <WorkoutForm/>
    </div> 
  )
}

export function Button() {
  const { increment } = CounterStore.useStoreActions(actions => actions)
  return (
    <button onClick={increment}>Increment</button>
  )
}

export function Display() {
  const { count } = CounterStore.useStoreState(state => state)
  return (
    <div>{count}</div>
  )
}