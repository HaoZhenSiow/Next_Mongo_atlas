'use client'
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "@/stores/authStore"

export default async function Home() {
  const { login } = AuthStore.useStoreActions(actions => actions)

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      
      <label>Email address:</label>
      <input 
        type="email"
        name="email"
      />
      <label>Password:</label>
      <input 
        type="password" 
        name="password"
      />

      <button name="btn-submit">Sign up</button>
    </form>
  )

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const email = form.email.value
    const password = form.password.value
    form['btn-submit'].disabled = true
    const { status, data } = await axios.post('/api/signup', {email, password})
    if (status === 200) {
      login(data)
    }
    form['btn-submit'].disabled = false
  }
}