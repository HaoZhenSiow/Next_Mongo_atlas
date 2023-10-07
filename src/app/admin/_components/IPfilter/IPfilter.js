import styled from 'styled-components'
import _ from 'lodash'
import validator from 'validator'

import { useDataStore } from '../../_stateManagement/stores/dataStore'

import Table from '../Table'
import { useRef } from 'react'

const SessionsStyled = createSessionsStyled()

const table_headers = ['Number', 'Label', 'IP address', 'Remove']

export default function Sessions(props) {
  
  const { blockList } = useDataStore()
  const labelRef = useRef()
  const inputRef = useRef()
  const handleAdd = () => {
    if (labelRef.current.value && inputRef.current.value) {
      // blockList.push({
      //   label: labelRef.current.value,
      //   ip: inputRef.current.value
      // })
      console.log('add ip', validator.isIP(inputRef.current?.value))
    }
  }

  console.log(blockList)

  return (
    <SessionsStyled className={props.className}>
      <div className='controls'>
        <h2>IP address filter</h2>
        <div className='inputs'>
          <input type="text" name="label" placeholder="label" ref={labelRef}/>
          <input type="text" name="ip" placeholder="ip address" ref={inputRef}/>
          <button onClick={handleAdd}>Add</button>
          <button>Update</button>
        </div>
        
      </div>
      <div className='sessions__table'>
        <Table headers={table_headers}>
          <tr>
            <td>1</td>
            <td>hao kit</td>
            <td>1919200</td>
            <td>btn</td>
          </tr>
          <tr>
            <td>1</td>
            <td>hao kit</td>
            <td>1919200</td>
            <td>btn</td>
          </tr>
          <tr>
            <td>1</td>
            <td>hao kit</td>
            <td>1919200</td>
            <td>btn</td>
          </tr>
          {/* {pagination.sessions?.map((session, index) => {
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
          )} */}
        </Table>
      </div>
    </SessionsStyled>
  );
}

function createSessionsStyled() {
  return styled.div`
    /* .sessions__table {
      max-height: 600px;
      overflow-y: auto;
      position: relative;
    } */
    .controls {
      justify-content: space-between;
      align-items: center;
    }

    .inputs {
      & > * {
        margin-left: .5em;
      }
    }
    /* .load-more {
      cursor: pointer;
    } */
  `
}

function sortRawDataByDescUpdateAt(rawData) {
  return rawData.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
}