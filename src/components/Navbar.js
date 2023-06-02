import Link from "next/link"
import AuthStore from "@/stores/authStore"

const Navbar = () => {

  const { email } = AuthStore.useStoreState(state => state)

  return (
    <header>
      <div className="container">
        <Link href="/">
          <h1>Workout Buddy</h1>
        </Link>
        <nav>
          <div>
            <p>{email || ''}</p>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar