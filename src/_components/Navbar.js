'use client'
import Link from 'next/link'
import Cookies from 'js-cookie'
import axios from 'axios'
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

export default function Navbar() {
  const { email } = AuthStore.useStoreState(state => state),
        { logout } = AuthStore.useStoreActions(actions => actions),
        logoutUser = createLogoutUser(logout),
        token = Cookies.get('token')
  
  if (!token && email) logoutUser()

  return (
    <header>
      <div className="container">
        <Link href="/">
          <h1>Workout Buddy</h1>
        </Link>
        <nav>
          {email && (
            <div>
              <span>{email}</span>
              <button onClick={logoutUser}>Log out</button>
            </div>
          )}
          {!email && (
            <div>
              <Link href="/login">Login</Link>
              <Link href="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

function createLogoutUser(logout) {
  return function () {
    logout()
    Cookies.remove('user')
    Cookies.remove('token')
  }
}