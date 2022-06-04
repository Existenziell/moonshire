import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useWeb3React } from "@web3-react/core"
import Head from 'next/head'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/updateProfile'
import AddToHomeScreen from '../components/AddToHomeScreen'
import MyNfts from '../components/market/MyNfts'
import MyListedNfts from '../components/market/MyListedNfts'
import Link from 'next/link'
import { addToMetamask } from '../lib/addToMetamask'

const Profile = () => {
  const appCtx = useContext(AppContext)
  const { currentUser, setCurrentUser, disconnect, hasMetamask, notify } = appCtx
  const { account } = useWeb3React()

  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [modified, setModified] = useState(false)
  const [soldNfts, setSoldNfts] = useState(0)

  useEffect(() => {
    if (currentUser) {
      const { username, avatar_url, is_premium, created_at } = currentUser
      setUsername(username)
      setAvatarUrl(avatar_url)
      setCreatedAt(created_at)
      setIsPremium(is_premium)
    }
  }, [currentUser])

  const setUser = (e) => {
    setUsername(e.target.value)
    setModified(true)
  }

  const updateUser = () => {
    setModified(false)
    setCurrentUser(currentUser => ({
      ...currentUser,
      ...{ username }
    }))
    updateProfile({ id: currentUser.id, username, avatar_url, notify })
  }

  const resetInput = () => {
    setUsername(currentUser.username)
    setModified(false)
  }

  const handleUpload = (url) => {
    setAvatarUrl(url)
    setCurrentUser(currentUser => ({
      ...currentUser,
      ...{ avatar_url: url }
    }))
    updateProfile({ id: currentUser.id, username, avatar_url: url, notify })
  }

  if (!hasMetamask) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Please install Metamask to proceed.
      </p>
    )
  }

  if (!account) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Please connect your wallet first.
      </p>
    )
  }

  return (
    <>
      <Head>
        <title>Profile | Project Moonshire</title>
        <meta name='description' content='Profile | Project Moonshire' />
      </Head>

      <div className='profile flex flex-col items-center justify-center px-4 md:px-8 pb-12'>

        <div className='flex flex-col md:flex-row md:gap-12'>
          <div className='md:order-2'>
            <div className='flex flex-col items-center gap-2 mb-12'>
              <label htmlFor="username">
                <input
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUser(e)}
                  placeholder='Username'
                  className='text-4xl md:text-6xl font-serif w-full'
                />
              </label>
              {modified &&
                <div className='flex flex-row gap-2'>
                  <button onClick={updateUser} className='link text-xs block'>Save</button>
                  <button onClick={resetInput} className='link text-xs block ml-1'>Cancel</button>
                </div>
              }
            </div>

            <div className='mb-8 text-xs flex flex-col gap-1 text-center '>
              <p>Membership: {is_premium ? `Premium` : `Free`}</p>
              <p>Joined: {createdAt?.slice(0, 10)}</p>
              <p>Wallet {account}</p>
            </div>
          </div>

          <div className='max-w-md flex-shrink-0'>
            <Avatar
              url={avatar_url}
              // size={150}
              onUpload={(url) => handleUpload(url)}
            />
          </div>
        </div>

        <h1 className='mt-20 py-2 border-b-2 border-detail dark:border-detail-dark'>Your Assets</h1>

        <div className='flex flex-col md:flex-row items-center justify-center gap-12 mb-8'>
          <div className='mb-8 md:mb-0 text-center md:text-right'>
            <Link href='/nfts/create'><a className='button button-detail mb-8 mx-auto md:ml-auto md:mr-0'>Create Asset</a></Link>
            <p className='text-tiny'>By creating an asset it will be minted and put on sale on the marketplace.<br />Listing costs are 0.000001 ETH</p>
          </div>
          <div>
            <Link href='/nfts'><a className='button button-detail mb-8 mx-auto md:mr-auto md:ml-0'>Discover</a></Link>
            <p className='text-tiny text-center md:text-left'>Explore the marketplace to find some hidden gems for your wallet.<br />Purchased items will be listed here.</p>
          </div>
        </div>

        <div className='w-full'>
          <MyNfts setSoldNfts={setSoldNfts} />
          <MyListedNfts />
          <div className='mt-8 mb-24 flex flex-col items-start justify-start w-full'>
            <h2 className='py-2 border-b-2 border-detail dark:border-detail-dark'>Sold:</h2>
            <p className='mt-3 text-xs'>Sold items: {soldNfts.length}</p>
          </div>
        </div>

        <button className='button button-cta mt-24' onClick={addToMetamask}>Add to MetaMask</button>
        <AddToHomeScreen />
        <button onClick={disconnect} className='button button-detail mt-16'>Disconnect Wallet</button>

      </div>
    </>
  )
}

export default Profile
