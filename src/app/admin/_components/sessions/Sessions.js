import styled from 'styled-components'

import { useLineChartStore } from '../../_store/lineChartStore'
import { useState } from 'react';

const SessionsStyled = createSessionsStyled()

export default function Sessions(props) {
  const { rawData } = useLineChartStore(),
        sliceData = createSliceData(rawData),
        [pagination, setPagination] = useState({ sessions: sliceData(1), page: 1 })

  const loadMore = () => {
    setPagination(prev => ({ 
      sessions: [...prev.sessions, ...sliceData(prev.page + 1)],
      page: prev.page + 1 
    }))
  }

  return (
    <SessionsStyled className={props.className}>
      <h2>Sessions</h2>
      <div className='sessions__table'>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Session ID</th>
              <th>New User</th>
              <th>Duration</th>
              <th>Device Type</th>
              <th>Source</th>
              <th>Events</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {pagination.sessions.map((session, index) => (
              <tr key={index}>
                <td>27 Mar</td>
                <td>dsadw4343sd</td>
                <td>Yes</td>
                <td>15 min</td>
                <td>Desktop</td>
                <td>Google</td>
                <td>9</td>
                <td>Yes</td>
              </tr>
            ))}
            {pagination.sessions.length < rawData.length && (
              <tr className='load-more' onClick={loadMore}>
                <td colSpan="8">Load More</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SessionsStyled>
  );
}

function createSessionsStyled() {
  return styled.div`
    .sessions__table {
      max-height: 600px;
      overflow-y: auto;
      position: relative;
    }

    table {
      width: 100%;
    }
    

    thead {
      position: sticky;
      top: 0;
      left: 0;
      background-color: var(--text-color);
      color: var(--bg-color);
      border-color: var(--bg-color);
    }

    td {
      text-align: center;
      border: 1px solid var(--text-color);
    }

    th, td {
      padding-block: .5em;
    }

    .load-more {
      cursor: pointer;
    }
  `
}

function createSliceData(rawData) {
  return function (page) {
    return rawData.slice((page - 1) * 10, page * 10)
  }
}