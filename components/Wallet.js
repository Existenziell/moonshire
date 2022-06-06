import { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useWeb3React } from "@web3-react/core"
import Image from 'next/image'
import Link from 'next/link'

const Wallet = () => {
  const appCtx = useContext(AppContext)
  const { notify, currentUser, connect, hasMetamask } = appCtx
  const { account, active } = useWeb3React()

  const [overlayShown, setOverlayShown] = useState(false)

  const connectAndClose = () => {
    setOverlayShown(false)
    connect()
  }

  const syncWallet = () => {
    hasMetamask ?
      // setOverlayShown(true)
      connect()
      :
      notify("Please install Metamask to proceed")
  }

  if (active && account) return (
    <div>
      <Link href='/profile'>
        <a className='button button-connect flex justify-around items-center relative'>
          <span className='h-full flex items-center justify-center overflow-hidden uppercase'>
            {currentUser?.username && currentUser.username}
          </span>
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
        <div onClick={connectAndClose} className='button button-detail flex items-center justify-between divide-x divide-dashed divide-brand dark:divide-brand-dark mx-auto'>
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
    <div className='bg-brand dark:bg-brand-dark '>
      <button
        onClick={syncWallet}
        className='button button-connect uppercase font-serif'>
        Sync Wallet
      </button>
    </div>
  )
}

export default Wallet
