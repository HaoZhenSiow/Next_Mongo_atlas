import styled from 'styled-components'
import { useToggle } from '@mantine/hooks'
import { useEffect, useState, memo, Fragment, useRef } from 'react'
import { commafy } from 'commafy-anything'
import ResizeObserver from 'resize-observer-polyfill'

import { usePathExplorationStore } from '../../_stateManagement/stores/pathExplorationStore'

const DiagramStyled = createDiagramStyled()

export default function Diagram(props) {
  const { dataDisplayingObj } = usePathExplorationStore(),
        [viewBoxWidth, setViewBoxWidth] = useState(1000),
        [viewBoxHeight, setViewBoxHeight] = useState(0),
        sankeyDiagramRef = useRef()

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      // Ensure that the observer callback runs only when the size changes
      for (const entry of entries) {
        if (entry.contentRect.width !== viewBoxWidth || entry.contentRect.height !== viewBoxHeight) {
          setViewBoxHeight(entry.contentRect.height)
          entry.contentRect.width > 1000 ? setViewBoxWidth(entry.contentRect.width) : setViewBoxWidth(1000)
        }
      }
    });
  
    observer.observe(sankeyDiagramRef.current);
  
    return () => {
      // Cleanup: Disconnect the observer when the component unmounts
      observer.disconnect();
    };
  }, [sankeyDiagramRef, viewBoxWidth, viewBoxHeight])

  return (
    <DiagramStyled className={props.className} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} $width={viewBoxWidth}>
      <g ref={sankeyDiagramRef}>
        <Decendents
            lvl={2}
            genNext={dataDisplayingObj.next}
            prevX={0}
            prevY={0}
            prevLength={dataDisplayingObj.length}
            prevHeight={300}
            viewBoxHeight={viewBoxHeight}/>
        <rect x={0} y={0} width={15} height={300} lvl={1}/>
        <text>
          <tspan x={20} y={15} className="pathText">Session Start</tspan>
          <tspan x={20} dy={15} className="dataText">{commafy(dataDisplayingObj.length)}</tspan>
        </text>
      </g>
    </DiagramStyled>
  )
}

const Decendents = memo(function ({ genNext, lvl, prevLength, prevHeight, prevX, prevY, setPrevGap }) {

  // console.log(genNext)
  const [pagination, setPagination] = useState(5),
        next = genNext(),
        keys = Object.keys(next),
        hiddenKeysNo = keys.length - pagination,
        sortedKeys = sortKeys(keys, next)

  const [expandStates, setExpandStates] = useState(sortedKeys.map(() => lvl === 2 ? true : false)),
        [bottomGaps, setBottomGaps] = useState(sortedKeys.map(() => 5))

  const toggleExpand = (key) => {
    setExpandStates(prevArr => {
      const newArr = [...prevArr]
      newArr[key] = !prevArr[key]
      return newArr
    })
  }

  const setBotGap = function (key) {
    return function (newGap) {
      setBottomGaps(prevArr => {
        console.log(newGap)
        const newArr = [...prevArr]
        newArr[key] = newGap
        return newArr
      })
    }
  }

  let y = prevY,
      chop = prevY

  // const sss = sortedKeys.reduce((prev, key, idx) => {
  //   if (idx > pagination) return prev

  //   const newObj = structuredClone(prev),
  //         currentLength = idx === pagination ? getRemaining(keys) : next[key].length,
  //         currentHeight = currentLength/prevLength*prevHeight >= 1 ? currentLength/prevLength*prevHeight : 1

  //   if (!expandStates[idx] && currentHeight < 30) {
  //     newObj.y = prev.y + (35 - currentHeight) + currentHeight
  //   } else if (!expandStates[idx]) {
  //     newObj.y = prev.y + 5 + currentHeight
  //   } else {
  //     newObj.y = prev.y + bottomGaps[idx] + currentHeight
  //   }

  //   newObj.chop = prev.chop + currentHeight

  //   return newObj

  // }, { y: prevY, chop: prevY})

  // useEffect(() => {
  //   setPrevGap && setPrevGap(y - prevY - prevHeight)
  // })

  // console.log(y, chop)

  return sortedKeys.map((key, idx) => {
    const currentX = (lvl - 1) * 200,
          currentY = y,
          currentLength = idx === pagination ? getRemaining(keys) : next[key].length,
          currentHeight = currentLength/prevLength*prevHeight >= 1 ? currentLength/prevLength*prevHeight : 1,
          currentNext = next[key].next

    // const onClick = () => {
    //   if (idx === pagination) { setPagination(prev => prev + 5); }
    //   else if (currentNext) {toggleExpand(idx);}
    // }

    if (idx <= pagination) {
      if (!expandStates[idx] && currentHeight < 30) {
        y += (35 - currentHeight) + currentHeight
      } else if (!expandStates[idx]) {
        y += 5 + currentHeight
      } else {
        y += bottomGaps[idx] + currentHeight
      }

      chop += currentHeight
    }

    if (idx > pagination) return

    if (idx === pagination || idx === sortedKeys.length - 1) {
      // setBotGap(idx)(y - prevY - prevHeight)
      console.log(sortedKeys[idx], 'set bot gap')
    }

    if (idx <= pagination) {
    //   return (
    //     <g key={lvl + key}>
    //       {expandStates[idx] && <Decendents next={currentNext} lvl={lvl+1} prevLength={currentLength} prevHeight={currentHeight} prevX={currentX} prevY={currentY} setPrevGap={setBotGap(idx)}/>}
    //       <rect x={currentX} y={currentY} width={15} height={currentHeight} onClick={onClick} className={currentNext?'pointer':''}/>
    //       <text onClick={onClick} className={currentNext?'pointer':''}>
    //         <tspan x={currentX + 20} y={currentY + 10} className={`${idx === pagination ? 'plus' : ''} pathText`}>{idx === pagination ? `+${hiddenKeysNo} more` : key}</tspan>
    //         <tspan x={currentX + 20} dy={15} className="dataText">{commafy(currentLength)}</tspan>
    //       </text>
    //       <path d={`M${prevX+15},${chop - currentHeight} 
    //                 C${cubicBezierCurve(prevX+15, chop - currentHeight, currentX, currentY)}
    //                 L${currentX},${currentY+currentHeight}
    //                 C${cubicBezierCurve(currentX, currentY+currentHeight, prevX+15, chop)}
    //                 L${prevX+15},${chop - currentHeight}`}/>
    //     </g>
    //   )
    return <Decendent lvl={lvl} key={lvl + key} keyName={key} idx={idx} expandStates={expandStates} currentNext={currentNext} currentLength={currentLength} currentHeight={currentHeight} currentX={currentX} currentY={currentY} setBotGap={setBotGap} pagination={pagination} hiddenKeysNo={hiddenKeysNo} prevX={prevX} chop={chop} toggleExpand={toggleExpand} setPagination={setPagination}/>
    }
  })

  function getRemaining(keys) {
    return keys.reduce((prev, key, idx) => {
      if (idx < pagination) return prev
      return prev + next[key].length
    }, 0)
  }
})

