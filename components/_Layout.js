import Nav from './Nav'
import Footer from './Footer'
import NextNprogress from 'nextjs-progressbar'
import Notification from './Notification'
import Logo from './Logo'
import Wallet from './Wallet'
import { useRouter } from 'next/router'
const Layout = ({ children }) => {
  const router = useRouter()
  return (
    <>
      <Notification />
      {!router.pathname.startsWith('/admin') &&
        <NextNprogress
          height={3}
          startPosition={0.3}
          stopDelayMs={100}
          showOnShallow={false}
          color='var(--color-cta)'
          options={{ showSpinner: false }}
        />
      }
      <div className={` ${router.pathname === '/' ? `fixed top-0 w-full bg-transparent` : `bg-brand dark:bg-brand-dark`} pt-[20px] px-[40px] flex justify-between items-start z-20 text-black dark:text-white`}>
        <Logo />
        <div className='flex items-center'>
          <Nav />
          <Wallet />
        </div>
      </div>

      <main className={`${router.pathname === '/' ? `` : `py-[60px]`} w-full text-black bg-brand dark:text-white dark:bg-brand-dark min-h-[calc(100vh-140px)]`}>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout
