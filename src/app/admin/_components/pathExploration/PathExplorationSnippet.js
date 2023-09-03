import styled from 'styled-components'

const PathExplorationSnippetStyled = createPathExplorationSnippetStyled()

export default function PathExplorationSnippet(props) {
  return (
    <PathExplorationSnippetStyled className={props.className}>
      <h2>Path Exploration</h2>
    </PathExplorationSnippetStyled>
  );
}

function createPathExplorationSnippetStyled() {
  return styled.div``
}