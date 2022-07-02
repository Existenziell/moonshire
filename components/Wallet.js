import { useState, useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import useApp from "../context/App"
import Link from 'next/link'

const Wallet = () => {
  const { address, notify, currentUser, hasMetamask, connectWallet } = useApp()
  const [walletAddress, setWalletAddress] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setWalletAddress(address)
  }, [address])

  useEffect(() => {
    if (currentUser) setLoading(false)
  }, [currentUser])

  const syncWallet = async () => {
    hasMetamask ?
      await connectWallet()
      :
      notify("Please install Metamask to proceed")
  }

  if (loading) return <div className='h-12 w-32 flex items-center'><PulseLoader color={'var(--color-cta)'} size={6} /></div>

  if (walletAddress) {
    return (
      <div>
        <Link href='/profile'>
          <a className='button button-connect flex justify-around items-center relative'>
            <span className='h-full flex items-center justify-center overflow-hidden uppercase'>
              {currentUser?.username ? currentUser.username : `Profile`}
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
