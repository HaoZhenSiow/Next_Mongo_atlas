import styled from 'styled-components'

import PeriodControl from '../controls/PeriodControl'
import BarGraph from './BarGraph'

import { useTrafficSourceStatisticStore } from '../../_stateManagement/stores/trafficSourceStatisticStore'

const TrafficSourceStyled = createTrafficSourceStyled()

export default function TrafficSource(props) {
  return (
    <TrafficSourceStyled className={props.className}>
      <h2>Traffic Source</h2>
      <div className="controls">
        <select>
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
      <BarGraph/>
    </TrafficSourceStyled>
  );
}

function createTrafficSourceStyled() {
  return styled.div`
    width: 55%;

    .controls {
      justify-content: space-between;
    }
  `
}