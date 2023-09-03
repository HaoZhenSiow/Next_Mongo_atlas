import styled from 'styled-components'

import PeriodControl from '../lineGraph/controls/PeriodControl';
import Snippet from '../Snippet';
import Table from '../Table';

const PageGraphControlsStyled = createPageGraphControlsStyled()

export default function PageGraphControls(props) {
  const headers = ['Page Name', 'Page Views', 'Unique Users', 'Engagement Rate', 'Conversions', 'Conversion Rate']

  return (
    <PageGraphControlsStyled className={props.className}>
      <div className="controls">
        <h2>Pages</h2>
        <PeriodControl/>
      </div>
      <div>
        <Table headers={headers}>
          <tr>
            <td>/</td>
            <td>123</td>
            <td>20</td>
            <td>31</td>
            <td>20%</td>
            <td>20%</td>
          </tr>
          <tr>
            <td>/about</td>
            <td>123</td>
            <td>20</td>
            <td>31</td>
            <td>20%</td>
            <td>20%</td>
          </tr>
          <tr>
            <td>/about</td>
            <td>123</td>
            <td>20</td>
            <td>31</td>
            <td>20%</td>
            <td>20%</td>
          </tr>
          <tr>
            <td>/about</td>
            <td>123</td>
            <td>20</td>
            <td>31</td>
            <td>20%</td>
            <td>20%s</td>
          </tr>
        </Table>
      </div>
    </PageGraphControlsStyled>
  );
}

function createPageGraphControlsStyled() {
  return styled.div`
    .controls {
      justify-content: space-between;
      align-items: center;
    }
  `
}