'use client'

import styled from 'styled-components'
import react from 'react'

import { useLineChartStore } from '../../_store/lineChartStore'

import DateLabels from './DateLabels'
import InsertData from './InsertData'
import YaxisLabel from './YaxisLabel'

const LineGraphStyled = createLineGraphStyled()

export default react.memo(LineGraph)
function LineGraph() {
  const { viewBoxWidth, viewBoxHeight, dateArr, polyline } = useLineChartStore()

  return (
    <LineGraphStyled viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <YaxisLabel/>
      <DateLabels dateArr={dateArr}/>
      <polyline points={polyline} strokeWidth="1" fill='none'/>
      <InsertData/>
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