'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import recordEvent from '../_lib/recordEvent'
import { getBrowser } from '../_lib/recordEvent'
import Cookies from 'js-cookie'
const unload = require('unload')

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

    const duckduckgoEvent = async () => {
      await recordEvent(recordPath, 'pageView')
      await recordEvent(recordPath, 'leaveSite')
    }

    if (browser === 'DuckDuckGo') {
      duckduckgoEvent()
    } else {
      recordEvent(recordPath, 'pageView')
    }

    unload.add(() => recordEvent(recordPath, 'leaveSite'))

  }, [pathName])

  return null
}
