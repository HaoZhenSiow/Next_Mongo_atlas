'use client'
import styled from 'styled-components'

const Main = createMain()

export default function Home() {
  return (
    <Main>
      <form action="">
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
        {/* <div className="error" ref={errRef} hidden></div> */}
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
      /* gap: 1em; */
      h3 {
        /* align-self: center; */
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
    }
  `
}