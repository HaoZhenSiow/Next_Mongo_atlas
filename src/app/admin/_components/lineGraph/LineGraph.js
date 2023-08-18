'use client'

import styled from 'styled-components'
import react, { Fragment } from 'react'
import { newDate, getMedium, createDateArr } from '../../_lib/utils'

const LineGraphStyled = createLineGraphStyled(),
      viewBoxWidth = 1000,
      viewBoxHeight = 200

// const sessions = new Map([
//   [newDate('2023-08-18'), 30],
//   [newDate('2023-08-17'), 20],
//   [newDate('2023-08-16'), 50],
//   [newDate('2023-08-15'), 80],
//   [newDate('2023-08-14'), 40],
//   [newDate('2023-08-13'), 10],
//   [newDate('2023-08-12'), 120],
// ])

const fakeSessions = new Map();

const startDate = new Date('2023-08-18');
for (let i = 0; i < 365; i++) {
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() - i);
  const randomSessions = Math.floor(Math.random() * 150); // Generate random session count
  fakeSessions.set(newDate(currentDate), randomSessions);
}

// console.log(fakeSessions)
export default react.memo(LineGraph)
function LineGraph({ period, xInterval }) {
  return (
    <LineGraphStyled viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      {createYlabel(fakeSessions)}
      {insertDateLabels(period)}
      {insertData(period, xInterval, fakeSessions)}
    </LineGraphStyled>
  );
}

function createLineGraphStyled() {
  return styled.svg`
    width: 100%;
    background-color: var(--bg-color);
    overflow: visible;

    line {
      stroke: var(--text-color);
    }

    circle {
      fill: var(--text-color);
    }

    .data-highlight {
      opacity: 0;
    }

    .data-points {
      line { opacity: 0 }

      &:hover {
        line { opacity: .5 }

        .data-highlight {
          opacity: .5;
        }
      }
    }

    text {
      fill: var(--text-color);
    }
  `
}

function createYlabel(data) {
  const { medium, unit } = getMedium(data)

  return (
    <>
      <line x1="0" y1="0%" x2="1000" y2="0%" strokeWidth="1"/>
      <line x1="0" y1="20%" x2="1000" y2="20%" strokeWidth="1"/>
      <line x1="0" y1="40%" x2="1000" y2="40%" strokeWidth="1"/>
      <line x1="0" y1="60%" x2="1000" y2="60%" strokeWidth="1"/>
      <line x1="0" y1="80%" x2="1000" y2="80%" strokeWidth="1"/>
      <text x="100%" y="2%" textAnchor="end" alignmentBaseline="hanging">{(medium*2)+unit}</text>
      <text x="100%" y="22%" textAnchor="end" alignmentBaseline="hanging">{(medium/2*3)+unit}</text>
      <text x="100%" y="42%" textAnchor="end" alignmentBaseline="hanging">{medium+unit}</text>
      <text x="100%" y="62%" textAnchor="end" alignmentBaseline="hanging">{(medium/2)+unit}</text>
      <text x="100%" y="82%" textAnchor="end" alignmentBaseline="hanging">0</text>
    </>
  )
}

function insertData(period, xInterval, data = []) {
  const dateArr = createDateArr(period),
        { medium } = getMedium(data),
        high = medium * 2

  return dateArr.map((date, index) => {
    const posX = index / (dateArr.length - 1) * 0.95 * viewBoxWidth,
          areaWidth = 0.95 * viewBoxWidth / (dateArr.length - 1),
          dataVal = data.get(newDate(date.fullDate)),
          dataPos = (Math.abs(dataVal-high) / high) * 80 + '%'
    let condition = false

    switch (xInterval) {
      case 'week':
        condition = date.fullDate.getDay() === 0
        break
      case 'month':
        condition = date.fullDate.getDate() === 1
        break
      default:
        condition = true
    }
  
    if (condition) {
      return (
        <g key={index} className='data-points'>
          <rect x={posX-areaWidth/2} y="0%" width={areaWidth} height="80%" fillOpacity={0}/>
          <line x1={posX} y1="0%" x2={posX} y2="80%" strokeWidth="1"/>
          {dataVal && (
            <>
              <circle cx={posX} cy={dataPos} r="5"/>
              <circle className='data-highlight' cx={posX} cy={dataPos} r="10"/>
            </>
          )}
        </g>
      )
    }
  
    return null
  })
}

function insertDateLabels(period) {
  const dateArr = createDateArr(period)

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