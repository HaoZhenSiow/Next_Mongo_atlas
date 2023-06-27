'use client'

import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import axios from "axios"
axios.defaults.validateStatus = false

const NavigationEvents = () => {
  const pathname = usePathname()

  useEffect(() => {
    async function fetcher() {
      await axios.post('/api/tracker/', {
        path: pathname
      })
      
    }
    fetcher()
  }, [pathname]);
  
  return null
}

export default NavigationEvents