import styled from 'styled-components'

import PeriodControl from '../lineGraph/controls/PeriodControl';

const DevicesGraphStyled = createDevicesGraphStyled()

export default function DevicesGraph(props) {
  return (
    <DevicesGraphStyled className={props.className}>
      <h2>Devices</h2>
      <div className="controls">
        <select>
            <option value="Total Users">Total Users</option>
            <option value="New Users">New Users</option>
            <option value="Returning Users">Returning Users</option>
        </select>
        <select>
            <option value="Device">Device</option>
            <option value="Browser">Browser</option>
            <option value="Screen Resolution">Screen Resolution</option>
        </select>
        <PeriodControl/>
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
  `
}