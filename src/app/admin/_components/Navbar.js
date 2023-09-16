'use client'
import styled from 'styled-components'
import Cookies from 'js-cookie';

import AuthStore from '../_stateManagement/stores/authStore';

const NavbarStyled = createNavbarStyled()

export default function Navbar() {
  const { username } = AuthStore.useStoreState(state => state),
        { logout } = AuthStore.useStoreActions(actions => actions),
        logoutHandler = createLogoutHandler(logout),
        adminToken = Cookies.get('adminToken')

  if (!adminToken && username) logoutHandler()

  return (
    <NavbarStyled className='container'>
      <h1>Event Tracker</h1>
      {username && (
        <div className="status">
          <p>Logged in as {username}</p>
          <button type='button' onClick={logoutHandler}>Log out</button>
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
    background-color: var(--bg-color2);
    color: var(--text-color);
    padding-block: 1em;

    .status {
      display: flex;
      align-items: center;

      button {
        margin-left: 1em;
      }
    }
  `
}

function createLogoutHandler(logout) {
  return function () {
    logout()
    Cookies.remove('admin')
    Cookies.remove('adminToken')
  }
}