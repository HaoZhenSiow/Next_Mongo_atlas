import { str } from "../../_lib/utils"

import { useLineChartStore } from "../../_store/lineChartStore"

const InsertData = () => {
  const { viewBoxWidth, dateArr, dataPointDates, dataAreas, dataDisplayingMap, medium } = useLineChartStore(),
        high = medium.value * 2 * medium.unitVal


  return dateArr.map((date, index) => {
    const posX = index / (dateArr.length - 1) * 0.95 * viewBoxWidth,
          areaWidth = 0.95 * viewBoxWidth / dataAreas,
          dateStr = str(date.fullDate),
          dataVal = dataDisplayingMap.get(dateStr) ? dataDisplayingMap.get(dateStr) : 0,
          dataPos = (Math.abs(dataVal-high) / high) * 80,
          dataPosStr = dataPos + '%',
          labelPosY = dataPos + 10 + '%',
          rectPosY = dataPos + 5 + '%'

    if (dataPointDates.includes(dateStr)) {
     
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
}

export default InsertData