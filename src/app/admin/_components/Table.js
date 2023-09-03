import styled from 'styled-components'

const TableStyled = createTableStyled()

export default function Table({ headers, children }) {
  return (
    <TableStyled>
      <thead>
        <tr>
          {headers.map(header => <th key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </TableStyled>
  );
}

function createTableStyled() {
  return styled.table`
    width: 100%;
    border-spacing: 0 1px;

    thead {
      position: sticky;
      top: 0;
      left: 0;
      background-color: var(--bg-color3);
      color: var(--bg-color);
    }

    tbody tr:nth-child(even) {
      background-color: var(--bg-color4);
    }

    th, td {
      padding: .5em .5em;
      text-align: start;
    }
  `
}