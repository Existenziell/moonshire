import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getPublicUrl } from '../../lib/supabase/getPublicUrl'
import { getSignedUrl } from '../../lib/supabase/getSignedUrl'
import { marketplaceAddress } from '../../config'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Nfts from '../../components/admin/Nfts'
import Collections from '../../components/admin/Collections'
import Artists from '../../components/admin/Artists'
import Users from '../../components/admin/Users'
import SupaAuth from '../../components/SupaAuth'
import useApp from "../../context/App"
import { motion, AnimatePresence } from "framer-motion"

const Admin = ({ nfts, collections, artists, users, tokenId }) => {
  const { currentUser, contractBalance } = useApp()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('collections')
  const router = useRouter()
  const { view: selectedView } = router.query

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
        <div className='admin px-[20px] md:px-[40px]'>
          <div className='mb-10'>
            <ul className='text-[30px] flex gap-20 transition-colors border-b border-detail dark:border-detail-dark'>
              <li className={view === 'collections' ? `pb-4 transition-colors border-b border-white text-cta` : `hover:text-cta`}>
                <button onClick={navigate} name='collections'>
                  Collections
                </button>
              </li>
              <li className={view === 'artists' ? `pb-4 transition-colors border-b border-white text-cta` : `hover:text-cta`}>
                <button onClick={navigate} name='artists'>
                  Artists
                </button>
              </li>
              <li className={view === 'nfts' ? `pb-4 transition-colors border-b border-white text-cta` : `hover:text-cta`}>
                <button onClick={navigate} name='nfts'>
                  NFTs
                </button>
              </li>
              <li className={view === 'users' ? `pb-4 transition-colors border-b border-white text-cta` : `hover:text-cta`} >
                <button onClick={navigate} name='users'>
                  Users
                </button>
              </li>
              {/* <li className={view === 'market' ? `pb-4 transition-colors border-b border-white text-cta` : `hover:text-cta`} >
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
                  <p>Tokens minted: {tokenId}</p>
                  <p>Total transactions: 84</p>
                  <p>Unique token holders: 4</p>
                </div>
              </motion.div>
            }
          </div>
        </div>
      </AnimatePresence>
    </>
  )
}

export async function getServerSideProps() {
  const { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('created_at', { ascending: false })
  const { data: collections } = await supabase.from('collections').select(`*`).order('created_at', { ascending: false })
  const { data: artists } = await supabase.from('artists').select(`*`).order('created_at', { ascending: false })
  const { data: users } = await supabase.from('users').select(`*, roles(*)`).order('username', { ascending: true })
  const { data: lastInserted } = await supabase.from('nfts').select(`*`).order('tokenId', { ascending: false }).limit(1).single()
  const tokenId = lastInserted.tokenId

  for (let artist of artists) {
    const artistNfts = nfts.filter((n => n.artist === artist.id))
    artist.numberOfNfts = artistNfts.length
    const url = await getPublicUrl('artists', artist.avatar_url)
    artist.public_url = url
  }

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

  return {
    props: { nfts, collections, artists, users, tokenId }
  }
}

export default Admin
