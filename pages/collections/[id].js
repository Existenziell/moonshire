import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { PulseLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import Head from 'next/head'
import TabBar from '../../components/TabBar'
import NftsGrid from '../../components/NftsGrid'
import NftsList from '../../components/NftsList'

const Collection = () => {
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')

  const router = useRouter()
  const { id } = router.query

  async function fetchApi(...args) {
    if (!id) return
    let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()
    let { data: nfts } = await supabase.from('nfts')
      .select(`*, artists(*), collections(*)`)
      .ilike('name', `%${search}%`)
      .order(sortBy, { ascending: sortAsc })

    let collectionNfts = nfts.filter(n => n.collection === collection.id)
    collection.numberOfNfts = collectionNfts.length

    if (view === 'sold') collectionNfts = collectionNfts.filter(n => (n.listed === false))
    if (view === 'available') collectionNfts = collectionNfts.filter(n => (n.listed === true))

    collection.nfts = collectionNfts

    return collection
  }

  const { status, data: collection } = useQuery(["collection", id, sortBy, sortAsc, search, view], () =>
    fetchApi()
  )

  const navigate = (e) => {
    setView(e.target.name)
  }

  if (status === "error") return <p>{status}</p>
  if (status === 'success' && !collection) return <h1 className="mb-4 text-3xl">Collection not found</h1>

  return (
    <>
      <Head>
        <title>{collection?.title} | Collection | Project Moonshire</title>
        <meta name='description' content={`${collection?.title} | Collection | Project Moonshire`} />
      </Head>

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
          length={collection?.nfts?.length}
        />

        {collection?.nfts ?
          <div className="flex flex-wrap justify-between gap-20 mb-20">
            {collection?.nfts?.length > 0 ?
              <>
                <NftsGrid nfts={collection.nfts} display={display} view={view} />
                <NftsList nfts={collection.nfts} display={display} />
              </>
              :
              <p className="flex flex-col items-center justify-center w-full">No results</p>

            }
          </div>
          :
          <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
        }
      </div>
    </>
  )
}

export default Collection
