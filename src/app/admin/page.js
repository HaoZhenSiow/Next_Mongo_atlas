'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { fakeSessionsGenerator } from './_lib/fakeData'

import { useDataStore } from './_stateManagement/stores/dataStore'
import { useLineChartStore } from './_stateManagement/stores/lineChartStore'
import { usePagesStatisticStore } from './_stateManagement/stores/pagesStatisticStore'
import { useTrafficSourceStatisticStore } from "./_stateManagement/stores/trafficSourceStatisticStore"
import { useDevicesStatStore } from './_stateManagement/stores/devicesStatStore'

import LineGraphControls from "./_components/lineGraph/LineGraphControls"
import PageGraphControls from './_components/pageGraph/PageGraphControl'
import TrafficSource from './_components/trafficSource/TrafficSource'
import DevicesGraph from './_components/devicesGraph/DevicesGraph'
import Sessions from './_components/sessions/Sessions'
import PathExplorationSnippet from './_components/pathExploration/PathExplorationSnippet'


const Dashboard = createDashboard()

const fakseSessions = fakeSessionsGenerator(365)

export default function Home() {
  const dataStore = useDataStore()
  
  if (dataStore.rawData.length < 1) {
    dataStore.setRawData(fakseSessions)
  }
  
  return (
    <SetRawData>
      <Dashboard className="container">
        <LineGraphControls className="snippet"/>
        <PageGraphControls className="snippet"/>
        <div className="snippets">
          <TrafficSource className="snippet"/>
          <DevicesGraph className="snippet"/>
        </div>
        <Sessions className="snippet"/>
        <PathExplorationSnippet className="snippet"/>
      </Dashboard>
    </SetRawData>
  )
}

function createDashboard() {
  return styled.main`
    background-color: var(--bg-color2);
    color: var(--text-color);
    padding-bottom: 50px;

    .snippet {
      background-color: var(--bg-color);
      padding: 30px;
      border-radius: 10px;
      margin-block-end: 3em;

      h2 {
        margin-bottom: .5em;
      }
    }

    & > .snippet:last-child {
      margin-block-end: 0;
    }

    .controls {
      display: flex;
      gap: .5em;
      margin-bottom: 1em;
      

      select {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: .9em;
        border: 1px solid var(--text-color);
        border-radius: 5px;
      }

    }

    .snippets {
      display: flex;
      justify-content: space-between;
      gap: 1em;
    }
  `
}

function SetRawData({ children }) {
  const dataStore = useDataStore(),
        lineChartStore = useLineChartStore(),
        pageStatisticStore = usePagesStatisticStore(),
        trafficSourceStatisticStore = useTrafficSourceStatisticStore(),
        devicesStatStore = useDevicesStatStore()

  const [load, setLoad] = useState(false)

  useEffect(() => {
    lineChartStore.setState('rawData', dataStore.rawData)
    pageStatisticStore.setState('rawData', dataStore.rawData)
    trafficSourceStatisticStore.setState('rawData', dataStore.rawData)
    devicesStatStore.setState('rawData', dataStore.rawData)
    setLoad(true)
  }, [dataStore, lineChartStore, pageStatisticStore, trafficSourceStatisticStore, devicesStatStore])

  return load ? children : null
}