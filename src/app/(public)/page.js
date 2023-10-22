
import WorkoutList from "@/_components/WorkoutList"
import WorkoutForm from "@/_components/WorkoutForm"
// import { useRouter } from "next/router"
import { headers } from "next/headers"

export default function Home() {
  const headerList = headers()
  return (
    <p>{headerList.get('referer')}</p>
    // <div className="home">
    //   <WorkoutList/>
    //   <WorkoutForm/>
    // </div> 
  )
}