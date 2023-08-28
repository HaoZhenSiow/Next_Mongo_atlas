'use client'
import styled from 'styled-components'
import { fakeSessionsGenerator } from './_lib/fakeData'

import { useLineChartStore } from './_store/lineChartStore'

import LineGraphControls from "./_components/lineGraph/LineGraphControls"
import PageGraphControls from './_components/pageGraph/PageGraphControl'
import Sessions from './_components/sessions/Sessions'

const Dashboard = createDashboard()

export default function Home() {
  const { rawData, setRawData } = useLineChartStore()

  if (rawData.length < 1) {
    setRawData(fakeSessionsGenerator(365))
  }
  
  return (
    <Dashboard className="container">
      <LineGraphControls/>
      <PageGraphControls/>
      <Sessions/>
    </Dashboard> 
  )
}

function createDashboard() {
  return styled.main`
    background-color: var(--bg-color2);
    color: var(--text-color);

    & > div {
      background-color: var(--bg-color);
      padding: 30px;
      border-radius: 10px;
      margin-block-end: 3em;

      h2 {
        margin-bottom: .5em;
      }

      &:last-child {
        margin-block-end: 0;
      }
    }
  `
}