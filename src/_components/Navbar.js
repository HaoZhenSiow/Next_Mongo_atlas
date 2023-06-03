'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

const Navbar = () => {

  const rotuer = useRouter()

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
    await axios.post('/api/auth/', { request: 'logout' })
    rotuer.replace('/login')
  }
}

export default Navbar