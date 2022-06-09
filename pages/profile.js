import { useEffect, useState } from 'react'
import { addToMetamask } from '../lib/addToMetamask'
import { shortenAddress } from '../lib/shortenAddress'
import useApp from "../context/App"
import Head from 'next/head'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/supabase/updateProfile'
import AddToHomeScreen from '../components/AddToHomeScreen'
import MyNfts from '../components/market/MyNfts'
import MyListedNfts from '../components/market/MyListedNfts'
import Link from 'next/link'

const Profile = () => {
  const { address, currentUser, setCurrentUser, disconnect, hasMetamask, notify } = useApp()

  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [modified, setModified] = useState(false)
  const [collections, setCollections] = useState([])

  useEffect(() => {
    if (currentUser) {
      const { username, avatar_url, is_premium, created_at, collections } = currentUser
      setUsername(username)
      setAvatarUrl(avatar_url)
      setCreatedAt(created_at)
      setIsPremium(is_premium)
      setCollections(collections)
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

  if (!address) {
    return (
      <p className='w-full h-full flex items-center justify-center'>
        Please connect your wallet to proceed.
      </p>
    )
  }

  return (
    <>
      <Head>
        <title>Profile | Project Moonshire</title>
        <meta name='description' content='Profile | Project Moonshire' />
      </Head>

      <div className='profile flex flex-col items-center justify-center px-[40px]'>

        <div className='flex flex-col md:flex-row md:gap-12'>
          <div className='max-w-md mx-auto flex-shrink-0'>
            <Avatar
              url={avatar_url}
              // size={150}
              onUpload={(url) => handleUpload(url)}
            />
          </div>
          <div>
            <div className='flex flex-col items-center gap-2 mb-10'>
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

            <div className='mb-10 text-xs flex flex-col gap-2 text-center rounded'>
              <p>Membership: {is_premium ? `Premium` : `Free`}</p>
              <p>Joined: {createdAt?.slice(0, 10)}</p>
              <p>Wallet {shortenAddress(address)}</p>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center gap-2 my-8'>
              <Link href='/collections/create'>
                <a className='button button-detail'>
                  Create Collection
                </a>
              </Link>
              <Link href='/nfts/create'>
                <a className='button button-detail'>
                  Create Asset
                </a>
              </Link>
            </div>
            <p className='text-tiny text-center'>By creating an asset it will be minted and put on sale on the marketplace.<br />Listing costs are 0.000001 ETH</p>
          </div>
        </div>

        <div className='flex flex-col items-start w-full mb-20'>
          <h2 className='mt-12 mb-4 py-2 border-b-2 border-detail dark:border-detail-dark'>
            Collections
          </h2>
          {collections?.length ?
            <div className='flex items-center justify-evenly flex-wrap gap-4'>
              {collections.map(collection => (
                <Link href={`/collections/${collection.id}`} key={collection.id}>
                  <a className='flex items-center justify-between gap-16 p-2 bg-detail dark:bg-detail-dark rounded-lg shadow hover:shadow-sm'>
                    <img src={collection.public_url} alt='Collection Image' className='w-20 aspect-square' />
                  </a>
                </Link>
              )
              )}
            </div>
            :
            <div className='flex flex-col items-center'>
              <p className='text-sm mb-6'>You haven&apos;t created any collections yet.</p>
              <Link href='/collections/create'>
                <a className='button button-detail'>
                  Create Collection
                </a>
              </Link>
            </div>
          }
        </div>

        <div className='w-full'>
          <MyNfts />
          <MyListedNfts />
        </div>

        <button className='button button-cta mt-24' onClick={addToMetamask}>Add to MetaMask</button>
        <p className='text-xs max-w-xs text-center mt-4'>This allows you to see the token from the Moonshire smart contract (called MOON) in your Metamask wallet.</p>

        <AddToHomeScreen />
        <button onClick={disconnect} className='button button-detail mt-16'>Disconnect Wallet</button>

      </div>
    </>
  )
}

export default Profile
