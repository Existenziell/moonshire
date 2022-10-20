import { supabase } from '../../lib/supabase'
import { useRealtime, useFilter } from 'react-supabase'
import { useState, useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import TabBar from '../../components/TabBar'
import NftsGrid from '../../components/NftsGrid'
import NftsList from '../../components/NftsList'

const Nfts = () => {
  const [loading, setLoading] = useState(false)
  const [initialNfts, setInitialNfts] = useState()
  const [filteredNfts, setFilteredNfts] = useState()
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')

  const [{ data: nfts }] = useRealtime('nfts', {
    select: {
      columns: '*, artists(*), collections(*)',
      filter: useFilter((query) => query.order(sortBy, { ascending: sortAsc }))
    }
  })

  const fetchNfts = async (sortBy, ascending) => {
    setLoading(true)
    let { data: nfts } = await supabase.from('nfts')
      .select(`*, collections(*), artists(*)`)
      .order(sortBy, { ascending })

    if (view === 'sold') nfts = nfts.filter(n => (n.listed === false))
    if (view === 'available') nfts = nfts.filter(n => (n.listed === true))

    setFilteredNfts(nfts)
    setLoading(false)
  }

  useEffect(() => {
    if (!nfts) {
      return
    }
    setInitialNfts(nfts)
    setFilteredNfts(nfts)
  }, [nfts])

  const navigate = (e) => {
    filterNfts(e.target.name)
    setView(e.target.name)
  }

  const filterNfts = (view) => {
    let nfts
    switch (view) {
      case 'all':
        nfts = initialNfts
        break
      case 'available':
        nfts = initialNfts.filter(n => { return n.listed === true })
        break
      case 'sold':
        nfts = initialNfts.filter(n => { return n.listed === false })
        break
      default:
        nfts = filteredNfts
        break
    }
    resetSearch()
    setSortBy('name')
    setFilteredNfts(nfts)
  }

  const sortByDatePrice = (sort) => {
    if (sortBy === sort) {
      setSortAsc(!sortAsc)
      fetchNfts(sort, !sortAsc)
    } else {
      setSortBy(sort)
      fetchNfts(sort, sortAsc)
    }
    resetSearch()
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (initialNfts) {
      let nfts = initialNfts.filter(n => (
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase()) ||
        n.artists.name.toLowerCase().includes(search.toLowerCase()) ||
        n.collections.title.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredNfts(nfts)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredNfts(initialNfts)
    setSearch('')
  }

  if (!nfts) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!filteredNfts) return <div className='flex items-center justify-center mt-32'>No result</div>

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
          sortByDatePrice={sortByDatePrice}
          search={search}
          setSearch={setSearch}
          resetSearch={resetSearch}
          length={filteredNfts?.length}
        />

        {loading ?
          <div className='flex items-center justify-center w-full h-[calc(100vh-300px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
          :
          filteredNfts?.length > 0 ?
            <>
              <NftsGrid nfts={filteredNfts} display={display} view={view} />
              <NftsList nfts={filteredNfts} display={display} />
            </>
            :
            <p className="flex flex-col items-center justify-center w-full">No results</p>
        }
      </div>
    </>
  )
}

export default Nfts
