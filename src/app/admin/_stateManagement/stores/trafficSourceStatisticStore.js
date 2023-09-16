import { createContextStore, action, persist } from 'easy-peasy'
import session from '../storageEngines/session';

const TrafficSourceStatisticStore = createContextStore(persist({
  rawData: [],
  period: 'Last 7 days',
  setRawData: action((state, payload) => {
    state.rawData = payload;
  }),
  setPeriod: action((state, payload) => {
    state.period = payload
  })
}, {
  allow: ['period'],
  storage: session('TrafficSourceStatisticStore')
}))

export default TrafficSourceStatisticStore


export function useTrafficSourceStatisticStore() {
  const states = TrafficSourceStatisticStore.useStoreState(state => state),
        actions = TrafficSourceStatisticStore.useStoreActions(actions => actions)
  return { ...states, ...actions }
}