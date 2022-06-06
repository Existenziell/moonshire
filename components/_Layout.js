import Nav from './Nav'
import Footer from './Footer'
import NextNprogress from 'nextjs-progressbar'
import Notification from './Notification'
import Logo from './Logo'
import Wallet from './Wallet'

const Layout = ({ children }) => {
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

      <div className='pt-5 px-10 hidden md:flex justify-between items-start z-20 bg-brand dark:bg-brand-dark text-black dark:text-white' >
        <Logo />
        <div className='flex items-center'>
          <Nav />
          <Wallet />
        </div>
      </div>

      <div className='pt-5 px-10 flex md:hidden justify-between items-start z-20 bg-brand dark:bg-brand-dark text-black dark:text-white' >
        <div>
          <Logo />
        </div>
        <div className='flex items-center gap-2'>
          <Wallet />
          <Nav />
        </div>
      </div>

      <main className='w-full text-black bg-brand dark:text-white dark:bg-brand-dark min-h-[calc(100vh-160px)] px-10 py-[60px]'>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout
