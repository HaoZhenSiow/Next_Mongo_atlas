'use client'
import useEventTracker from "@/_hooks/useEventTracker"
import { usePathname } from 'next/navigation'
import { getCookie } from '@/_lib/utils'
import AuthStore from '@/_stores/authStore'

const NavigationEvents = () => {
  const pathName = usePathname()
  authCheck()
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