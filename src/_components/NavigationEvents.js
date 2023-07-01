'use client'

import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import Bowser from "bowser"
import AuthStore from '@/_stores/authStore'
import { getCookie } from '@/_lib/utils'
import axios from "axios"
axios.defaults.validateStatus = false

const NavigationEvents = () => {
  const pathname = usePathname()
  const token = getCookie('token')
  const { logout } = AuthStore.useStoreActions(actions => actions)
  !token && logout()

  useEffect(() => {
    const userAgent = Bowser.getParser(window.navigator.userAgent),
          browser = getBrowser(userAgent),
          payload = {
            event: pathname,
            device: userAgent.getPlatform().type,
            browser,
            resolution: screen.width + ' x ' + screen.height
          }
          
    browser !== 'Electron' && trackPath(payload)
  }, [pathname]);
  
  return null
}

export default NavigationEvents

async function trackPath(payload) {
  await axios.post('/api/tracker/', payload)
}

function getBrowser(userAgent) {
  const data = navigator.userAgentData
  if (data && data.brands[3]) return 'DuckDuckGo'
  if (data &&  data.brands[2] && data.brands[2].brand === 'Brave') return 'Brave'
  return userAgent.getBrowser().name
}