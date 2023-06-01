import { createContextStore, action, persist } from 'easy-peasy';

const CounterStore = createContextStore({
  count: 0,
  increment: action((state) => {
    state.count += 1;
  }),
});

export default CounterStore;