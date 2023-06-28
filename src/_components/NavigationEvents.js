'use client'

import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

const NavigationEvents = () => {
  const pathname = usePathname()

  useEffect(() => {
    // const browser = Bowser.getParser(window.navigator.userAgent)
    // const browser2 = navigator.userAgentData.brands[2].brand
    // console.log(browser.getBrowser(), browser2)
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