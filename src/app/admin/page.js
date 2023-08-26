'use client'
import styled from 'styled-components'
import { fakeSessionsGenerator } from './_lib/fakeData'

import { useLineChartStore } from './_store/lineChartStore'

import LineGraphControls from "./_components/lineGraph/LineGraphControls"

const Dashboard = createDashboard()

export default function Home() {
  const { rawData, setRawData } = useLineChartStore()

  if (rawData.length < 1) {
    setRawData(fakeSessionsGenerator(365))
  }
  
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