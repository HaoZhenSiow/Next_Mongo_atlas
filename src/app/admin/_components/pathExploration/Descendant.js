import { useEffect, useRef, useState, memo } from "react"
import { useToggle } from "@mantine/hooks"
import ResizeObserver from "resize-observer-polyfill"
import { commafy } from "commafy-anything"

import Descendants from "./Descendants"

const Descendant = memo(function ({ keyName, lvl, length, precedingSiblingsLength, ancestorPosX, ancestorPosY, ancestorLength, ancestorHeight, genNext }) {
  const groupRef = useRef(),
        [prevGroupHeight, setPrevGroupHeight] = useState(ancestorPosY),
        defaultExpansion = lvl <= 2 ? [true, false] : [false, true],
        [expansion, toggleExpansion] = useToggle(defaultExpansion)

  const posX = (lvl - 1) * 200,
        height = length/ancestorLength*ancestorHeight >= 1 ? length/ancestorLength*ancestorHeight : 1

  const pointer = genNext ? 'pointer' : '',
        onExpansionClick = genNext ? () => toggleExpansion() : null

  useEffect(() => {
    const prevSibling = groupRef.current.previousSibling,
          parent = groupRef.current.parentNode,
          parentPrevSibling = parent.previousSibling

    const observer = new ResizeObserver(entries => {
      const bbox = prevSibling.getBBox(),
            newPosY = bbox.y + bbox.height + 5

      if (newPosY !== prevGroupHeight) {
        setPrevGroupHeight(newPosY)
      }
    })

    const observer2 = new ResizeObserver(entries => {
      const bbox = parentPrevSibling.getBBox(),
            newPosY = bbox.y + bbox.height + 5

      if (newPosY !== prevGroupHeight) {
        setPrevGroupHeight(newPosY)
      }
    })
  
    if (prevSibling?.tagName === 'g') {
      observer.observe(prevSibling)
    } else if (parentPrevSibling?.tagName === 'g') {
      observer2.observe(parentPrevSibling)
    }

    return () => observer.disconnect()
  })

  const pathStartX = ancestorPosX+15,
        pathStartY = ancestorPosY + precedingSiblingsLength/ancestorLength*ancestorHeight

  return (
    <g ref={groupRef}>
      <g onClick={onExpansionClick}>
        <rect className={pointer} x={posX} y={prevGroupHeight} width={15} height={height}/>
        <text className={pointer}>
          <tspan x={posX + 20} y={prevGroupHeight + 15}>
            {keyName}
          </tspan>
          <tspan x={posX + 20} dy={15} className="dataText">{commafy(length)}</tspan>
        </text>
      </g>
      <path d={`M${pathStartX}, ${pathStartY}
                C${cubicBezierCurve(pathStartX, pathStartY, posX, prevGroupHeight)}
                L${posX}, ${prevGroupHeight+height}
                C${cubicBezierCurve(posX, prevGroupHeight+height, pathStartX, pathStartY + height)}
                `}
      />
      {expansion && 
      <Descendants
        lvl={lvl+1}
        next={genNext ? genNext() : null}
        ancestorPosX={posX}
        ancestorPosY={prevGroupHeight}
        ancestorLength={length}
        ancestorHeight={height}/>}
    </g>
  )
})

export default Descendant

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