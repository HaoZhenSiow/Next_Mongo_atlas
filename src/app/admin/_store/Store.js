'use client'
import AuthStore from "./authStore"
import LineChartStore from "./lineChartStore"
import PagesStatisticStore from "./pagesStatisticStore"
import DataStore from "./dataStore"

export default function Store({ children }) {

  return (
    <AuthStore.Provider>
      <DataStore.Provider>
        <LineChartStore.Provider>
          <PagesStatisticStore.Provider>
            <WaitForStateRehydration>
              {children}
            </WaitForStateRehydration>
          </PagesStatisticStore.Provider>
        </LineChartStore.Provider>
      </DataStore.Provider>
    </AuthStore.Provider>
  )
}

function WaitForStateRehydration({ children }) {
  const isAuthStoreRehydrated = AuthStore.useStoreRehydrated(),
        isLineChartStoreRehydrated = LineChartStore.useStoreRehydrated(),
        isPagesStatisticStoreRehydrated = PagesStatisticStore.useStoreRehydrated(),
        condition = isAuthStoreRehydrated && isLineChartStoreRehydrated && isPagesStatisticStoreRehydrated
  return condition ? children : null;
}