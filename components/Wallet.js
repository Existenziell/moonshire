import { useState, useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import useApp from "../context/App"
import Link from 'next/link'

const Wallet = () => {
  const { address, notify, currentUser, hasMetamask, connectWallet } = useApp()
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    if (address) setWalletAddress(address)
  }, [address])

  const syncWallet = async () => {
    hasMetamask ?
      await connectWallet()
      :
      notify("Please install Metamask to proceed")
  }

  if (walletAddress) {
    return (
      <div>
        <Link href='/profile'>
          <a className='button button-connect flex justify-around items-center relative'>
            <span className='h-full flex items-center justify-center overflow-hidden uppercase'>
              {currentUser?.username ? currentUser.username : <PulseLoader color={'white'} size={4} />}
            </span>
          </a>
        </Link>
      </div>
    )
  }

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
