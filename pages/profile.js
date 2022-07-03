/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { addToMetamask } from '../lib/addToMetamask'
import { shortenAddress } from '../lib/shortenAddress'
import { PulseLoader } from 'react-spinners'
import useApp from "../context/App"
import Head from 'next/head'
import Avatar from '../components/Avatar'
import updateProfile from '../lib/supabase/updateProfile'
import AddToHomeScreen from '../components/AddToHomeScreen'
import MyNfts from '../components/market/MyNfts'
import MyListedNfts from '../components/market/MyListedNfts'
import Link from 'next/link'
import getUserCollections from '../lib/supabase/getUserCollections'
import fetchMyNfts from '../lib/contract/fetchMyNfts'
import fetchListedItems from '../lib/contract/fetchListedItems'
import getDbIdForTokenURI from '../lib/supabase/getDbIdForTokenURI'

const Profile = () => {
  const { address, currentUser, setCurrentUser, disconnect, hasMetamask, notify, signer } = useApp()
  const [username, setUsername] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const [is_premium, setIsPremium] = useState(null)
  const [modified, setModified] = useState(false)
  const [collections, setCollections] = useState(null)
  const [nftsOwned, setNftsOwned] = useState(null)
  const [nftsListed, setNftsListed] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (currentUser) {
      const { id, username, avatar_url, is_premium, created_at } = currentUser
      setUsername(username)
      setAvatarUrl(avatar_url)
      setCreatedAt(created_at)
      setIsPremium(is_premium)
      fetchUserCollections(id)
      fetchUserNfts(id)
    }
  }, [currentUser])

  const fetchUserCollections = async (id) => {
    let collections = await getUserCollections(id)
    setCollections(collections)
  }

  const fetchUserNfts = async (id) => {
    let listed = await fetchListedItems(signer)
    if (listed) {
      for (let nft of listed) {
        const dbId = await getDbIdForTokenURI(nft.tokenURI)
        nft.id = dbId
      }
      const activeListed = listed.filter(l => (l.id !== false))
      setNftsListed(activeListed)
    }

    let owned = await fetchMyNfts(signer)
    if (owned) {
      for (let nft of owned) {
        const dbId = await getDbIdForTokenURI(nft.tokenURI)
        nft.id = dbId
      }
      const activeOwned = owned.filter(o => (o.id !== false))
      setNftsOwned(activeOwned)
    }
    setFetching(false)
  }

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

      <div className='profile flex flex-col items-center px-[40px] w-full'>

        <div className='flex flex-col items-center md:flex-row gap-[40px] md:h-[calc(100vh-260px)] w-full'>
          <Avatar
            url={avatar_url}
            onUpload={(url) => handleUpload(url)}
          />
          <div className='flex flex-col md:items-start w-full md:w-1/2'>
            <div className='flex flex-col md:items-start md:justify-start'>
              <label htmlFor="username">
                <input
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUser(e)}
                  placeholder='Username'
                  className='text-4xl md:text-6xl text-left font-serif w-full ring-0 border-0 relative -left-4'
                />
              </label>
              {modified &&
                <div className='flex flex-row items-center gap-2 mt-2'>
                  <button onClick={updateUser} className='link text-xs'>Save</button>
                  <button onClick={resetInput} className='link text-xs ml-1'>Cancel</button>
                </div>
              }
              <hr className='mt-6 w-full' />

              {fetching ?
                <div className='flex gap-4 items-center mt-10'>
                  <PulseLoader color={'var(--color-cta)'} size={10} />
                  <p className='text-tiny'>Fetching assets from Blockchain...</p>
                </div>
                :
                <div className='mt-10'>
                  <h1 className='mb-0'>Assets</h1>
                  <hr className='my-8' />
                  <p className='mb-4'>{collections?.length} {collections?.length === 1 ? `Collection` : `Collections`}</p>
                  <div>
                    {collections?.map(c => (
                      <Link key={c.id} href={`/collections/${c.id}`}><a className='link-white block'>{c.title}</a></Link>
                    ))}
                  </div>
                  <div className={nftsListed.length >= 15 ? `flex items-start justify-start gap-20 mt-10` : ``}>
                    <div className={nftsListed.length >= 15 ? `` : `mt-8`}>
                      <p className='mb-4'>{nftsListed?.length} {nftsListed?.length === 1 ? `Listed NFT` : `Listed NFTs`}</p>
                      <div>
                        {nftsListed?.map(n => (
                          <Link key={n.name} href={`/nfts/${n.id}`}><a className='link-white block'>{n.name}</a></Link>
                        ))}
                      </div>
                    </div>
                    <div className={nftsListed.length >= 15 ? `` : `mt-8`}>
                      <p className='mb-4'>{nftsOwned?.length} {nftsOwned?.length === 1 ? `Owned NFT` : `Owned NFTs`}</p>
                      <div>
                        {nftsOwned?.map(n => (
                          <Link key={n.name} href={`/nfts/${n.id}`}><a className='link-white block'>{n.name}</a></Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            {/* <div className='text-xs flex flex-col md:items-start gap-2 text-center rounded'>
              <p>Membership: {is_premium ? `Premium` : `Free`}</p>
              <p>Joined: {createdAt?.slice(0, 10)}</p>
              <p>Wallet {shortenAddress(address)}</p>
            </div> */}

            {/* <div className='flex flex-col md:flex-row justify-center items-center gap-2 mt-4'>
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
            </div> */}
            {/* <p className='text-tiny text-center md:text-left'>By creating an asset it will be minted and put on sale on the marketplace.<br />Listing costs are 0.000001 ETH</p> */}
          </div>
        </div>

        {/* <div className='flex flex-col items-start w-full mb-20'>
          <h2 className='mt-12 mb-4 py-2 border-b-2 border-detail dark:border-detail-dark w-full'>
            Collections
          </h2>
          {collections ?
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
              <p className='text-sm'>You haven&apos;t created any collections yet.</p>
              <Link href='/collections/create'>
                <a className='button button-detail'>
                  Create Collection
                </a>
              </Link>
            </div>
          }
        </div> */}

        {/* <div className='w-full'>
          <MyListedNfts />
          <MyNfts />
        </div> */}

        {/* <button className='button button-cta mt-24' onClick={addToMetamask}>Add to MetaMask</button>
        <p className='text-xs max-w-xs text-center md:text-left mt-4'>This allows you to see the token from the Moonshire smart contract (called MOON) in your Metamask wallet.</p>

        <AddToHomeScreen />
        <button onClick={disconnect} className='button button-detail my-16'>Disconnect Wallet</button> */}

      </div>
    </>
  )
}

export default Profile
