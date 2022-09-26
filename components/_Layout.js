// import NextNprogress from 'nextjs-progressbar'
import Nav from './Nav'
import Footer from './Footer'
import Notification from './Notification'
import Wallet from './Wallet'
import Logo from './Logo'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const router = useRouter()
  return (
    <>
      <Notification />
      {/* {!router.pathname.startsWith('/admin') &&
        <NextNprogress
          height={3}
          startPosition={0.3}
          stopDelayMs={100}
          showOnShallow={false}
          color='var(--color-cta)'
          options={{ showSpinner: false }}
        />
      } */}
      <div className={`${router.pathname === '/' ? `fixed top-0 w-full bg-transparent` : `bg-brand dark:bg-brand-dark`} pt-[20px] px-[40px] flex flex-col xs:flex-row justify-between items-start xs:items-center z-20 text-black dark:text-white`}>
        <Logo />
        <div className='flex items-center justify-between w-full mt-8 xs:mt-0'>
          <Nav />
          <Wallet />
        </div>
      </div>

      <main className={`${router.pathname === '/' ? `` : `py-[60px]`} w-full text-black bg-brand dark:text-white dark:bg-brand-dark min-h-[calc(100vh-120px)]`}>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout
