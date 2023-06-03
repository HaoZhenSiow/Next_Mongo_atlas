import { createContextStore, action } from 'easy-peasy';

const WorkoutStore = createContextStore({
  workouts: null,
  loadWorkouts: action((state, payload) => {
    state.workouts = payload
  })
});

export default WorkoutStore;