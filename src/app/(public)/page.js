'use client'
import WorkoutList from "@/_components/WorkoutList"
import WorkoutForm from "@/_components/WorkoutForm"
// import { useRouter } from "next/router"

export default function Home() {
  return (
    <div className="home">
      <WorkoutList/>
      <WorkoutForm/>
    </div> 
  )
}