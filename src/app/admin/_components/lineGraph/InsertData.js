import { str } from "../../_lib/utils"

import { useLineChartStore } from "../../_stateManagement/stores/lineChartStore"

const InsertData = () => {
  const { viewBoxWidth, viewBoxHeight, dateArr, dataPointDates, dataAreas, dataDisplayingMap, dataDisplayingMap2, dataDisplayingType, medium } = useLineChartStore(),
        high = medium.value * 2 * medium.unitVal


  return dateArr.map((date, index) => {
    const posX = index / (dateArr.length - 1) * 0.95 * viewBoxWidth,
          areaWidth = 0.95 * viewBoxWidth / dataAreas,
          dateStr = str(date.fullDate),
          dataVal = dataDisplayingMap.get(dateStr) ? dataDisplayingMap.get(dateStr) : 0,
          dataPos = (Math.abs(dataVal-high) / high) * 80,
          dataPosStr = dataPos + '%',
          dataVal2 = dataDisplayingMap2.get(dateStr) ? dataDisplayingMap2.get(dateStr) : 0,
          dataPos2 = (Math.abs(dataVal2-high) / high) * 80,
          dataPosStr2 = dataPos2 + '%'

    const rectWidth = 180,
          rectHeight = 80,
          middlePos = ((dataPos + dataPos2) / 2),
          labelPosY = middlePos - ((rectHeight/2-10)/viewBoxHeight*100) + '%',
          rectPosY = middlePos - (rectHeight/2/viewBoxHeight*100) + '%',
          unit = dataDisplayingType === 'percentage' ? '%' : ''

    if (dataPointDates.includes(dateStr)) {
     
      return (
        <g key={index} className='data-points'>
          <rect x={posX-areaWidth/2} y="0%" width={areaWidth} height="80%" fillOpacity={0}/>
          <line x1={posX} y1="0%" x2={posX} y2="80%" strokeWidth="1"/>
          <circle className="matrix1" cx={posX} cy={dataPosStr} r="5"/>
          <circle className="matrix2" cx={posX} cy={dataPosStr2} r="5"/>
          <rect className="label" x={posX + 10} y={rectPosY} width={rectWidth} height={rectHeight} rx={5}/>
          <text className='label'>
            <tspan x={posX + 20} dy={labelPosY} alignmentBaseline="hanging">{date.day + ' ' + date.month}</tspan>
            <tspan x={posX + 20} dy="1.2em" alignmentBaseline="hanging">{dataVal + unit} (Matrix1)</tspan>
            <tspan x={posX + 20} dy="1.2em" alignmentBaseline="hanging">{dataVal2 + unit} (Matrix2)</tspan>
          </text>
        </g>
      )
    }
  
    return null
  })
}

export default InsertData