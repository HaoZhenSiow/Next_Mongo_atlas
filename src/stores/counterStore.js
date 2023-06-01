import { createContextStore, action } from 'easy-peasy';

const CounterStore = createContextStore({
  count: 0,
  increment: action((state) => {
    state.count += 1;
  }),
}, { storage: 'local' });

export default CounterStore;