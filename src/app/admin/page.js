'use client'
import styled from 'styled-components'

import LineGraphControls from "./_components/lineGraph/LineGraphControls"

const Dashboard = createDashboard()

export default function Home() {
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