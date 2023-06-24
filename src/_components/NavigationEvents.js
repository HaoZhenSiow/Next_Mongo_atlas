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
  await axios.get('http://localhost:3000/api/tracker/')
}

export default NavigationEvents