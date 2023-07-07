import { useEffect } from "react";
import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

const useEventTracker = (pathname) => {
  useEffect(() => {
    recordEvent(pathname)
  }, [pathname]);
}

export default useEventTracker

export async function recordEvent(event) {
  const userAgent = Bowser.getParser(window.navigator.userAgent),
        browser = getBrowser(userAgent),
        referrer = document.referrer ? new URL(document.referrer).hostname : 'direct',
        payload = {
          referrer,
          event,
          device: userAgent.getPlatform().type,
          browser,
          resolution: screen.width + ' x ' + screen.height
        }

  browser !== 'Electron' && await axios.post('/api/tracker/', payload)
}

export function getBrowser(userAgent) {
  const data = navigator.userAgentData
  if (data && data.brands[3]) return 'DuckDuckGo'
  if (data &&  data.brands[2] && data.brands[2].brand === 'Brave') return 'Brave'
  return userAgent.getBrowser().name
}

export function trackRemoveWorkout() {
  recordEvent('remove workout')
}

export function trackInsertWorkout() {
  recordEvent('insert workout')
}