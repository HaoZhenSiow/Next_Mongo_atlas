import Bowser from "bowser"
import axios from "axios"
axios.defaults.validateStatus = false

export default function recordEvent(event, type = 'event') {
  const browser = getBrowser(),
        referrer = getReferrer(),
        payload = {
          referrer,
          type,
          event,
          device: getDeviceType(),
          browser,
          resolution: screen.width + ' x ' + screen.height
        }
  
  // const condition = referrer !== 'vercel.com' && 
  //                   browser !== 'Electron' && 
  //                   browser !== 'Vercelbot'

  // condition && 
  axios.post('/admin/api/events', payload)
}

export function getBrowser() {
  const data = navigator.userAgentData
  if (!navigator.geolocation) return 'Tor Browser'
  if (data && data.brands[3]) return 'DuckDuckGo'
  if (data &&  data.brands[2] && data.brands[2].brand === 'Brave') return 'Brave'
  return Bowser.getParser(window.navigator.userAgent).getBrowser().name
}

function getDeviceType() {
  return Bowser.getParser(window.navigator.userAgent).getPlatform().type
}

function getParsedUserAgent() {
  return Bowser.getParser(window.navigator.userAgent)
}

function getReferrer() {
  return document.referrer ? new URL(document.referrer).hostname : 'direct'
}