'use client'
import styled from 'styled-components'
import LineGraph from './LineGraph';

import { useLineChartStore } from '../../_store/lineChartStore';

import XintervalControl from './controls/XintervalControl';
import PeriodControl from '../controls/PeriodControl';

const LineGraphControlsStyled = createLineGraphControlsStyled()

export default function LineGraphControls({ className }) {

  const { total, setSelectedField, selectedField, device, setDevice, browsers, browser, setBrowser, trafficSources, traffic, setTraffic, device2, setDevice2, browser2, setBrowser2, traffic2, setTraffic2, total2 } = useLineChartStore()

  return (
    <LineGraphControlsStyled className={className}>
      <h2>Overview</h2>
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
          </select>
        </div>
        <PeriodControl store={useLineChartStore}/>
        <XintervalControl/>
      </div>
      <LineGraph/>
      <div className="controls matrix1">
        <p>Matrix 1</p>
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
        <p><b>{total}</b></p>
      </div>
      <div className="controls matrix2">
        <p>Matrix 2</p>
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
        <p><b>{total2}</b></p>
      </div>
    </LineGraphControlsStyled>
  );
}

function createLineGraphControlsStyled() {
  return styled.div`
    .field {
      flex-grow: 1;
    }

    .matrix1 {
      margin-top: 2em;
    }

    .matrix1 p { color: var(--matrix1-color); }
    .matrix2 p { color: var(--matrix2-color); }
  `
}