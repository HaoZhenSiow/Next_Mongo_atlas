'use client'
import useLogin from "@/_hooks/useLogin"

export default function Home() {
  const { handleLogin, error, isLoading } = useLogin()
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

      <button name="btn-login" disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}