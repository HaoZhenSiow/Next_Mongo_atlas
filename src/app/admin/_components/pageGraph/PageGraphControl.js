import styled from 'styled-components'

const PageGraphControlsStyled = createPageGraphControlsStyled()

export default function PageGraphControls(props) {
  return (
    <PageGraphControlsStyled className={props.className}>
      <div className="controls">

      </div>
    </PageGraphControlsStyled>
  );
}

function createPageGraphControlsStyled() {
  return styled.div`
    .controls {
      display: flex;
      margin-bottom: 1em;
    }
  `
}