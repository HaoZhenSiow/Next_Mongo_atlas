import styled from 'styled-components'
import { useEffect, useState  } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

import { useLineChartStore } from '@/app/admin/_store/lineChartStore';

const PeriodControlStyled = createPeriodControlStyled()

export default function PeriodControl(props) {
  const { period, startDate, endDate, setPeriod, setStartDate, setEndDate } = useLineChartStore()

  const [showSelectionRange, setShowSelectionRange] = useState(false),
        initDateRage = {startDate: new Date(), endDate: new Date()},
        [dateRange, setDateRange] = useState(initDateRage),
        selectionRange = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          key: 'selection'
        }

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
    setStartDate(event.selection.startDate)
    setEndDate(event.selection.endDate)
  }

  const handleApplySelection = () => {
    setPeriod({ startDate, endDate })
    setShowSelectionRange(false)
  }

  const handleCancelSelection = () => {
    setDateRange(period.startDate?period:initDateRage)
    setShowSelectionRange(false)
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
    <PeriodControlStyled>
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
    </PeriodControlStyled>
  );
}

function createPeriodControlStyled() {
  return styled.div`
    position: relative;

    & > div:first-child {
      position: absolute;
      top: 0;
      left: 0;

      .rdrDefinedRangesWrapper {
        display: none;
      }
    }
  `
}

function formatDate(fullDate) {
  const day = String(fullDate.getDate()).padStart(2, '0')
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(fullDate)
  return day + ' ' + month
}