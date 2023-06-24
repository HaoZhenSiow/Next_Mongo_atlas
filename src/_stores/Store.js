'use client'
import AuthStore from "./authStore"
import WorkoutStore from "./workoutStore"

export default function Store({ children }) {
  return (
    <AuthStore.Provider>
      <WorkoutStore.Provider>
        <WaitForStateRehydration>
            {children}
        </WaitForStateRehydration>
      </WorkoutStore.Provider>
    </AuthStore.Provider>
  )
}

function WaitForStateRehydration({ children }) {
  const isRehydrated = AuthStore.useStoreRehydrated();
  return isRehydrated ? children : null;
}