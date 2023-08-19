'use client'
import styled from 'styled-components'
import { useEffect, useState  } from 'react';
import LineGraph from './LineGraph';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { generateFakeData, generateFakePercentageData } from '../../_lib/utils';

const LineGraphControlsStyled = createLineGraphControlsStyled()

// const sessions = new Map([
//   [newDate('2023-08-19'), 30],
//   [newDate('2023-08-18'), 30],
//   [newDate('2023-08-17'), 20],
//   [newDate('2023-08-16'), 50],
//   [newDate('2023-08-15'), 80],
//   [newDate('2023-08-14'), 40],
//   [newDate('2023-08-13'), 10],
//   [newDate('2023-08-12'), 120],
// ])

const allData = {
  Sessions: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  BounceRate: {
    dataMap: generateFakePercentageData('2023-08-19', 365),
    dataType: 'rate'
  },
  EngagedSessions: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  EngagedSessionsPerUser: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  EngagementRate: {
    dataMap: generateFakePercentageData('2023-08-19', 365),
    dataType: 'rate'
  },
  TotalUsers: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  NewUsers: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  ReturningUsers: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  Conversions: {
    dataMap: generateFakeData('2023-08-19', 365),
    dataType: 'number'
  },
  SessionConversionRate: {
    dataMap: generateFakePercentageData('2023-08-19', 365),
    dataType: 'rate'
  },
  UserConversionRate: {
    dataMap: generateFakePercentageData('2023-08-19', 365),
    dataType: 'rate'
  },
}

export default function LineGraphControls() {
  const [data, setData] = useState(Object.values(allData)[0]),
        [period, setPeriod] = useState('Last 7 days'),
        [showSelectionRange, setShowSelectionRange] = useState(false),
        initDateRage = {startDate: new Date(), endDate: new Date()},
        [dateRange, setDateRange] = useState(initDateRage),
        selectionRange = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          key: 'selection'
        }, [xInterval, setXinterval] = useState('day'),
        [total, setTotal] = useState('')

  const handlePeriodChange = (event) => {
    if (event.target.value === 'custom') {
      setShowSelectionRange(true)
    } else {
      setPeriod(event.target.value);
    }
  };

  const handleSelectionRange = event => {
    setDateRange({
      startDate: event.selection.startDate,
      endDate: event.selection.endDate
    })
  }

  const handleApplySelection = () => {
    setPeriod(dateRange)
    setShowSelectionRange(false)
  }

  const handleCancelSelection = () => {
    setDateRange(period.startDate?period:initDateRage)
    setShowSelectionRange(false)
  }

  const handleIntervalChange = (event) => {
    setXinterval(event.target.value)
  }

  const handleDataChange = (event) => {
    setData(allData[event.target.value.split(' ').join('')])
  }

  useEffect(() => {
    if (showSelectionRange) {
      setTimeout(() => {
        window.addEventListener('click', clickEvent)
      }, 1)
      
    }

    function clickEvent(e) {
      const div = document.getElementById('rangeDateSelector')
      const isDiv = div.contains(e.target)
      if (!isDiv) {
        handleCancelSelection()
      }
    }

    return () => {
      window.removeEventListener('click', clickEvent)
    }
  }, [showSelectionRange, handleCancelSelection])

  return (
    <LineGraphControlsStyled>
      <div className="controls">
        <div className="field">
          <select onChange={handleDataChange}>
            <option value="Sessions" defaultValue>Sessions</option>
            <option value="Bounce Rate">Bounce Rate</option>
            <option value="Engaged Sessions">Engaged Sessions</option>
            <option value="Engaged Sessions Per User">Engaged Sessions Per User</option>
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
        
        <div className="period">
          <div id="rangeDateSelector">
            {showSelectionRange && (
            <>
              <DateRangePicker 
                ranges={[selectionRange]}
                onChange={handleSelectionRange}
                moveRangeOnFirstSelection={true}
                // minDate={null}
                maxDate={new Date()}
              />
              <div>
                <button onClick={handleCancelSelection}>Cancel</button>
                <button onClick={handleApplySelection}>Apply</button>
              </div>
            </>)}
          </div>
          <select value={period} onChange={handlePeriodChange}>
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 28 days">Last 28 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="Last 12 months">Last 12 months</option>
            <option value={period} hidden>
              {period.startDate ? `${formatDate(period.startDate)} - ${formatDate(period.endDate)}` : period}
            </option>
            <option value="custom">custom</option>
          </select>
        </div>
        <div className="interval">
          <select value={xInterval} onChange={handleIntervalChange}>
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="month">month</option>]
          </select>
        </div>
      </div>
      <LineGraph data={data} period={period} xInterval={xInterval} setTotal={setTotal}/>
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

      .period {
        margin-right: .5em;
        position: relative;

        & > div:first-child {
          position: absolute;
          top: 0;
          left: 0;

          .rdrDefinedRangesWrapper {
            display: none;
          }
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