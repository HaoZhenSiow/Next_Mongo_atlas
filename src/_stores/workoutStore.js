import { createContextStore, action } from 'easy-peasy';

const WorkoutStore = createContextStore({
  workouts: [],
  loadWorkouts: action((state, payload) => {
    state.workouts = payload
  })
});

export default WorkoutStore;