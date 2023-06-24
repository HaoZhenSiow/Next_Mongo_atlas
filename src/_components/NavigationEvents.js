'use client'

import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import axios from "axios"

const NavigationEvents = () => {
  const pathname = usePathname()

  useEffect(() => {
    fetcher()
    console.log(pathname)
  }, [pathname]);
  return null
}

async function fetcher() {
  await axios.get('/api/tracker/')
}

export default NavigationEvents