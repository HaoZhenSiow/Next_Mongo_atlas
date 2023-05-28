'use client'
export default function error({ error, reset }) {
  return (
    <>
      <p>{error.message}</p>
      <button onClick={reset}>reset</button>
    </>
  )
}