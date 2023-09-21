import styled from 'styled-components'
import { Fragment } from 'react'

import PeriodControl from '../controls/PeriodControl'
import BarGraph from './BarGraph'

import { useTrafficSourceStatisticStore } from '../../_stateManagement/stores/trafficSourceStatisticStore'

const TrafficSourceStyled = createTrafficSourceStyled(),
      Progress = createProgress()

export default function TrafficSource(props) {
  const { selectedField, setState, dataDisplayingMap, isRate } = useTrafficSourceStatisticStore()
  const sortedData = new Map([...dataDisplayingMap.entries()].sort((a, b) => b[1] - a[1])),
        trafficSources = [...sortedData.keys()]
        isRate || trafficSources.shift()

  return (
    <TrafficSourceStyled className={props.className}>
      <h2>Traffic Source</h2>
      <div className="controls">
        <select value={selectedField} onChange={e => setState('selectedField', e.target.value)}>
            <option value="Sessions" defaultValue>Sessions</option>
            <option value="Bounce Rate">Bounce Rate</option>
            <option value="Engaged Sessions">Engaged Sessions</option>
            <option value="Engagement Rate">Engagement Rate</option>
            <option value="Total Users">Total Users</option>
            <option value="New Users">New Users</option>
            <option value="Returning Users">Returning Users</option>
            <option value="Conversions">Conversions</option>
            <option value="Session Conversion Rate">Session Conversion Rate</option>
            <option value="User Conversion Rate">User Conversion Rate</option>
        </select>
        <PeriodControl store={useTrafficSourceStatisticStore}/>
      </div>
      <div>
        {trafficSources.map((src) => (
          <Fragment key={src}>
            <div className="sources">
              <p><b>{src}</b></p>
              <p>{dataDisplayingMap.get(src) + isRate}</p>
            </div>
            <Progress $val={dataDisplayingMap.get(src)} $max={dataDisplayingMap.get('total')} $isRate={isRate}/>
          </Fragment>
        ))}
      </div>
      {/* <BarGraph/> */}
    </TrafficSourceStyled>
  );
}

function createTrafficSourceStyled() {
  return styled.div`
    width: 55%;

    .controls {
      justify-content: space-between;
    }

    .sources {
      display: flex;
      justify-content: space-between;
    }
  `
}

function createProgress() {
  return styled.div.attrs(props => ({
    $width: props.$isRate ? props.$val + '%' : percentage(props.$val/props.$max) + '%'
  }))`
    width: 100%;
    height: 4px;
    border-radius: 5px;
    background-color: var(--bg-color5);
    margin-top: .5em;
    margin-bottom: 1em;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      display: inline-block;
      border-radius: 5px;
      width: ${props => props.$width};
      height: 4px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--matrix2-color);
    }
  `
}

function percentage(expr) {
  return parseFloat(((expr)*100).toFixed(2))
}