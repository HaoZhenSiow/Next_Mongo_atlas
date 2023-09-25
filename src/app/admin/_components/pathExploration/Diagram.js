import styled from 'styled-components'
import { useToggle } from '@mantine/hooks'
import { useEffect, useState, memo, Fragment } from 'react'
import { commafy } from 'commafy-anything'

import { usePathExplorationStore } from '../../_stateManagement/stores/pathExplorationStore'

const DiagramStyled = createDiagramStyled()

export default function Diagram(props) {
  const { dataDisplayingObj } = usePathExplorationStore(),
        width = 1000,
        height = 800,
        lvl = 1  

  return (
    <DiagramStyled className={props.className} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={15} height={300} fill='white' lvl={lvl}/>
      <text>
        <tspan x={20} y={15} className="pathText">Session Start</tspan>
        <tspan x={20} dy={15} className="dataText">{commafy(dataDisplayingObj.length)}</tspan>
      </text>
      <Decendents
        lvl={lvl+1}
        next={dataDisplayingObj.next}
        prevX={0}
        prevY={0}
        prevLength={dataDisplayingObj.length}
        prevHeight={300}/>
    </DiagramStyled>
  );
}

const Decendents = memo(function ({ next, lvl, prevLength, prevHeight, prevX, prevY, setPrevGap }) {
  const [pagination, setPagination] = useState(5),
        keys = Object.keys(next),
        hiddenKeysNo = keys.length - pagination,
        sortedKeys = sortKeys(keys, next)

  let y = prevY,
      chop = prevY

  return sortedKeys.map((key, idx) => {
    const [expanded, toggleExpanded] = useToggle([false, true]),
          [gap, setGap] = useState(10)

    const remaining = keys.reduce((prev, key, idx) => {
            if (idx < pagination) return prev
            return prev + next[key].length
          }, 0)

    const currentX = (lvl - 1) * 200,
          currentY = y,
          currentLength = idx === pagination ? remaining : next[key].length,
          currentHeight = currentLength/prevLength*prevHeight >= 1 ? currentLength/prevLength*prevHeight : 1,
          currentNext = next[key].next

    const onClick = () => {
      if (currentNext && idx !== pagination) { toggleExpanded() }
      if (idx === pagination) { setPagination(prev => prev + 5) }
    }

    useEffect(() => {
      setPrevGap && setPrevGap(y - prevY - prevHeight)
    }, [y])

    useEffect(() => {
        lvl === 2  && toggleExpanded()
    }, [lvl])

    if (idx <= pagination) {
      if (!expanded && currentHeight < 30) {
        y += (40 - currentHeight) + currentHeight
      } else if (!expanded) {
        y += 10 + currentHeight
      } else {
        y += gap + currentHeight
      }

      chop += currentHeight

      return <Fragment key={lvl + key}>
        <g onClick={onClick} className={currentNext?'pointer':''}>
          <path d={`M${prevX+15},${chop - currentHeight} 
                    C${cubicBezierCurve(prevX+15, chop - currentHeight, currentX, currentY)}
                    L${currentX},${currentY+currentHeight}
                    C${cubicBezierCurve(currentX, currentY+currentHeight, prevX+15, chop)}
                    L${prevX+15},${chop - currentHeight}
                    `} fill='white' fillOpacity={.5}/>
          <rect x={currentX} y={currentY} width={15} height={currentHeight} fill="white"/>
          <text>
            <tspan x={currentX + 20} y={currentY + 10} className="pathText">{idx === pagination ? `+${hiddenKeysNo} more` : key}</tspan>
            <tspan x={currentX + 20} dy={15} className="dataText">{commafy(currentLength)}</tspan>
          </text>
        </g>
        {expanded && <Decendents next={currentNext} lvl={lvl+1} prevLength={currentLength} prevHeight={currentHeight} prevX={currentX} prevY={currentY} setPrevGap={setGap}/>}
      </Fragment>
    }
  })
})

function createDiagramStyled() {
  return styled.svg`
    /* width: 100%; */
    background-color: black;

    text {
      fill: white;
      font-size: .8em;
    }

    .dataText {
      font-weight: bold;
    }

    path {
      pointer-events: none;
    }

    g.pointer {
      cursor: pointer;
    }
  `
}

function sortKeys(keys, next) {
  return keys.sort((a, b) => {
    const x = next[a].length,
          y = next[b].length

    return y - x
  })
}

function cubicBezierCurve(initialX, initialY, endX, endY) {
  return `
    ${calcPoint(initialX, endX, .5)},${calcPoint(initialY, endY, .05)}
    ${calcPoint(initialX, endX, .5)},${calcPoint(initialY, endY, .95)}
    ${endX},${endY}
  `

  function calcPoint(start, end, pos) {
    return ((end - start) * pos) + start
  }
}