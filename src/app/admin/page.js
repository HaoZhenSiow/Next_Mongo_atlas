'use client'
import { redirect } from "next/navigation"
import styled from 'styled-components'

import AuthStore from "./_store/authStore"

import LineGraphControls from "./_components/lineGraph/LineGraphControls"

const Dashboard = createDashboard()

export default function Home() {
  const { username } = AuthStore.useStoreState(state => state)
  if (!username) redirect('/admin/login')

  return (
    <Dashboard className="container">
      <LineGraphControls/>
      
    </Dashboard> 
  )
}

function createDashboard() {
  return styled.main`
    border: 1px solid black;
  `
}