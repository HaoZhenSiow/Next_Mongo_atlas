'use client'
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { useEffect } from "react"
import ReactGA from 'react-ga4'

export default function GoogleAnalytics() {
  ReactGA.initialize('G-568949T8LM')

  let page = usePathname()

  const tokenA = Cookies.get('tokenA'),
        tokenB = Cookies.get('tokenB')

  if (tokenA && page === '/about') {
    page += '-A'
  }
  
  if (tokenB && page === '/about') {
    page += '-B'
  }

  console.log(page)

  useEffect(() => {
    let title = ``

    switch (page) {
      case '/':
        title = 'Homepage'
        break
      case '/about-A':
        title = 'About Page A'
        break
      case '/about-B':
        title = 'About Page B'
        break
      case '/login':
        title = 'Login Page'
        break
      case '/signup':
        title = 'Signup Page'
        break
    }

    ReactGA.send({ hitType: "pageview", page, title })
  }, [page])

  return null
}