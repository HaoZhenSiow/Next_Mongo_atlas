import { useEffect } from "react";
import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

const useEventTracker = (pathname) => {
  useEffect(() => {
    const userAgent = Bowser.getParser(window.navigator.userAgent),
          browser = getBrowser(userAgent),
          payload = {
            event: pathname,
            device: userAgent.getPlatform().type,
            browser,
            resolution: screen.width + ' x ' + screen.height
          }
          
    browser !== 'Electron' && recordEvent(payload)
  }, [pathname]);
}

export default useEventTracker

async function recordEvent(payload) {
  await axios.post('/api/tracker/', payload)
}

export function getBrowser(userAgent) {
  const data = navigator.userAgentData
  if (data && data.brands[3]) return 'DuckDuckGo'
  if (data &&  data.brands[2] && data.brands[2].brand === 'Brave') return 'Brave'
  return userAgent.getBrowser().name
}