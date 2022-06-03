import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useWeb3React } from "@web3-react/core"
import Head from 'next/head'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/updateProfile'
import AddToHomeScreen from '../components/AddToHomeScreen'
import MyNfts from '../components/market/MyNfts'

const Profile = () => {
  const appCtx = useContext(AppContext)
  const { currentUser, setCurrentUser, disconnect, hasMetamask, notify } = appCtx
  const { account } = useWeb3React()

  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [modified, setModified] = useState(false)

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

      <div className='profile flex flex-col items-center justify-center px-4 md:px-8 pb-12 lg:w-2/3 lg:mx-auto'>

        <div className='flex flex-col items-center gap-2 mb-6'>
          <label htmlFor="username">
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUser(e)}
              placeholder='Username'
              className='text-4xl md:text-6xl font-serif'
            />
          </label>
          {modified &&
            <div className='flex flex-row gap-2'>
              <button onClick={updateUser} className='link text-xs block'>Save</button>
              <button onClick={resetInput} className='link text-xs block ml-1'>Cancel</button>
            </div>
          }
        </div>

        <div className='mb-8 text-xs flex flex-col gap-1'>
          <p>Membership: {is_premium ? `Premium` : `Free`}</p>
          <p>Joined: {createdAt?.slice(0, 10)}</p>
          <p>Wallet {account}</p>
        </div>

        <div className='max-w-lg'>
          <Avatar
            url={avatar_url}
            // size={150}
            onUpload={(url) => handleUpload(url)}
          />
        </div>

        <MyNfts />

        <div>
          <button onClick={disconnect} className='button button-detail'>Disconnect Wallet</button>
        </div>

        <AddToHomeScreen />
      </div>
    </>
  )
}

export default Profile
