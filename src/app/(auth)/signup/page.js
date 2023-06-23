'use client'
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import tracker from "@/_lib/tracker"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

export default function Home() {
  const router = useRouter()
  const errRef = useRef()
  const { login } = AuthStore.useStoreActions(actions => actions)

  // useEffect(() => {
  //   tracker()
  // }, [])

  return (
    <form className="signup" onSubmit={handleSignup}>
      <h3>Sign Up</h3>
      
      <label>Email address:</label>
      <input 
        type="email"
        name="email"
        required
      />
      <label>Password:</label>
      <input 
        type="password" 
        name="password"
        required
      />

      <button name="submit">Log in</button>
      <div className="error" ref={errRef} hidden></div>
    </form>
  )

  async function handleSignup(e) {
    e.preventDefault()

    const form = e.target,
          email = form.email,
          password = form.password,
          button = form.submit,
          payload = { request: 'signup', email: email.value, password: password.value }

    button.disabled = true
    errRef.current.hidden = true

    const { status, data } = await axios.post('/api/auth/', payload)
    if (status === 200) {
      login(data)
      form.reset()
      router.push('/')
    } else {
      errRef.current.hidden = false
      errRef.current.innerHTML = data
    }
    button.disabled = false
  }
}