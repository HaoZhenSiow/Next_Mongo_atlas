import recordEvent from "@/app/admin/_lib/recordEvent";

export function trackRemoveWorkout() {
  recordEvent('remove workout')
}

export function trackInsertWorkout() {
  recordEvent('insert workout')
}