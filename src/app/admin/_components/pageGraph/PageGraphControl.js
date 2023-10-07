import styled from 'styled-components'
import _ from 'lodash'

import { usePagesStatisticStore } from '../../_stateManagement/stores/pagesStatisticStore';

import PeriodControl from '../controls/PeriodControl';
import Table from '../Table';

const PageGraphControlsStyled = createPageGraphControlsStyled()

const headers = ['Page Name', 'Page Views', 'Unique Users', 'Engagement Rate', 'Conversions', 'Conversion Rate']

export default function PageGraphControls(props) {
  const { stats } = usePagesStatisticStore()
  const entries = Object.entries(stats.eventsByPage),
        sortedEntries = _.sortBy(entries, entry => entry[0])

  const rows = sortedEntries.map(([key, val]) => {
    const engagedEvents = val.filter(({ duration }) => (duration >= 15 * 1000)),
          engagementRate = rate(engagedEvents.length, val.length),
          conversions = stats.conversionsByPage[key],
          conversionRate = rate(conversions, engagedEvents.length)

    const uids = [],
          ips = []

    const users = val.reduce((prev, event) => {
      if (uids.includes(event.uid)) {
        return prev
      }
      if (ips.includes(event.ip)) {
        return prev
      }
      event.uid && uids.push(event.uid)
      event.ip && ips.push(event.ip)

      return prev + 1
    }, 0)

    return (
      <tr key={key}>
        <td>{key}</td>
        <td>{val.length}</td>
        <td>{users}</td>
        <td>{engagementRate}</td>
        <td>{conversions}</td>
        <td>{conversionRate}</td>
      </tr>
    )
  })
  return (
    <PageGraphControlsStyled className={props.className}>
      <div className="controls">
        <h2>Pages</h2>
        <PeriodControl store={usePagesStatisticStore}/>
      </div>
      <div>
        <Table headers={headers}>
          {sortedEntries.length > 0 ? rows : <tr>
           <td colSpan={6} style={{textAlign: 'center'}}>No data</td>
          </tr>}
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

function rate(num1, num2) {
  return (num1/num2*100).toFixed(2) + '%'
}