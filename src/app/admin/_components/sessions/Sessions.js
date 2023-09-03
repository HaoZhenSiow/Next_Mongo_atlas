import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { useIntersection } from '@mantine/hooks'
import prettyMilliseconds from 'pretty-ms'
import dayjs from 'dayjs'

import { useLineChartStore } from '../../_store/lineChartStore'

import Table from '../Table'

const SessionsStyled = createSessionsStyled()

export default function Sessions(props) {
  const { rawData } = useLineChartStore()

  const headers = ['Date', 'Session ID', 'New User', 'Duration', 'Device Type', 'Source', 'Events', 'Conversion']

  const lastSessionRef = useRef(null)

  const { ref, entry } = useIntersection({
    root: lastSessionRef.current,
    threshold: 1
  })

  const GetPaginatedData = createGetPaginatedData(sortRawDataByDescUpdateAt(rawData))

  const [pagination, setPagination] = useState({ sessions: GetPaginatedData(1), page: 1 })

  const loadMore = () => {
    setPagination(prev => ({ 
      sessions: [...prev.sessions, ...GetPaginatedData(prev.page + 1)],
      page: prev.page + 1 
    }))
  }

  useEffect(() => {
    if (pagination.sessions.length < rawData.length) {
      entry?.isIntersecting && loadMore()
    }
  }, [entry])

  return (
    <SessionsStyled className={props.className}>
      <h2>Sessions</h2>
      <div className='sessions__table'>
        <Table headers={headers}>
          {pagination.sessions.map((session, index) => {
            const attrs = {}

            if (index === pagination.sessions.length - 1) {
              attrs.ref = ref
            }

            const createdAt = dayjs(session.createdAt).format('D MMM')
            const roundMs = Math.round((Date.parse(session.updatedAt) - Date.parse(session.createdAt)) / 1000) * 1000
            const duration = prettyMilliseconds(roundMs)

            const events = session.events,
                  eventsType = events.map(event => event.type),
                  conversion = eventsType.includes('conversion')

            return (
              <tr key={index} {...attrs}>
                <td>{createdAt}</td>
                <td>{session.uid}</td>
                <td>{session.newUser ? 'Yes' : 'No'}</td>
                <td>{duration}</td>
                <td>{session.device}</td>
                <td>{session.referrer}</td>
                <td>{session.events.length}</td>
                <td>{conversion ? 'Yes' : 'No'}</td>
              </tr>)
            }
          )}
          {/* {pagination.sessions.length < rawData.length && (
            <tr className='load-more' onClick={loadMore}>
              <td colSpan="8">Load More</td>
            </tr>
          )} */}
        </Table>
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

    /* .load-more {
      cursor: pointer;
    } */
  `
}

function createGetPaginatedData(rawData) {
  return function (page) {
    return rawData.slice((page - 1) * 15, page * 15)
  }
}

function sortRawDataByDescUpdateAt(rawData) {
  return rawData.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
}