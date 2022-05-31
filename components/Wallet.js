import { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useWeb3React } from "@web3-react/core"
import Image from 'next/image'
import Link from 'next/link'

const Wallet = () => {
  const appCtx = useContext(AppContext)
  const { notify, connect, hasMetamask } = appCtx
  const { account, active } = useWeb3React()

  const [overlayShown, setOverlayShown] = useState(false)

  const closeAndConnect = () => {
    setOverlayShown(false)
    connect()
  }

  const syncWallet = () => {
    hasMetamask ?
      setOverlayShown(true)
      :
      notify("Please install Metamask to proceed")
  }

  if (active && account) return (
    <div className='mr-4'>
      <Link href='/profile'>
        <a className='button button-connect flex justify-around items-center'>
          <span className='peer h-full w-2/3 flex items-center justify-center'>{account.substring(0, 5)}&#8230;{account.slice(account.length - 4)}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 peer-hover:animate-spin" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </a>
      </Link>
    </div>
  )

  if (overlayShown) return (
    <div className='flex items-center justify-center text-center'>

      {/* Backdrop */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-20 w-full h-screen bg-black/40 backdrop-blur"></div>

      {/* Overlay */}
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 rounded-xl bg-white dark:bg-brand-dark md:max-w-2xl px-6 py-8'>
        <h2 className='text-2xl md:text-4xl mb-6'>Connect your wallet</h2>
        <p className='text-xs mb-8 max-w-md mx-auto'>By connecting your wallet, you agree to our Terms of Services and our Privacy Policy.</p>
        <div onClick={closeAndConnect} className='button button-detail flex items-center justify-between divide-x divide-dashed divide-brand dark:divide-brand-dark mx-auto'>
          <span className='pr-4'>Metamask</span>
          <span className='pl-4'><Image src='/metamask.svg' alt='MetaMask' width={20} height={20} /></span>
        </div>
        {/* Close Button */}
        <div className='absolute top-2 right-2 z-30'>
          <svg onClick={() => setOverlayShown(false)} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-dark dark:text-brand hover:text-cta dark:hover:text-cta transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  )

  return (
    <div className='bg-brand dark:bg-brand-dark md:pr-4 '>
      <button
        onClick={syncWallet}
        className='button button-connect'>
        Sync Wallet
      </button>
    </div>
  )
}

export default Wallet
