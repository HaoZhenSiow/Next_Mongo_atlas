'use client'

import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import axios from "axios"

const NavigationEvents = () => {
  const pathname = usePathname()

  useEffect(() => {
    fetcher(pathname)
    console.log(pathname)
  }, [pathname]);
  return null
}

async function fetcher(pathname) {
  await axios.post('/api/tracker/', {
    path: pathname
  })
}

export default NavigationEvents