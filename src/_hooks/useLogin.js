import { useState } from "react"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "@/_stores/authStore"

export default function useLogin() {
  const { login } = AuthStore.useStoreActions(actions => actions)
  const [error, setError] = useState(null)
  const [isLoading, seIsLoading] = useState(false)

  const handleLogin = createHandler('login')
  const handleSignup = createHandler('signup')

  function createHandler(request) {
    return async function (e) {
      e.preventDefault()
      setError(null)
      seIsLoading(true)

      const email = e.target.email.value
      const password = e.target.password.value
      const payload = { request, email, password }

      const { status, data } = await axios.post('/api/auth/', payload)
      if (status === 200) {
        login(data)
      } else {
        setError(data)
      }
      seIsLoading(false)
    }
  }

  return { handleLogin, handleSignup, error, isLoading }
}