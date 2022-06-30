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

      <div className='pt-[20px] px-[40px] flex justify-between items-start z-20 bg-brand dark:bg-brand-dark text-black dark:text-white'>
        <Logo />
        <div className='flex items-center'>
          <Nav />
          <Wallet />
        </div>
      </div>

      <main className='w-full text-black bg-brand dark:text-[#cccccc] dark:bg-brand-dark min-h-[calc(100vh-140px)] py-[60px]'>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default Layout
