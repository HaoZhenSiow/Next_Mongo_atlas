'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import recordEvent from '../_lib/recordEvent'
import { getBrowser } from '../_lib/recordEvent'

export default function NavigationEvents() {
  const pathName = usePathname(),
        browser = getBrowser()
  
  useEffect(() => {
    const leaveSite = createLeaveStie(pathName)
    if (browser === 'Firefox' || browser === 'Brave' || browser === 'Tor Browser') {
      window.addEventListener('beforeunload', leaveSite)
    } else {
      window.addEventListener('unload', leaveSite)
    }
    
    return () => {
      window.removeEventListener('beforeunload', leaveSite)
      window.removeEventListener('unload', leaveSite)
    }
  }, [pathName])

  useEffect(() => recordEvent(pathName, 'pageView'), [pathName])

  return null
}

function createLeaveStie(pathName) {
  return () => recordEvent(pathName, 'leaveSite')
}