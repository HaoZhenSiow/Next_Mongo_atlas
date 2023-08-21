'use client'
import { usePathname, redirect } from 'next/navigation'
import AuthStore from '../_store/authStore'

export default function PageAuth() {
  const { username } = AuthStore.useStoreState(state => state)

  const currentPath = usePathname(),
        protectedPath = ['/admin'],
        authPath = ['/admin/login']

  if (protectedPath.includes(currentPath) && !username) {
    redirect('/admin/login')
  }
  if (authPath.includes(currentPath) && username) {
    redirect('/admin')
  }

  return null
}