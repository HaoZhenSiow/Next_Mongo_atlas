'use client'
import AuthStore from "@/_stores/authStore"

import WorkoutList from "@/_components/WorkoutList"
import WorkoutForm from "@/_components/WorkoutForm"
import { redirect } from "next/navigation"
// import { useRouter } from "next/router"

export default function Home() {
  const { email } = AuthStore.useStoreState(state => state)
  if (!email) redirect('/login')
  
  return (
    <div className="home">
      <WorkoutList/>
      <WorkoutForm/>
    </div> 
  )
}