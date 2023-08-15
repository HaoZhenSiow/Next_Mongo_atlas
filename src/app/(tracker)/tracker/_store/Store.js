'use client'
import AuthStore from "./authStore"

export default function Store({ children }) {

  return (
    <AuthStore.Provider>
      <WaitForStateRehydration>
          {children}
      </WaitForStateRehydration>
    </AuthStore.Provider>
  )
}

function WaitForStateRehydration({ children }) {
  const isRehydrated = AuthStore.useStoreRehydrated();
  return isRehydrated ? children : null;
}