import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react'
import { commafy } from 'commafy-anything'
import ResizeObserver from 'resize-observer-polyfill'

import Descendants from './Descendants'

import { usePathExplorationStore } from '../../_stateManagement/stores/pathExplorationStore'

const DiagramStyled = createDiagramStyled()

export default function Diagram2(props) {
  const { dataDisplayingObj } = usePathExplorationStore(),
        [viewBoxWidth, setViewBoxWidth] = useState(1000),
        [viewBoxHeight, setViewBoxHeight] = useState(600),
        next = dataDisplayingObj.next ? dataDisplayingObj.next() : null,
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
      observer.disconnect();
    };
  }, [sankeyDiagramRef])

  return (
  <DiagramStyled viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} $width={viewBoxWidth}>
    <g ref={sankeyDiagramRef}>
      <Descendants
          lvl={2}
          next={next}
          ancestorPosX={0}
          ancestorPosY={0}
          ancestorLength={dataDisplayingObj.length}
          ancestorHeight={300}/>
      <rect x={0} y={0} width={15} height={300} lvl={1} id='path-exploration'/>
      <text>
        <tspan x={20} y={15} className="pathText">Session Start</tspan>
        <tspan x={20} dy={15} className="dataText">{commafy(dataDisplayingObj.length)}</tspan>
      </text>
    </g>
  </DiagramStyled>)
}

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
      fill-opacity: .3;
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

    /* *, tspan {
      transition: y 0s ease 0s, d 0s ease 0s, x 0s ease 0s;
    } */

  `
}