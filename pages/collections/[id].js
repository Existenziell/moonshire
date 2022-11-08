import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { PulseLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import Head from 'next/head'
import TabBar from '../../components/TabBar'
import NftsGrid from '../../components/NftsGrid'
import NftsList from '../../components/NftsList'
import useApp from '../../context/App'

const Collection = () => {
  const router = useRouter()
  const { id: queryId } = router.query
  const { conversionRateEthUsd } = useApp()
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')

  async function fetchCollection(...args) {
    if (!queryId) return
    let { data: collection } = await supabase.from('collections').select(`*`).eq('id', queryId).single()
    return collection
  }

  async function fetchNfts(...args) {
    if (!queryId) return
    let { data: nfts } = await supabase.from('nfts')
      .select(`*, artists(*), collections(*)`)
      .ilike('name', `%${search}%`)
      .eq('collection', queryId)
      .order(sortBy, { ascending: sortAsc })

    if (view === 'sold') nfts = nfts.filter(n => (n.listed === false))
    if (view === 'available') nfts = nfts.filter(n => (n.listed === true))
    return nfts
  }

  const { statusCollection, data: collection } = useQuery(["collection", queryId], () =>
    fetchCollection()
  )

  const { statusNfts, data: nfts } = useQuery(["nfts", collection?.id, sortBy, sortAsc, search, view], () =>
    fetchNfts()
  )

  const navigate = (e) => (setView(e.target.name))

  if (statusCollection === "error" || statusNfts === 'error') return <p>Error</p>
  if (statusCollection === 'success' && !collection) return <h1 className="mb-4 text-3xl">Collection not found</h1>
  if (statusCollection === 'loading' || statusNfts === 'loading') return <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (statusNfts === 'loading') return <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>

  return (
    <>
      <Head>
        <title>{collection?.title} | Collection | Project Moonshire</title>
        <meta name='description' content={`${collection?.title} | Collection | Project Moonshire`} />
      </Head>

      <h1 className="h-16 flex items-center justify-center text-center bg-detail dark:bg-detail-dark mb-4">
        {collection?.title}
      </h1>

      <div className='px-[20px] md:px-[40px] w-full'>
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

        {nfts ?
          <div className="flex flex-wrap justify-between gap-20 mb-20">
            {nfts?.length > 0 ?
              <>
                <NftsGrid nfts={nfts} display={display} view={view} conversionRateEthUsd={conversionRateEthUsd} />
                <NftsList nfts={nfts} display={display} conversionRateEthUsd={conversionRateEthUsd} />
              </>
              :
              <p className="flex flex-col items-center justify-center w-full">No results</p>

            }
          </div>
          :
          <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
        }
      </div>
    </>
  )
}

export default Collection
