import { createContextStore, action } from 'easy-peasy';

const WorkoutStore = createContextStore({
  workouts: null,
  loadWorkouts: action((state, payload) => {
    state.workouts = payload
  }),
  insertWorkout: action((state, payload) => {
    state.workouts.unshift(payload)
  })
});

export default WorkoutStore;