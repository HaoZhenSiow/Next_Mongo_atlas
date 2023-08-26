'use client'
import styled from 'styled-components'
import LineGraph from './LineGraph';

import { useLineChartStore } from '../../_store/lineChartStore';

import XintervalControl from './controls/XintervalControl';
import PeriodControl from './controls/PeriodControl';

const LineGraphControlsStyled = createLineGraphControlsStyled()

export default function LineGraphControls() {

  const { total, setSelectedField, selectedField } = useLineChartStore()

  return (
    <LineGraphControlsStyled>
      <div className="controls">
        <div className="field">
          <select value={selectedField} onChange={e => setSelectedField(e.target.value)}>
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
          <p>{total}</p>
        </div>
        
        <PeriodControl/>
        <XintervalControl/>
      </div>
      <LineGraph/>
    </LineGraphControlsStyled>
  );
}

function createLineGraphControlsStyled() {
  return styled.div`
    background-color: var(--bg-color);
    width: 100%;
    padding: 20px;

    .controls {
      display: flex;
      margin-bottom: 1em;

      select {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-size: .9em;
      }

      .field {
        flex-grow: 1;
        display: flex;

        p {
          margin-left: .5em;
          color: var(--text-color);
        }
      }

    }
  `
}

function formatDate(fullDate) {
  const day = String(fullDate.getDate()).padStart(2, '0')
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(fullDate)
  return day + ' ' + month
}