import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

export default function recordEvent(event) {
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

  if (referrer !== 'vercel.com' && browser !== 'Electron' && browser !== 'Vercelbot') {
    axios.post('/admin/api/events', payload)
  }
}

export function getBrowser(userAgent) {
  const data = navigator.userAgentData
  if (!navigator.geolocation) return 'Tor Browser'
  if (data && data.brands[3]) return 'DuckDuckGo'
  if (data &&  data.brands[2] && data.brands[2].brand === 'Brave') return 'Brave'
  return userAgent.getBrowser().name
}