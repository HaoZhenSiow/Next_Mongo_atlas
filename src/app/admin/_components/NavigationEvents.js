'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import recordEvent from '../_lib/recordEvent'
import { getBrowser } from '../_lib/recordEvent'
import Cookies from 'js-cookie'

export default function NavigationEvents() {
  const pathName = usePathname(),
        browser = getBrowser(),
        tokenA = Cookies.get('tokenA'),
        tokenB = Cookies.get('tokenB')

  let recordPath = pathName

  if (tokenA && pathName === '/about') {
    recordPath = pathName + '-A'
  }
  
  if (tokenB && pathName === '/about') {
    recordPath = pathName + '-B'
  }
  
  useEffect(() => {
    const leaveSite = createLeaveStie(recordPath)

    if (browser === 'Firefox' || browser === 'Brave' || browser === 'Tor Browser') {
      window.addEventListener('beforeunload', leaveSite)
    } else {
      window.addEventListener('unload', leaveSite)
    }
    
    recordEvent(recordPath, 'pageView')

    return () => {
      window.removeEventListener('beforeunload', leaveSite)
      window.removeEventListener('unload', leaveSite)
    }
  }, [pathName])

  return null
}

function createLeaveStie(pathName) {
  return () => recordEvent(pathName, 'leaveSite')
}