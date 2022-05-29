import { useEffect, useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import Head from 'next/head'
import Link from 'next/link'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/updateProfile'
import SupaAuth from '../components/SupaAuth'
import getProfile from '../lib/getProfile'
import Wallet from '../components/Wallet'

const Profile = () => {
  const appCtx = useContext(AppContext)
  const { currentUser,
    walletConnected, setWalletConnected,
    walletAddress, setWalletAddress,
    provider, setProvider,
    isCorrectChain, setIsCorrectChain,
    notify } = appCtx

  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(null)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [modified, setModified] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setId(currentUser.id)
      setUsername(currentUser.username)
      setEmail(currentUser.email)
      setRole(currentUser.role)
      setAvatarUrl(currentUser.avatar_url)
      setCreatedAt(currentUser.created_at)
    }
  }, [currentUser])

  const setUser = (e) => {
    setUsername(e.target.value)
    setModified(true)
  }

  const updateUser = () => {
    updateProfile({ id, username, notify })
    setModified(false)
  }

  const resetInput = () => {
    setUsername(currentUser.username)
    setModified(false)
  }

  if (!walletAddress) {
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
              className='text-4xl font-serif'
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
          <p>Wallet {walletAddress}</p>
        </div>

        <div className='w-1/3'>
          <Avatar
            url={avatar_url}
            // size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile({ id, username, email, role, avatar_url: url, notify })
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Profile
