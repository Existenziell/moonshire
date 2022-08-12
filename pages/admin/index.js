import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRealtime } from 'react-supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import { getSignedUrl } from '../../lib/supabase/getSignedUrl'
import { marketplaceAddress } from '../../config'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import { motion, AnimatePresence } from "framer-motion"
import Head from 'next/head'
import Nfts from '../../components/admin/Nfts'
import Collections from '../../components/admin/Collections'
import Artists from '../../components/admin/Artists'
import Users from '../../components/admin/Users'
import SupaAuth from '../../components/SupaAuth'
import useApp from "../../context/App"

const Admin = () => {
  const { currentUser, contractBalance } = useApp()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('collections')
  const [lastTokenId, setLastTokenId] = useState()
  const router = useRouter()
  const { view: selectedView } = router.query

  const [resultCollections] = useRealtime('collections')
  const [resultArtists] = useRealtime('artists')
  const [resultUsers] = useRealtime('users', { select: { columns: '*, roles(*)' } })
  const [resultNfts] = useRealtime('nfts', { select: { columns: '*, artists(*), collections(*)' } })

  const { data: collections } = resultCollections
  const { data: nfts } = resultNfts
  const { data: artists } = resultArtists
  const { data: users } = resultUsers

  useEffect(() => {
    setLastTokenId(nfts?.at(length - 1)?.tokenId)
  }, [nfts])

  const enrichCollections = async () => {
    for (let collection of collections) {
      const url = await getPublicUrl('collections', collection.image_url)
      collection.public_url = url

      if (nfts) {
        const collectionNfts = nfts.filter((n => n.collection === collection.id))
        collection.numberOfNfts = collectionNfts.length
      } else {
        collection.numberOfNfts = 0
      }
    }
  }

  const enrichArtists = async () => {
    for (let artist of artists) {
      const artistNfts = nfts?.filter((n => n.artist === artist.id))
      artist.numberOfNfts = artistNfts?.length
      const url = await getPublicUrl('artists', artist.avatar_url)
      artist.public_url = url
    }
  }

  const enrichUsers = async () => {
    for (let user of users) {
      if (user.avatar_url) {
        const url = await getSignedUrl('avatars', user.avatar_url)
        user.signed_url = url
      }

      let userCollections = collections.filter(c => (c.user === user.id))
      let userNfts = nfts.filter(nft => (nft.user === user.id))
      user.numberOfCollections = userCollections.length
      user.numberOfNfts = userNfts.length
    }
  }

  if (collections && nfts) enrichCollections()
  if (artists && nfts) enrichArtists()
  if (users && nfts && collections) enrichUsers()

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.roles?.name === 'Admin') {
        setLoading(false)
      } else {
        router.push('/')
      }
    }
  }, [currentUser?.roles?.name])

  useEffect(() => {
    if (selectedView) setView(selectedView)
  }, [selectedView])

  const navigate = (e) => {
    router.push({
      pathname: '/admin',
      query: { view: e.target.name },
    }, undefined, { shallow: true })
  }

  if (loading) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  if (!session) return <SupaAuth />

  return (
    <>
      <Head>
        <title>Admin | Project Moonshire</title>
        <meta name='description' content="Admin | Project Moonshire" />
      </Head>

      <AnimatePresence>
        <div className='admin px-[20px] md:px-[40px] min-h-[calc(100vh-100px)]'>
          <div className='mb-10 border-b-2 border-detail dark:border-detail-dark'>
            <ul className='text-[20px] flex gap-12 transition-colors '>
              <li className={view === 'collections' ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`}>
                <button onClick={navigate} name='collections'>
                  Collections
                </button>
              </li>
              <li className={view === 'artists' ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`}>
                <button onClick={navigate} name='artists'>
                  Artists
                </button>
              </li>
              <li className={view === 'nfts' ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`}>
                <button onClick={navigate} name='nfts'>
                  NFTs
                </button>
              </li>
              <li className={view === 'users' ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`} >
                <button onClick={navigate} name='users'>
                  Users
                </button>
              </li>
              {/* <li className={view === 'market' ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`} >
                <button onClick={navigate} name='market'>
                  Market
                </button>
              </li> */}
            </ul>
          </div>

          <div className='flex flex-col items-start'>
            {view === 'collections' &&
              <motion.div
                key={'collections'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Collections collections={collections} />
              </motion.div>
            }
            {view === 'artists' &&
              <motion.div
                key={'artists'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Artists artists={artists} collections={collections} />
              </motion.div>
            }
            {view === 'nfts' &&
              <motion.div
                key={'nfts'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Nfts nfts={nfts} />
              </motion.div>
            }
            {view === 'users' &&
              <motion.div
                key={'users'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Users users={users} />
              </motion.div>
            }
            {view === 'market' &&
              <motion.div
                key={'market'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <div className='flex flex-col gap-2'>
                  <p>Market contract address: <a href={`https://rinkeby.etherscan.io/address/${marketplaceAddress}#code`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{marketplaceAddress}</a></p>
                  <p>Contract Balance: {contractBalance} ETH</p>
                  <p>Tokens minted: {lastTokenId}</p>
                  <p>Total transactions: 94</p>
                  <p>Unique token holders: 5</p>
                </div>
              </motion.div>
            }
          </div>
        </div>
      </AnimatePresence>
    </>
  )
}

export default Admin
