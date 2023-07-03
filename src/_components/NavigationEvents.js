'use client'

import useEventTracker from "@/_hooks/useEventTracker"
import { usePathname, redirect } from 'next/navigation'
import { getCookie } from '@/_lib/utils'
import AuthStore from '@/_stores/authStore'

const NavigationEvents = () => {
  const pathName = usePathname()
  authCheck()
  forceRedirect(pathName)
  useEventTracker(pathName)
  return null
}

export default NavigationEvents

function authCheck() {
  const token = getCookie('token')
  const { email } = AuthStore.useStoreState(state => state)
  const { logout } = AuthStore.useStoreActions(actions => actions)
  if (!token && email) {
    logout()
  }
}

function forceRedirect(pathName) {
  const { email } = AuthStore.useStoreState(state => state),
        protectedPath = ['/'],
        authPath = ['/login', '/signup']
  switch (true) {
    case protectedPath.includes(pathName):
      !email && redirect('/login')
      break
    case authPath.includes(pathName):
      email && redirect('/')
      break
  }
}