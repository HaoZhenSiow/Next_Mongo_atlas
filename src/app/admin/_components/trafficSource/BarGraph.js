import styled from 'styled-components'

const BarGraphStyled = createBarGraphStyled()

const fakeData = {
  google: 24,
  facebook: 12,
  twitter: 8,
  Instagram: 40
}

export default function BarGraph(props) {
  return (
    <BarGraphStyled className={props.className} viewBox='0 0 1000 600'>
    </BarGraphStyled>
  );
}

function createBarGraphStyled() {
  return styled.svg`
    width: 100%;
    background-color: black;
  `
}