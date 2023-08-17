'use client'
import { useRef } from "react"
import styled from 'styled-components'
import { redirect } from "next/navigation"
import axios from "axios"
axios.defaults.validateStatus = false

import AuthStore from "../_store/authStore"

const Main = createMain()

export default function Home() {
  const errRef = useRef()
  const { username } = AuthStore.useStoreState(state => state)
  const { login } = AuthStore.useStoreActions(actions => actions)
  const handleLogin = createLoginHandle(login, errRef)

  if (username) redirect('/admin')
  

  return (
    <Main>
      <form onSubmit={handleLogin}>
        <h3>Log In</h3>
        
        <label>Username:</label>
        <input 
          type="text"
          name="username"
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
      
    </Main> 
  )
}

function createMain() {
  return styled.main`
    display: grid;
    place-content: center;
    min-height: 80vh;

    form {
      border: 1px solid black;
      border-radius: 5px;
      width: 400px;
      padding: 2em 1em;
      display: flex;
      flex-direction: column;
      align-items: start;
      h3 {
        margin-bottom: 1em;
      }

      label {
        font-weight: 400;
        margin-bottom: .5em;
      }

      input {
        font-family: inherit;
        font-size: inherit;
        width: 100%;
        padding: .25em .5em;
        margin-bottom: 1em;
        border: 1px solid #ccc;
        border-radius: 5px;
        /* outline: none; */
      }

      button {
        font-family: inherit;
        font-size: inherit;
        padding: .25em .5em;
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      .error {
        color: red;
        margin-top: 1em;
      }
    }
  `
}

function createLoginHandle(login, errRef) {
  return async function handleLogin(e) {
    e.preventDefault()
  
    const form = e.target,
          username = form.username,
          password = form.password,
          button = form.submit,
          payload = { request: 'login', username: username.value, password: password.value }
  
    button.disabled = true
    errRef.current.hidden = true
  
    const { status, data } = await axios.post('/admin/api/auth', payload)
    if (status === 200) {
      login(data)
    } else {
      errRef.current.hidden = false
      errRef.current.innerHTML = data
    }
    button.disabled = false
  }
}