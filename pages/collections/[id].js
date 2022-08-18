import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import TabBar from '../../components/TabBar'
import NftsGrid from '../../components/NftsGrid'
import NftsList from '../../components/NftsList'

const Collection = ({ collection, collectionNfts: nfts }) => {
  const { currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [initialNfts, setInitialNfts] = useState()
  const [filteredNfts, setFilteredNfts] = useState()
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('grid')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [search, setSearch] = useState('')
  const [userOwnsCollection, setUserOwnsCollection] = useState(false)

  useEffect(() => {
    if (currentUser) {
      if (currentUser.id === collection.user) setUserOwnsCollection(true)
    }
  }, [currentUser])

  const fetchNfts = async (sortBy, ascending) => {
    setLoading(true)

    let { data: nfts } = await supabase.from('nfts')
      .select(`*, collections(*), artists(*)`)
      .order(sortBy, { ascending: ascending })

    let collectionNfts = nfts.filter((n => n.collection === collection.id))
    if (view === 'sold') collectionNfts = collectionNfts.filter(n => (n.listed === false))
    if (view === 'available') collectionNfts = collectionNfts.filter(n => (n.listed === true))

    setFilteredNfts(collectionNfts)
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
    // setLoading(true)
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
    // setLoading(false)
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
    if (filteredNfts) {
      let nfts = filteredNfts.filter(n => (
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

  if (!filteredNfts) return <div className='flex items-center justify-center mt-32'>No result</div>

  return (
    <>
      <Head>
        <title>{collection.title} | Collection | Project Moonshire</title>
        <meta name='description' content={`${collection.title} | Collection | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] w-full'>
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

        {nfts.length > 0 ?
          <div className="flex flex-wrap justify-between gap-20 mb-20">

            {loading ?
              <div className='flex items-center justify-center w-full h-[calc(100vh-350px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
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
          :
          <div className='w-full flex flex-col items-center justify-center'>
            <h1 className='mb-0'>No NFTs have been created in this collection.</h1>
            {userOwnsCollection ?
              <Link href='/nfts/create'>
                <a className='button button-detail mt-8'>
                  Create NFT
                </a>
              </Link>
              :
              <div className='mt-4 flex flex-col items-center'>
                <p>
                  Unfortunately, you are not able to add NFTs to this collection,
                  since you&apos;re not the owner.
                </p>
                <p> Instead you can:</p>
                <Link href='/collections/create'>
                  <a className='button button-detail mt-8 uppercase'>
                    Create collection
                  </a>
                </Link>
              </div>
            }
          </div>
        }
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()
  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('name', { ascending: true })

  if (!collection) {
    return {
      redirect: {
        permanent: false,
        destination: "/collections",
      },
      props: {}
    }
  }

  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  return {
    props: { collection, collectionNfts },
  }
}

export default Collection
