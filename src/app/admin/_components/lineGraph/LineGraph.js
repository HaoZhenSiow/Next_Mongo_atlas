'use client'

import styled from 'styled-components'
import react from 'react'

import { useLineChartStore } from '../../_stateManagement/stores/lineChartStore'

import DateLabels from './DateLabels'
import InsertData from './InsertData'
import YaxisLabel from './YaxisLabel'

const LineGraphStyled = createLineGraphStyled()

export default react.memo(LineGraph)
function LineGraph() {
  const { viewBoxWidth, viewBoxHeight, dateArr, polyline, polyline2 } = useLineChartStore()

  return (
    <LineGraphStyled viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <YaxisLabel/>
      <DateLabels dateArr={dateArr}/>
      <polyline className='polyline--matrix1' points={polyline} strokeWidth="1" fill='none'/>
      <polyline className='polyline--matrix2' points={polyline2} strokeWidth="1" fill='none'/>
      <InsertData/>
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

    line.dime-line {
      opacity: .5;
    }

    polyline { stroke-width: 2 }
    polyline.polyline--matrix1 { stroke: var(--matrix1-color) }
    polyline.polyline--matrix2 { stroke: var(--matrix2-color) }

    circle {
      opacity: 0;

      &.matrix1 { fill: var(--matrix1-color) }
      &.matrix2 { fill: var(--matrix2-color) }
    }

    .data-points {
      line { opacity: 0 }

      &:hover {
        line { opacity: .5 }
        circle, rect, text.label { opacity: 1 }
      }
    }

    rect {
      opacity: 0;
    }

    rect.label {
      fill: var(--bg-color);
      stroke: var(--text-color);
    }

    text {
      fill: var(--text-color);
    }

    text.label {
      fill: var(--text-color);
      opacity: 0;

      tspan:nth-child(1) {
        font-size: .8em;
      }

      tspan:nth-child(2) {
        fill: var(--matrix1-color);
      }

      tspan:nth-child(3) {
        fill: var(--matrix2-color);
      }
    }
  `
}