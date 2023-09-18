import styled from 'styled-components'

import { useLineChartStore } from "@/app/admin/_stateManagement/stores/lineChartStore"

const XintervalStyled = createXintervalStyled()
export default function XintervalControl() {
  const { Xinterval, setState } = useLineChartStore()

  return (
    <XintervalStyled>
      <select value={Xinterval} onChange={e => setState('Xinterval', e.target.value)}>
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