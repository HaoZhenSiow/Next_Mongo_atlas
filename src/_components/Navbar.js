'use client'
import Link from 'next/link'
import Cookies from 'js-cookie'
import axios from 'axios'
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

const Navbar = () => {
  const token = Cookies.get('token')
  const { email } = AuthStore.useStoreState(state => state)
  const { logout } = AuthStore.useStoreActions(actions => actions)
  if (!token && email) logout()

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
              <button onClick={logoutHandle}>Log out</button>
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

  async function logoutHandle() {
    logout()
    Cookies.remove('user')
    Cookies.remove('token')
  }
}

export default Navbar