'use client'
import Link from "next/link"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

const Navbar = () => {

  const { email } = AuthStore.useStoreState(state => state)
  const { logout } = AuthStore.useStoreActions(actions => actions)

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
              <button onClick={logout}>Log out</button>
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
    await axios.get('/api/logout/')
  }
}

export default Navbar