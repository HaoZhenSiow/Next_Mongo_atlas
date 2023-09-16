import { Fragment } from "react"
import { useLineChartStore } from "../../_stateManagement/stores/lineChartStore"
export default function DateLabels({ dateArr }) {
  const { viewBoxWidth } = useLineChartStore()

  return dateArr.map(({ day , month, showDateLabel }, index) => {
    const posX = index/(dateArr.length-1) * 0.95 * viewBoxWidth,
          textAnchor = index === 0 ? 'start' : 'middle'
    if (showDateLabel) {
      return (
        <Fragment key={index}>
          <line x1={posX} y1="78%" x2={posX} y2="82%" strokeWidth="1"/>
          <text>
            <tspan x={posX} dy="82%" textAnchor={textAnchor} alignmentBaseline="hanging">{day}</tspan>
            <tspan x={posX} dy="1em" textAnchor={textAnchor} alignmentBaseline="hanging">{month}</tspan>
          </text>
        </Fragment>
    )}
  })
}