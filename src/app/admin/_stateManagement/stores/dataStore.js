import { createContextStore, action, persist } from 'easy-peasy'
import indexedDB from '../storageEngines/indexedDB';

const DataStore = createContextStore(persist({
  rawData: [],
  blockList: [],
  setRawData: action((state, payload) => {
    state.rawData = payload;
  }),
  setBlockList: action((state, payload) => {
    state.blockList = payload;
  })
}, {
  allow: ['rawData', 'blockList'],
  storage: indexedDB('dataStore')
}))

export default DataStore


export function useDataStore() {
  const states = DataStore.useStoreState(state => state),
        actions = DataStore.useStoreActions(actions => actions)
  return { ...states, ...actions }
}