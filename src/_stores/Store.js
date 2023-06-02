'use client'

import AuthStore from "./authStore"
import WorkoutStore from "./workoutStore"

export default function Store({ children }) {
  return (
    <AuthStore.Provider>
      <WorkoutStore.Provider>
        {children}
      </WorkoutStore.Provider>
    </AuthStore.Provider>
  )
}