function createDiagramStyled() {
  return styled.svg.attrs(props => {
    const width = props.$width || 1000
    const extrinsicWidth = width > 1000 ? (width/1000)*100 + '%' : '100%'
    return {
      $extrinsicWidth: extrinsicWidth
    }
  })`
    width: ${props => props.$extrinsicWidth};

    text {
      fill: white;
      font-size: .8em;
    }

    .dataText {
      font-weight: bold;
    }

    path {
      pointer-events: none;
      fill: aliceblue;
      fill-opacity: .2;
    }

    .pointer {
      cursor: pointer;
    }

    rect, .plus {
      fill: var(--matrix2-color);
    }

    g:has(rect:hover, text:hover) {
      & > rect { filter: saturate(3); }
      & > path { filter: saturate(3); fill-opacity: .4; }
    }

    *, tspan {
      transition: y 1s ease 0s, d 1s ease 0s, x 1s ease 0s;
    }

  `
}


function Decendent({lvl, idx, expandStates, currentNext, currentLength, currentHeight, currentX, currentY, setBotGap, pagination, hiddenKeysNo, prevX, chop, keyName, toggleExpand, setPagination}) {
  // const currentX = (lvl - 1) * 200,
  //         currentY = y,
  //         currentLength = idx === pagination ? getRemaining(keys) : next[key].length,
  //         currentHeight = currentLength/prevLength*prevHeight >= 1 ? currentLength/prevLength*prevHeight : 1,
  //         currentNext = next[key].next

  const onClick = () => {
    if (idx === pagination) { setPagination(prev => prev + 5); }
    else if (currentNext) {toggleExpand(idx);}
  }

  return(
    <g>
      {expandStates[idx] && <Decendents genNext={currentNext} lvl={lvl+1} prevLength={currentLength} prevHeight={currentHeight} prevX={currentX} prevY={currentY} setPrevGap={setBotGap(idx)}/>}
      <rect x={currentX} y={currentY} width={15} height={currentHeight} onClick={onClick} className={currentNext?'pointer':''}/>
      <text onClick={onClick} className={currentNext?'pointer':''}>
        <tspan x={currentX + 20} y={currentY + 10} className={`${idx === pagination ? 'plus' : ''} pathText`}>{idx === pagination ? `+${hiddenKeysNo} more` : keyName}</tspan>
        <tspan x={currentX + 20} dy={15} className="dataText">{commafy(currentLength)}</tspan>
      </text>
      <path d={`M${prevX+15},${chop - currentHeight} 
                C${cubicBezierCurve(prevX+15, chop - currentHeight, currentX, currentY)}
                L${currentX},${currentY+currentHeight}
                C${cubicBezierCurve(currentX, currentY+currentHeight, prevX+15, chop)}
                L${prevX+15},${chop - currentHeight}`}/>
    </g>
  )
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