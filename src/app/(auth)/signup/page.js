'use client'
import useLogin from "@/_hooks/useLogin"

export default function Home() {
  const { handleSignup, error, isLoading } = useLogin()
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

      <button name="btn-submit" disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}