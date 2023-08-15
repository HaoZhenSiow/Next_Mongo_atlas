'use client'
import styled from 'styled-components'

const NavbarStyled = createNavbarStyled()

export default function Navbar(props) {
  return (
    <NavbarStyled className='container'>
      <h1>Event Tracker</h1>
      <div className="status">
        <p>Logged in as {props.email}</p>
        <button type='button'>Log out</button>
      </div>
    </NavbarStyled>
  );
}

function createNavbarStyled() {
  return styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status {
      display: flex;
      align-items: center;

      button {
        margin-left: 1em;
      }
    }
  `
}