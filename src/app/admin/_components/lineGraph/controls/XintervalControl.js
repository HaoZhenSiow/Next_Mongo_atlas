import styled from 'styled-components'

import { useLineChartStore } from "@/app/admin/_store/lineChartStore"

const XintervalStyled = createXintervalStyled()
export default function XintervalControl() {
  const { Xinterval, setXinterval } = useLineChartStore()

  return (
    <XintervalStyled>
      <select value={Xinterval} onChange={e => setXinterval(e.target.value)}>
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>]
      </select>
    </XintervalStyled>
  )
}

function createXintervalStyled() {
  return styled.div`
  
  `
}