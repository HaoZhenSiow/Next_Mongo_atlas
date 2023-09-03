import styled from 'styled-components'

const SnippetStyled = createSnippetStyled()

export default function Snippet(props) {
  return (
    <SnippetStyled className={props.className}>
    </SnippetStyled>
  );
}

function createSnippetStyled() {
  return styled.div`
    background-color: var(--bg-color);
    padding: 30px;
    border-radius: 10px;
    margin-block-end: 3em;

    h2 {
      margin-bottom: .5em;
    }

    &:last-child {
      margin-block-end: 0;
    }
  `
}