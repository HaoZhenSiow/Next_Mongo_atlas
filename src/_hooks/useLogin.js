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

  function createHandler(requestType) {
    return async function (e) {
      e.preventDefault()
      setError(null)
      seIsLoading(true)

      const email = e.target.email.value
      const password = e.target.password.value

      const { status, data } = await axios.post(`/api/${requestType}`, {email, password})
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