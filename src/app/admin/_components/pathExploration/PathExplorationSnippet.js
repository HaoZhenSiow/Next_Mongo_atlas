import styled from 'styled-components'

import Diagram from './Diagram';

const PathExplorationSnippetStyled = createPathExplorationSnippetStyled()

export default function PathExplorationSnippet(props) {
  return (
    <PathExplorationSnippetStyled className={props.className}>
      <h2>Path Exploration</h2>
      <Diagram/>
    </PathExplorationSnippetStyled>
  );
}

function createPathExplorationSnippetStyled() {
  return styled.div``
}