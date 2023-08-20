import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

export default function recordEvent(event) {
  const parsedUserAgent = getParsedUserAgent(),
        browser = getBrowser(parsedUserAgent),
        referrer = getReferrer(),
        payload = {
          referrer,
          type: event.startsWith('/') ? 'pageView' : 'event',
          event,
          device: parsedUserAgent.getPlatform().type,
          browser,
          resolution: screen.width + ' x ' + screen.height
        }
  
  // const condition = referrer !== 'vercel.com' && 
  //                   browser !== 'Electron' && 
  //                   browser !== 'Vercelbot'

  // condition && 
  axios.post('/admin/api/events', payload)
}

export function getBrowser(parsedUserAgent) {
  const data = navigator.userAgentData
  if (!navigator.geolocation) return 'Tor Browser'
  if (data && data.brands[3]) return 'DuckDuckGo'
  if (data &&  data.brands[2] && data.brands[2].brand === 'Brave') return 'Brave'
  return parsedUserAgent.getBrowser().name
}

function getParsedUserAgent() {
  return Bowser.getParser(window.navigator.userAgent)
}

function getReferrer() {
  return document.referrer ? new URL(document.referrer).hostname : 'direct'
}