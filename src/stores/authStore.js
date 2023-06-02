import { createContextStore, action, persist } from 'easy-peasy';

const AuthStore = createContextStore(persist({
  email: null,
  token: null,
  login: action((state, payload) => {
    state.email = payload.email;
    state.token = payload.token;
  }),
  logout: action((state) => {
    state.email = null;
    state.token = null;
  })
}));

export default AuthStore;