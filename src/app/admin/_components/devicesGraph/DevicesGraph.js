import styled from 'styled-components'
import { Fragment } from 'react';

import PeriodControl from '../controls/PeriodControl';

import { useDevicesStatStore } from '../../_stateManagement/stores/devicesStatStore';

const DevicesGraphStyled = createDevicesGraphStyled(),
      Progress = createProgress()

export default function DevicesGraph(props) {
  const { userType, selectedField, setState, dataDisplayingMap } = useDevicesStatStore()

  return (
    <DevicesGraphStyled className={props.className}>
      <h2>Devices</h2>
      <div className="controls">
        <select value={userType} onChange={e => setState('userType', e.target.value)}>
            <option value="Total Users">Total Users</option>
            <option value="New Users">New Users</option>
            <option value="Returning Users">Returning Users</option>
        </select>
        <select value={selectedField} onChange={e => setState('selectedField', e.target.value)}>
            <option value="Device">Device</option>
            <option value="Browser">Browser</option>
            <option value="Screen Resolution">Screen Resolution</option>
        </select>
        <PeriodControl store={useDevicesStatStore}/>
      </div>
      <div>
        {dataDisplayingMap ? [...dataDisplayingMap].map(seg => (
          <Fragment key={seg}>
            <div className="sources">
              <p><b>{seg[0]}</b></p>
              <p>{seg[1].length}</p>
            </div>
            <Progress $val={seg[1].length} $max={[...dataDisplayingMap].reduce((prev, val) => prev + val[1].length, 0)}/>
          </Fragment>
        )) : <p>No data</p>}
      </div>
    </DevicesGraphStyled>
  );
}

function createDevicesGraphStyled() {
  return styled.div`
    width: 45%;

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
    $width: percentage(props.$val/props.$max) + '%'
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