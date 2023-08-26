import { createContextStore, action, persist } from 'easy-peasy';

const DataStore = createContextStore(persist({
  rawData: null,
  setRawData: action((state, payload) => {
    state.rawData = payload;
  })
}))

export default DataStore