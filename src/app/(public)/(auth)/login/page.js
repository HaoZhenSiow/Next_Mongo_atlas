'use client'
import { useRef } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

export default function Home() {
  const errRef = useRef()
  const { login } = AuthStore.useStoreActions(actions => actions)
  
  return (
    <form className="login" onSubmit={handleLogin}>
      <h3>Log In</h3>
      
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

  async function handleLogin(e) {
    e.preventDefault()

    const form = e.target,
          email = form.email,
          password = form.password,
          button = form.submit,
          payload = { request: 'login', email: email.value, password: password.value }

    button.disabled = true
    errRef.current.hidden = true

    const { status, data } = await axios.post('/api/auth/', payload)
    if (status === 200) {
      login(data)
    } else {
      errRef.current.hidden = false
      errRef.current.innerHTML = data
    }
    button.disabled = false
  }
}