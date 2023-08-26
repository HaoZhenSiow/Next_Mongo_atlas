'use client'
import AuthStore from "./authStore"
import LineChartStore from "./lineChartStore"
import DataStore from "./dataStore"

export default function Store({ children }) {

  return (
    <AuthStore.Provider>
      <DataStore.Provider>
        <LineChartStore.Provider>
          <WaitForStateRehydration>
              {children}
          </WaitForStateRehydration>
        </LineChartStore.Provider>
      </DataStore.Provider>
    </AuthStore.Provider>
  )
}

function WaitForStateRehydration({ children }) {
  const isRehydrated = AuthStore.useStoreRehydrated();
  return isRehydrated ? children : null;
}