'use client'
import { redirect } from 'next/navigation'

import WorkoutList from "@/_components/WorkoutList"
import WorkoutForm from "@/_components/WorkoutForm"

import AuthStore from "@/_stores/authStore"

export default function Home() {
  const { email } = AuthStore.useStoreState(state => state)

  !email && redirect('/login')
   
  return (
    <div className="home">
      <WorkoutList/>
      <WorkoutForm/>
    </div> 
  )
}