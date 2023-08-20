'use client'
import { usePathname, redirect } from 'next/navigation'
import { useEffect } from "react"

import AuthStore from '../_store/authStore'

export default function PageAuth() {
  const { username } = AuthStore.useStoreState(state => state)

  const currentPath = usePathname(),
        protectedPath = ['/admin'],
        authPath = ['/admin/login']

  useEffect(() => {
    if (protectedPath.includes(currentPath) && !username) {
      redirect('/admin/login')
    }
    if (authPath.includes(currentPath) && username) {
      redirect('/admin')
    }
  }, [currentPath, username])

  return null
}