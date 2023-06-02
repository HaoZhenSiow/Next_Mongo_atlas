require('dotenv').config()
import './globals.css'
import Store from '@/_stores/Store'
import Navbar from '@/_components/Navbar'


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </head>
      <body>
        <Store>
          <Navbar/>
          <div className="pages">
            {children}
          </div>
        </Store>
      </body>
    </html>
  )
}
