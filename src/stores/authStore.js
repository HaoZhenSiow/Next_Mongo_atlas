import { createContextStore, action } from 'easy-peasy';

const authStore = createContextStore({
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
});

export default authStore;