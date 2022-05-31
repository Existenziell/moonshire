import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useRouter } from 'next/router'
import LoginBtn from './LoginBtn'
import LogoutBtn from './LogoutBtn'

import Nav from './Nav'
import Footer from './Footer'
import NextNprogress from 'nextjs-progressbar'
import DarkModeToggle from './DarkModeToggle'
import Notification from './Notification'
import Logo from './Logo'
import Wallet from './Wallet'

const Layout = ({ children }) => {
  const appCtx = useContext(AppContext)
  const router = useRouter()

  return (
    <>
      <Notification />
      <NextNprogress
        height={3}
        startPosition={0.3}
        stopDelayMs={100}
        showOnShallow={true}
        color='var(--color-cta)'
        options={{ showSpinner: false }}
      />

      <div className='hidden md:flex justify-between items-center z-20 bg-brand dark:bg-brand-dark text-black dark:text-white' >
        <Logo />
        <Nav />
        <Wallet />
      </div>

      <div className='flex md:hidden justify-between items-center z-20 bg-brand dark:bg-brand-dark text-black dark:text-white' >
        <div className=''>
          <Logo />
        </div>
        <div className='flex items-center gap-2 px-4'>
          <Wallet />
          <Nav />
        </div>
      </div>

      <main className='w-full text-black bg-brand dark:text-white dark:bg-brand-dark min-h-screen px-8 py-8'>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout
