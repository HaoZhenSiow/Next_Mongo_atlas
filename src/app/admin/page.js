'use client'
import { redirect } from "next/navigation"

import AuthStore from "./_store/authStore"

export default function Home() {
  const { username } = AuthStore.useStoreState(state => state)
  if (!username) redirect('/admin/login')
  
  return (
    <div>
      <h1>Hello Worssld</h1>
      
    </div> 
  )
}