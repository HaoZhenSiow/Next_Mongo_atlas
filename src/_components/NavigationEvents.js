'use client'

import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

const NavigationEvents = () => {
  const pathname = usePathname()

  useEffect(() => {
    const userAgent = Bowser.getParser(window.navigator.userAgent),
          browser = getBrowser(userAgent),
          payload = {
            event: pathname,
            device: userAgent.getPlatform().type,
            browser,
            resolution: screen.width + ' x ' + screen.height
          }

    // browser !== 'Electron' && trackPath(payload)
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

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}