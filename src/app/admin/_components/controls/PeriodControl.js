import styled from 'styled-components'
import { useState, memo  } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import { useClickOutside } from '@mantine/hooks'

const PeriodControlStyled = createPeriodControlStyled()

export default memo(PeriodControl)

function PeriodControl({ store }) {
  const { period, startDate, endDate, setState } = store()

  const customDateRange = period.startDate && dayjs(period.startDate).format('Do MMM') + ' - ' + dayjs(period.endDate).format('Do MMM')

  const [showSelectionRange, setShowSelectionRange] = useState(false),
        initDateRage = {startDate: new Date(), endDate: new Date()},
        [dateRange, setDateRange] = useState(initDateRage),
        selectionRange = {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          key: 'selection'
        }

  const handlePeriodChange = (event) => {
    const isNotCustom = event.target.value !== 'custom'
    if (isNotCustom) return setState('period', event.target.value)
    setShowSelectionRange(true)
  }

  const handleSelectionRange = event => {
    setDateRange({
      startDate: event.selection.startDate,
      endDate: event.selection.endDate
    })
    setState('startDate', event.selection.startDate)
    setState('endDate', event.selection.endDate)
  }

  const handleApplySelection = () => {
    setState('period', { startDate, endDate })
    setShowSelectionRange(false)
  }

  const handleCancelSelection = () => {
    setDateRange(period.startDate?period:initDateRage)
    setShowSelectionRange(false)
  }

  const dateRangeSelectorRef = useClickOutside(handleCancelSelection)

  return (
    <PeriodControlStyled>
      <div id="rangeDateSelector" ref={dateRangeSelectorRef}>
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
        {period.startDate && <option value={period}>{customDateRange}</option>}
        <option value="custom">custom</option>
      </select>
    </PeriodControlStyled>
  );
}

function createPeriodControlStyled() {
  return styled.div`
    position: relative;

    #rangeDateSelector {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 99;

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