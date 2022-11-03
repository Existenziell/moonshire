import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import TabBar from '../../components/TabBar'
import NftsGrid from '../../components/NftsGrid'
import NftsList from '../../components/NftsList'

const Nfts = () => {
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')

  async function fetchApi(...args) {
    let viewModifier = view === 'available'

    let { data: nfts } = await supabase.from('nfts')
      .select(`*, collections(*), artists(*)`)
      .ilike('name', `%${search}%`)
      .order(sortBy, { ascending: sortAsc })

    if (view !== 'all') {
      nfts = nfts.filter(nft => (
        nft.listed === viewModifier
      ))
    }

    return nfts
  }

  const { status, data: nfts } = useQuery(["nfts", sortBy, sortAsc, search, view], () =>
    fetchApi()
  )

  if (status === "error") return <p>{status}</p>

  const navigate = (e) => {
    setView(e.target.name)
  }

  return (
    <>
      <Head>
        <title>NFTs | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='px-[40px] w-full min-h-[calc(100vh-190px)]'>
        <TabBar links={['all', 'available', 'sold']}
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

        {status === 'loading' ?
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
    </>
  )
}

export default Nfts
