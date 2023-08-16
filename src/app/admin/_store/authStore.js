import { createContextStore, action, persist } from 'easy-peasy';

const AuthStore = createContextStore(persist({
  username: null,
  login: action((state, payload) => {
    state.username = payload.username;
  }),
  logout: action((state) => {
    state.username = null;
  })
}));

export default AuthStore;