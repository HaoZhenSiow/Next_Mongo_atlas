'use client'
import styled from 'styled-components'
import { eraseCookie } from '../_lib/utils';
import AuthStore from '../_store/authStore';

const NavbarStyled = createNavbarStyled()

export default function Navbar() {

  const { username } = AuthStore.useStoreState(state => state)
  const { logout } = AuthStore.useStoreActions(actions => actions)
  const logoutHandle = createLogoutHandle(logout)

  return (
    <NavbarStyled className='container'>
      <h1>Event Tracker</h1>
      {username && (
        <div className="status">
          <p>Logged in as {username}</p>
          <button type='button' onClick={logoutHandle}>Log out</button>
        </div>
      )}
      
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

function createLogoutHandle(logout) {
  return async function () {
    logout()
    eraseCookie('adminToken')
    eraseCookie('admin')
  }
}