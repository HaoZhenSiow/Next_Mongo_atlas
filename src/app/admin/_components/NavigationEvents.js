'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import recordEvent from '../_lib/recordEvent'

export default function NavigationEvents() {
  const pathName = usePathname()

  useEffect(() => {
    recordEvent(pathName)
  }, [pathName])

  return null
}
