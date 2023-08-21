'use client'

import Cookies from "js-cookie"

export default function Home() {
  const tokenA = Cookies.get('tokenA')
  return (
    <div className="home">
      {tokenA && <h1>This is Home page A</h1>}
      {!tokenA && <h1>This is Home page B</h1>}
    </div> 
  )
}