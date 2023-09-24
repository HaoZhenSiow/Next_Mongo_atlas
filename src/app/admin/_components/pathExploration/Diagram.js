import styled from 'styled-components'
import { useToggle } from '@mantine/hooks'
import { Fragment, forwardRef, useEffect, useImperativeHandle, useRef, useState, memo } from 'react';

import { usePathExplorationStore } from '../../_stateManagement/stores/pathExplorationStore';

const DiagramStyled = createDiagramStyled()

export default function Diagram(props) {
  const { dataDisplayingObj } = usePathExplorationStore(),
        width = 1000,
        height = 800,
        lvl = 1  

  return (
    <DiagramStyled className={props.className} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={15} height={300} fill='white' lvl={lvl}/>
      <Decendents next={dataDisplayingObj.next} lvl={lvl+1} prevLength={dataDisplayingObj.length} prevHeight={300}/>
    </DiagramStyled>
  );
}

function createDiagramStyled() {
  return styled.svg`
    /* width: 100%; */
    background-color: black;
  `
}

const Decendents = memo(function ({ next, lvl, prevLength, prevHeight, prevY, setPrevGap }) {
  const keys = Object.keys(next)
  keys.sort((a, b) => {
    let x = next[a].length,
        y = next[b].length

    return y - x
  })

  let y = prevY || 0

  return keys.map(key => {
    const [expanded, toggleExpanded] = useToggle([false, true]),
          [gap, setGap] = useState(10)

    const currentY = y,
          currentLength = next[key].length,
          currentHeight = currentLength/prevLength*prevHeight >= 1 ? currentLength/prevLength*prevHeight : 1,
          currentNext = next[key].next

    y += currentHeight
    expanded ? y += gap : y += 10
  
    useEffect(() => {
      setPrevGap && setPrevGap(keys.length * 10)
    }, [y])


    return <g key={lvl + key}>
      <rect x={(lvl - 1) * 200} y={currentY} width={15} height={currentHeight} fill="white" onClick={() => toggleExpanded()}/>
      {(expanded && currentNext) && <Decendents next={currentNext} lvl={lvl+1} prevLength={currentLength} prevHeight={currentHeight} prevY={currentY} setPrevGap={setGap}/>}
    </g>
  })
})