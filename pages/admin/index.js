import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
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
  const { address, currentUser, contractBalance } = useApp()
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

  if (loading) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!address) return <p className='w-full h-full flex items-center justify-center'>Please connect your wallet to proceed.</p>
  if (!session) return <SupaAuth />

  return (
    <>
      <Head>
        <title>Admin | Project Moonshire</title>
        <meta name='description' content="Admin | Project Moonshire" />
      </Head>

      <AnimatePresence>
        <div className='admin px-[20px] md:px-[40px] min-h-[calc(100vh-190px)]'>
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
              {(currentUser.username === 'Zooloo' || currentUser.username === 'Chris') &&
                <li className={view === 'market' ? `relative top-[2px] pb-6 transition-colors border-b-2 border-white text-cta` : `hover:text-cta relative top-[2px]`} >
                  <button onClick={navigate} name='market'>
                    Market
                  </button>
                </li>
              }
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
                <Collections />
              </motion.div>
            }
            {view === 'artists' &&
              <motion.div
                key={'artists'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Artists />
              </motion.div>
            }
            {view === 'nfts' &&
              <motion.div
                key={'nfts'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Nfts />
              </motion.div>
            }
            {view === 'users' &&
              <motion.div
                key={'users'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-full'>
                <Users />
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
                  <p>Market contract address: <a href={`https://sepolia.etherscan.io/address/${marketplaceAddress}#code`} target='_blank' rel='noopener noreferrer nofollow' className='link'>{marketplaceAddress}</a></p>
                  <p>Contract Balance: {contractBalance} ETH</p>
                  {/* <p>Tokens minted: 88</p> */}
                  {/* <p>Total transactions: 94</p>
                  <p>Unique token holders: 5</p> */}
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
