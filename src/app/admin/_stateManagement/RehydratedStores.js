'use client'

import AuthStore from "./stores/authStore"
import DataStore from "./stores/dataStore"
import LineChartStore from "./stores/lineChartStore"
import PagesStatisticStore from "./stores/pagesStatisticStore"
import TrafficSourceStatisticStore from "./stores/trafficSourceStatisticStore"

const stores = [
  AuthStore,
  DataStore,
  LineChartStore,
  PagesStatisticStore,
  TrafficSourceStatisticStore
]

export default function RehydratedStores({ children }) {
  return renderStoreProviders(stores, children)
}

function renderStoreProviders(stores, children) {
  const storeNames = Object.keys(stores)

  // Base case: If there are no more stores, return the children
  if (storeNames.length === 0) {
    return <WaitForStateRehydration>{children}</WaitForStateRehydration>
  }

  const currentStoreName = storeNames[0],
        remainingStores = { ...stores }

  delete remainingStores[currentStoreName]

  const nestedProviders = renderStoreProviders(remainingStores, children),
        CurrentStoreProvider = stores[currentStoreName].Provider

  return <CurrentStoreProvider>{nestedProviders}</CurrentStoreProvider>
}

function WaitForStateRehydration({ children }) {
  const statuses = stores.map(store => store.useStoreRehydrated()),
        allStoresRehydrated = statuses.every(status => status)

  return allStoresRehydrated ? children : null 
}