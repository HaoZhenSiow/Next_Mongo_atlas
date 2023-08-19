'use client'

import styled from 'styled-components'
import react, { Fragment, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { newDate, getMedium, createDateArr, getVisibleDates, groupData } from '../../_lib/utils'

const LineGraphStyled = createLineGraphStyled(),
      viewBoxWidth = 1000,
      viewBoxHeight = 200

export default react.memo(LineGraph)
function LineGraph({ data, period, xInterval, setTotal }) {
  const { dataMap, dataType } = data,
        dateArr = createDateArr(period),
        dataRef = useRef(),
        [polyline, setPolyline] = useState('')
  let total = 0
  
  dateArr.forEach(date => {
    if (dataMap.get(newDate(date.fullDate))) {
      total += dataMap.get(newDate(date.fullDate))
    }
  })

  if (dataType === 'rate') {
    total = Math.round((total / dateArr.length) * 100) / 100 + '%'
  }

  useEffect(() => {
    setTotal(total)
    setPolyline(dataRef.current.getPolyline())
  }, [data, period, xInterval])
  
  return (
    <LineGraphStyled viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      {createYlabel(dataMap, dataType, xInterval)}
      {insertDateLabels(dateArr)}
      <polyline points={polyline} strokeWidth="1" fill='none'/>
      <InsertData ref={dataRef} dateArr={dateArr} xInterval={xInterval} rawData={dataMap}/>
    </LineGraphStyled>
  );
}

function createLineGraphStyled() {
  return styled.svg`
    width: 100%;
    background-color: var(--bg-color);
    overflow: visible;

    polyline, line {
      stroke: var(--text-color);
    }

    line.dime-line {
      opacity: .5;
    }

    circle {
      fill: var(--text-color);
      opacity: 0;
    }

    .data-points {
      line { opacity: 0 }

      &:hover {
        line { opacity: .5 }
        circle, rect, text.label { opacity: 1 }
      }
    }

    rect {
      fill: var(--bg-color2);
      opacity: 0;
    }

    text {
      fill: var(--text-color);
    }

    text.label {
      fill: var(--bg-color);
      opacity: 0;

      tspan:nth-child(1) {
        font-size: .8em;
      }

      tspan:nth-child(2) {
        font-weight: 700;
      }
    }
  `
}

function createYlabel(rawData, dataType, xInterval) {
  const data = groupData(rawData, xInterval),
  { medium, unit } = getMedium(data),
  displayUnit = dataType === 'rate' ? '%' : unit

  return (
    <>
      <line className='dime-line' x1="0" y1="0%" x2="1000" y2="0%" strokeWidth="1"/>
      <line className='dime-line' x1="0" y1="20%" x2="1000" y2="20%" strokeWidth="1"/>
      <line className='dime-line' x1="0" y1="40%" x2="1000" y2="40%" strokeWidth="1"/>
      <line className='dime-line' x1="0" y1="60%" x2="1000" y2="60%" strokeWidth="1"/>
      <line x1="0" y1="80%" x2="1000" y2="80%" strokeWidth="1"/>
      <text x="100%" y="2%" textAnchor="end" alignmentBaseline="hanging">{(medium*2)+displayUnit}</text>
      <text x="100%" y="22%" textAnchor="end" alignmentBaseline="hanging">{(medium/2*3)+displayUnit}</text>
      <text x="100%" y="42%" textAnchor="end" alignmentBaseline="hanging">{medium+displayUnit}</text>
      <text x="100%" y="62%" textAnchor="end" alignmentBaseline="hanging">{(medium/2)+displayUnit}</text>
      <text x="100%" y="82%" textAnchor="end" alignmentBaseline="hanging">0</text>
    </>
  )
}

const InsertData = forwardRef(({ dateArr, xInterval, rawData }, ref) => {
  const visibleDates = getVisibleDates(dateArr, xInterval),
        visibleDatesCount = visibleDates.length > 1 ? visibleDates.length - 1 : 1,
        data = groupData(rawData, xInterval),
        { medium, unitVal } = getMedium(data),
        high = medium * 2 * unitVal

  let polyline = ''

  useImperativeHandle(ref, () => ({
    getPolyline() {
      return polyline
    }
  }))
  
  return dateArr.map((date, index) => {
    const posX = index / (dateArr.length - 1) * 0.95 * viewBoxWidth,
          areaWidth = 0.95 * viewBoxWidth / visibleDatesCount,
          dateStr = newDate(date.fullDate),
          dataVal = data.get(dateStr) ? data.get(dateStr) : 0,
          dataPos = (Math.abs(dataVal-high) / high) * 80,
          dataPosStr = dataPos + '%',
          labelPosY = dataPos + 10 + '%',
          rectPosY = dataPos + 5 + '%'
    
    if (visibleDates.includes(dateStr)) {
      polyline += ` ${posX},${dataPos/100 * viewBoxHeight} `

      return (
        <g key={index} className='data-points'>
          <rect x={posX-areaWidth/2} y="0%" width={areaWidth} height="80%" fillOpacity={0}/>
          <line x1={posX} y1="0%" x2={posX} y2="80%" strokeWidth="1"/>
          <circle cx={posX} cy={dataPosStr} r="5"/>
          <rect x={posX - 40} y={rectPosY} width="80" height="60" rx={5}/>
          <text className='label'>
            <tspan x={posX} dy={labelPosY} textAnchor="middle" alignmentBaseline="hanging">{date.day + ' ' + date.month}</tspan>
            <tspan x={posX} dy="1.2em" textAnchor="middle" alignmentBaseline="hanging">{dataVal}</tspan>
          </text>
        </g>
      )
    }
  
    return null
  })
})

function insertDateLabels(dateArr) {
  return dateArr.map((date, index) => {
    const posX = index/(dateArr.length-1) * 0.95 * viewBoxWidth,
          textAnchor = index === 0 ? 'start' : 'middle'
    if (date.showdate) {
      return (
        <Fragment key={index}>
          <line x1={posX} y1="78%" x2={posX} y2="82%" strokeWidth="1"/>
          <text>
            <tspan x={posX} dy="82%" textAnchor={textAnchor} alignmentBaseline="hanging">{date.day}</tspan>
            <tspan x={posX} dy="1em" textAnchor={textAnchor} alignmentBaseline="hanging">{date.month}</tspan>
          </text>
        </Fragment>
    )}
  })
}