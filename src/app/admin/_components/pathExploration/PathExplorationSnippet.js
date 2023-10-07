import styled from 'styled-components'
import { useState } from 'react'

import Diagram from './Diagram';
import Diagram2 from './Diagram2';
import PeriodControl from '../controls/PeriodControl'

import { usePathExplorationStore } from '../../_stateManagement/stores/pathExplorationStore'; 

const PathExplorationSnippetStyled = createPathExplorationSnippetStyled()

export default function PathExplorationSnippet(props) {
  const { dataDisplayingObj, sessionType, userType, deviceType, trafficSource, trafficSources, setState } = usePathExplorationStore()

  const [resetKey, setResetKey] = useState(0)

  const handleHardReset = (field, val) => {
    setState(field, val)
    setResetKey((prevKey) => prevKey + 1);
  }
  // const de = dataDisplayingObj.next()
  return (
    <PathExplorationSnippetStyled className={props.className}>
      <h2>Path Exploration</h2>
      <div className="controls">
        <select value={userType} onChange={e => handleHardReset('userType', e.target.value)}>
          <option value="all" defaultValue>All Users</option>
          <option value="new">New Users</option>
          <option value="returning">Returning Users</option>
        </select>
        <select value={deviceType} onChange={e => handleHardReset('deviceType', e.target.value)}>
          <option value="all" defaultValue>All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>
        <select value={trafficSource} onChange={e => handleHardReset('trafficSource', e.target.value)}>
          <option value="all" defaultValue>All Sources</option>
          {trafficSources.map(referrer => (
            <option key={referrer} value={referrer}>{referrer}</option>
          ))}
        </select>
        <select value={sessionType} onChange={e => handleHardReset('sessionType', e.target.value)}>
          <option value="all" defaultValue>All Sessions</option>
          <option value="engaged">Engaged Sessions</option>
          <option value="conversion">Sessions with conversion</option>
        </select>
        <PeriodControl store={usePathExplorationStore}/>
      </div>
      <div className="diagramContainer">
        <Diagram2 key={resetKey}/>
      </div>
    </PathExplorationSnippetStyled>
  );
}

function createPathExplorationSnippetStyled() {
  return styled.div`
    .diagramContainer {
      max-height: 80vh;
      overflow: auto;
    }

    .controls {
      /* justify-content: space-between; */
      gap: 0.5em;

      & > div {
        margin-left: auto;
      }
    }
  `
}