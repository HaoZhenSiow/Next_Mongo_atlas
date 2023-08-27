import './globals.css'
import Navbar from '@/_components/Navbar'
import NavigationEvents from '../admin/_components/NavigationEvents'
import Store from '@/_stores/Store'
import PageAuth from '@/_stores/PageAuth'
// import GoogleAnalytics from '@/_components/GoogleAnalytics'


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }) {
  return (
    <Store>
      <PageAuth/>
      {/* <GoogleAnalytics/> */}
      <NavigationEvents/>
      <Navbar/>
      <div className="pages">
        {children}
      </div>
    </Store>
  )
}
