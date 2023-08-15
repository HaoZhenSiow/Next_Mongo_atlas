import './globals.css'
import { Suspense } from 'react'
import Navbar from '@/_components/Navbar'
import NavigationEvents from '@/_components/NavigationEvents'
import Store from '@/_stores/Store'


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }) {
  return (
    <Store>
      <Suspense fallback={null}>
        <NavigationEvents/>
      </Suspense>
      <Navbar/>
      <div className="pages">
        {children}
      </div>
    </Store>
  )
}
