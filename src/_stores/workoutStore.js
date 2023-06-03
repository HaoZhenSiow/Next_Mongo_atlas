import { createContextStore, action } from 'easy-peasy';

const WorkoutStore = createContextStore({
  workouts: null,
  loadWorkouts: action((state, payload) => {
    state.workouts = payload
  }),
  insertWorkout: action((state, payload) => {
    state.workouts.unshift(payload)
  }),
  removeWorkout: action((state, payload) => {
    state.workouts = state.workouts.filter(
      workout => workout._id !== payload._id
    )
  })
});

export default WorkoutStore;