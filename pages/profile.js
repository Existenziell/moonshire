import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import useApp from "../context/App"
import Head from 'next/head'
import TabBar from '../components/TabBar'
import NftsGrid from '../components/NftsGrid'
import NftsList from '../components/NftsList'
import Settings from '../components/Settings'
import { PulseLoader } from 'react-spinners'

const Profile = () => {
  const { address, currentUser, hasMetamask } = useApp()
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('list')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const router = useRouter()

  async function fetchApi(...args) {
    let { data: nfts } = await supabase.from('nfts')
      .select(`*, collections(*), artists(*)`)
      .ilike('name', `%${search}%`)
      .order(sortBy, { ascending: sortAsc })

    nfts = nfts.filter(nft => (nft.owner === currentUser?.id))

    if (view === 'owned') {
      nfts = nfts.filter(nft => (
        nft.listed === false
      ))
    }
    if (view === 'listed') {
      nfts = nfts.filter(nft => (
        nft.listed === true
      ))
    }
    return nfts
  }

  const { status, data: nfts } = useQuery(["nfts", sortBy, sortAsc, search, view, currentUser?.id], () =>
    fetchApi()
  )

  useEffect(() => {
    if (router.query) {
      const isOnboarding = router.query.onboarding === 'true'
      setShowSettings(isOnboarding)
      setView(isOnboarding ? 'settings' : 'all')
    }
  }, [router.query])

  const navigate = (e) => {
    const link = e.target.name
    if (link === 'settings') {
      setShowSettings(true)
    } else {
      setShowSettings(false)
    }
    setView(link)
  }

  if (!address) return <p className='w-full h-full flex items-center justify-center'>Please connect your wallet to proceed.</p>
  if (!hasMetamask) return <p className='w-full h-full flex items-center justify-center'>Please install Metamask to proceed.</p>
  if (status === "error") return <p>{status}</p>

  return (
    <>
      <Head>
        <title>Profile | Project Moonshire</title>
        <meta name='description' content='Profile | Project Moonshire' />
      </Head>

      <div className='profile flex flex-col items-center px-[40px] w-full'>
        <TabBar
          links={['all', 'owned', 'listed', 'settings']}
          view={view}
          navigate={navigate}
          setDisplay={setDisplay}
          display={display}
          sortBy={sortBy}
          sortAsc={sortAsc}
          sortByDatePrice={(sort) => sortBy === sort ? setSortAsc(!sortAsc) : setSortBy(sort)}
          search={search}
          setSearch={setSearch}
          resetSearch={() => setSearch('')}
          length={nfts?.length}
        />

        <div className="flex flex-wrap justify-between gap-20 w-full">
          {showSettings ?
            <Settings />
            :
            status === 'loading' ?
              <div className='flex items-center justify-center w-full h-[calc(100vh-300px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
              :
              nfts?.length > 0 ?
                <>
                  <NftsGrid nfts={nfts} display={display} view={view} />
                  <NftsList nfts={nfts} display={display} />
                </>
                :
                <p className="flex flex-col items-center justify-center w-full">No results</p>
          }
        </div>
      </div>
    </>
  )
}

export default Profile
