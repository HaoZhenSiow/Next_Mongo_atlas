'use client'
import styled from 'styled-components'
import LineGraph from './LineGraph';

import { useLineChartStore } from '../../_store/lineChartStore';

import XintervalControl from './controls/XintervalControl';
import PeriodControl from './controls/PeriodControl';

const LineGraphControlsStyled = createLineGraphControlsStyled()

export default function LineGraphControls() {

  const { total, setSelectedField, selectedField, device, setDevice, browsers, browser, setBrowser, trafficSources, traffic, setTraffic, device2, setDevice2, browser2, setBrowser2, traffic2, setTraffic2 } = useLineChartStore()

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
        </div>
        <PeriodControl/>
        <XintervalControl/>
      </div>
      <div className="controls matrix1">
        <p><b>Matrix 1</b></p>
        <select value={device} onChange={e => setDevice(e.target.value)}>
          <option value="All Devices" defaultValue>All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>
        <select value={browser} onChange={e => setBrowser(e.target.value)}>
          <option value="All Browsers" defaultValue>All Browsers</option>
          {browsers.map(browser => (
            <option key={browser} value={browser}>{browser}</option>
          ))}
        </select>
        <select value={traffic} onChange={e => setTraffic(e.target.value)}>
          <option value="all sources" defaultValue>All Sources</option>
          {trafficSources.map(referrer => (
            <option key={referrer} value={referrer}>{referrer}</option>
          ))}
        </select>
        <p>{total}</p>
      </div>
      <div className="controls matrix2">
        <p><b>Matrix 2</b></p>
        <select value={device2} onChange={e => setDevice2(e.target.value)}>
          <option value="All Devices" defaultValue>All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </select>
        <select value={browser2} onChange={e => setBrowser2(e.target.value)}>
          <option value="All Browsers" defaultValue>All Browsers</option>
          {browsers.map(browser => (
            <option key={browser} value={browser}>{browser}</option>
          ))}
        </select>
        <select value={traffic2} onChange={e => setTraffic2(e.target.value)}>
          <option value="all sources" defaultValue>All Sources</option>
          {trafficSources.map(referrer => (
            <option key={referrer} value={referrer}>{referrer}</option>
          ))}
        </select>
        <p>{total}</p>
      </div>
      <LineGraph/>
    </LineGraphControlsStyled>
  );
}

function createLineGraphControlsStyled() {
  return styled.div`
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

      .field {
        flex-grow: 1;
        display: flex;
        gap: .5em;

        p {
          color: var(--text-color);
        }
      }

    }

    .matrix1 p { color: var(--matrix1-color); }
    .matrix2 p { color: var(--matrix2-color); }
  `
}