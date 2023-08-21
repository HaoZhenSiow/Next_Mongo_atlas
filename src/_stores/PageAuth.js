'use client'
import AuthStore from "@/_stores/authStore"
import { usePathname, redirect } from 'next/navigation'

export default function PageAuth() {
  const { email } = AuthStore.useStoreState(state => state)

  const currentPath = usePathname(),
        protectedPath = ['/'],
        authPath = ['/login', '/signup']

  if (protectedPath.includes(currentPath) && !email) {
    redirect('/login')
  }
  if (authPath.includes(currentPath) && email) {
    redirect('/')
  }

  return null
}