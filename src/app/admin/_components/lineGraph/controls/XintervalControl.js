import styled from 'styled-components'

import { useLineChartStore } from "@/app/admin/_store/lineChartStore"

const XintervalStyled = createXintervalStyled()
export default function XintervalControl() {
  const { Xinterval, setXinterval } = useLineChartStore()

  return (
    <XintervalStyled>
      <select value={Xinterval} onChange={e => setXinterval(e.target.value)}>
        <option value="day">daily</option>
        <option value="week">weekly</option>
        <option value="month">monthly</option>]
      </select>
    </XintervalStyled>
  )
}

function createXintervalStyled() {
  return styled.div`
  
  `
}