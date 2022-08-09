import { supabase } from '../../lib/supabase'
import { useRealtime, useFilter } from 'react-supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { shortenAddress } from '../../lib/shortenAddress'
import { PulseLoader } from 'react-spinners'
import Head from 'next/head'
import Link from 'next/link'
import fromExponential from 'from-exponential'
import Search from '../../components/Search'

const Nfts = () => {
  const [loading, setLoading] = useState(false)
  const [initialNfts, setInitialNfts] = useState()

  const router = useRouter()
  const { view: initialView, display: initialDisplay, sortBy: initialSort, asc } = router.query

  const [search, setSearch] = useState('')
  const [filteredNfts, setFilteredNfts] = useState()
  const [view, setView] = useState(initialView ? initialView : 'all')
  const [display, setDisplay] = useState(initialDisplay ? initialDisplay : 'grid')
  const [sortBy, setSortBy] = useState(initialSort ? initialSort : 'name')
  const [sortAsc, setSortAsc] = useState(asc ? asc : true)

  let [{ data: nfts }] = useRealtime('nfts', {
    select: {
      columns: '*, artists(*), collections(*)',
      filter: useFilter((query) => query.order(sortBy, { ascending: sortAsc }))
    }
  })

  const fetchNfts = async (sortBy, ascending) => {
    setLoading(true)
    let { data: nfts } = await supabase.from('nfts')
      .select(`*, collections(*), artists(*)`)
      .order(sortBy, { ascending: ascending })

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

  useEffect(() => {
    if (view && initialNfts) filterNfts(view)
  }, [view, initialNfts])

  useEffect(() => {
    if (initialDisplay) setDisplay(initialDisplay)
  }, [initialDisplay])

  useEffect(() => {
    if (initialView) setView(initialView)
  }, [initialView])

  const navigate = (e) => {
    filterNfts(e.target.name)
    router.push({
      pathname: '/nfts',
      query: { ...router.query, view: e.target.name }
    }, undefined, {})
  }

  const filterNfts = (view) => {
    setLoading(true)
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
    setLoading(false)
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
    router.push({
      pathname: '/nfts',
      query: { ...router.query, sortBy: sort, asc: sortAsc }
    }, undefined, {})
  }

  const manageDisplay = (display) => {
    setDisplay(display)
    router.push({
      pathname: '/nfts',
      query: { ...router.query, display: display }
    }, undefined, {})
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

  const truncate = (input) => input.length > 16 ? `${input.substring(0, 16)}...` : input

  if (!nfts) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  if (!filteredNfts) return <div className='flex items-center justify-center mt-32'>No result</div>

  return (
    <>
      <Head>
        <title>NFTs | Project Moonshire</title>
        <meta name='description' content="NFTs | Project Moonshire" />
      </Head>

      <div className='px-[20px] md:px-[40px] w-full min-h-[calc(100vh-100px)]'>

        <div className='mb-10 flex justify-between w-full border-b-2 border-detail dark:border-detail-dark'>
          <ul className='text-[30px] flex gap-20 transition-colors'>
            <li className={view === 'all' || view === undefined ? `pb-4 transition-colors border-b-2 border-white text-cta` : `hover:text-cta`}>
              <button onClick={navigate} name='all'>
                All
              </button>
            </li>
            <li className={view === 'available' ? `pb-4 transition-colors border-b-2 border-white text-cta` : `hover:text-cta`}>
              <button onClick={navigate} name='available'>
                Available
              </button>
            </li>
            <li className={view === 'sold' ? `pb-4 transition-colors border-b-2 border-white text-cta` : `hover:text-cta`}>
              <button onClick={navigate} name='sold'>
                Sold
              </button>
            </li>
          </ul>

          <div className='flex items-center justify-center gap-8'>
            {/* <span className='text-detail dark:text-detail-dark'>{filteredNfts.length} results</span> */}

            <button onClick={() => manageDisplay('grid')}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                className={`w-6 hover:text-cta dark:hover:text-cta ${display === 'grid' ? `text-cta` : `text-brand-dark/20 dark:text-white`}`}>
                <g transform="matrix(7.14286,0,0,7.14286,-6936.59,-905.458)" fill="currentColor">
                  <g transform="matrix(0.304236,0,0,1.51041,683.691,-64.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                  <g transform="matrix(0.304236,0,0,1.51041,691.691,-64.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                  <g transform="matrix(0.304236,0,0,1.51041,683.691,-56.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                  <g transform="matrix(0.304236,0,0,1.51041,691.691,-56.222)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                </g>
              </svg>
            </button>
            <button onClick={() => manageDisplay('list')}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                className={`w-6 hover:text-cta dark:hover:text-cta ${display === 'list' ? `text-cta` : `text-brand-dark/20 dark:text-white`}`} >
                <g transform="matrix(5,0,0,7.14286,-4980.62,-905.458)" fill="currentColor">
                  <g transform="matrix(1.01412,0,0,0.503469,38.0171,63.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                  <g transform="matrix(1.01412,0,0,0.503469,38.0171,67.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                  <g transform="matrix(1.01412,0,0,0.503469,38.0171,71.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                  <g transform="matrix(1.01412,0,0,0.503469,38.0171,75.1021)"><rect x="944.767" y="126.447" width="19.722" height="3.972" /></g>
                </g>
              </svg>
            </button>

            <button className='uppercase hover:text-cta' onClick={() => sortByDatePrice('created_at')}>
              <span className={`font-serif text-tiny w-8 inline-block ${sortBy === 'created_at' ? `text-cta` : `hover:text-cta dark:hover:text-cta`}`}>
                {sortBy === 'created_at' ?
                  sortAsc ? `Old` : `New`
                  :
                  `Date`
                }
              </span>
            </button>
            <button className='uppercase hover:text-cta' onClick={() => sortByDatePrice('price')}>
              <span className={`font-serif text-tiny w-8 inline-block ${sortBy === 'price' ? `text-cta` : `hover:text-cta dark:hover:text-cta`}`}>
                {sortBy === 'price' ?
                  sortAsc ? `Low` : `High`
                  :
                  `Price`
                }
              </span>
            </button>
            <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />
          </div>
        </div>

        {loading ?
          <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
          :
          display === 'grid' ?
            filteredNfts.length > 0 ?
              <div className="flex flex-wrap justify-between gap-20">
                {filteredNfts.map((nft, i) => (
                  <div key={i} className="flex flex-col justify-between w-min mb-44">
                    <Link href={`/nfts/${nft.id}`}>
                      <a>
                        <img
                          src={nft.image_url ? nft.image_url : nft.image}
                          alt='NFT Image'
                          className='w-full aspect-square object-cover min-w-[400px] shadow-2xl mb-6' />
                      </a>
                    </Link>

                    <div className="flex flex-col justify-between h-full">
                      <h1 className='mt-8 mb-6'>{truncate(nft.name)}</h1>
                      <div className="text-detail-dark dark:text-detail">
                        {/* <p>{nft.description}</p> */}
                        <div className='mb-2'>
                          <Link href={`/collections/${nft.collections.id}`}>
                            <a className='link-white'>
                              {nft.collections?.title ? nft.collections.title : nft.collection}
                            </a>
                          </Link>
                        </div>
                        <div className='mb-10'>
                          <Link href={`/artists/${nft.artists.id}`}>
                            <a className='link-white'>
                              {nft.artists?.name ? nft.artists.name : nft.artist}
                            </a>
                          </Link>
                        </div>
                        <hr />

                        {nft.owner && nft.seller &&
                          <>
                            <p className="mt-4">Owner: {shortenAddress(nft.owner)}</p>
                            <p>Seller: {shortenAddress(nft.seller)}</p>
                          </>
                        }
                      </div>
                      <div className="flex justify-between gap-8 items-end">
                        <h1 className="mt-4 mb-0">{fromExponential(nft.price)} ETH</h1>
                        <Link href={`/nfts/${nft.id}`}>
                          <a className='button button-cta uppercase'>
                            View
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className='flex flex-col items-center justify-center'>
                <h1 className="text-sm">No results</h1>
                {/* <Link href='/nfts/create'><a className='button button-detail'>Create Asset</a></Link> */}
              </div>

            :
            <table className='table-auto w-full mt-20'>
              <thead className='text-left'>
                <tr className='font-bold border-b-2 border-lines dark:border-lines-dark'>
                  <th className='pb-8'>Media</th>
                  <th className='pb-8'>Name</th>
                  <th className='pb-8'>Artist</th>
                  <th className='pb-8'>Collection</th>
                  <th className='pb-8'>Price</th>
                  <th className='pb-8'></th>
                </tr>
              </thead>
              <tbody>

                {!filteredNfts?.length &&
                  <tr className='p-4 dark:text-brand'>
                    <td colSpan={9}>
                      No results
                    </td>
                  </tr>
                }

                {filteredNfts?.map((nft) => (
                  <tr key={nft.id + nft.name} className='relative mb-[20px]'>
                    <td>
                      <Link href={`/nfts/${nft.id}`}>
                        <a>
                          {nft.image_url ?
                            <img src={nft.image_url} alt='NFT Image' className='w-[60px] shadow aspect-square bg-cover' />
                            :
                            "n/a"
                          }
                        </a>
                      </Link>
                    </td>
                    <td className='whitespace-nowrap'>{nft.name}</td>
                    <td className='whitespace-nowrap'>
                      <Link href={`/artists/${nft.artists.id}`}>
                        <a className='link-white'>
                          {nft.artists?.name ? nft.artists.name : nft.artist}
                        </a>
                      </Link>
                    </td>
                    <td className='whitespace-nowrap'>
                      <Link href={`/collections/${nft.collections.id}`}>
                        <a className='link-white'>
                          {nft.collections?.title ? nft.collections.title : nft.collection}
                        </a>
                      </Link>
                    </td>
                    <td className='whitespace-nowrap text-[20px]'>{fromExponential(nft.price)} ETH</td>

                    <td className='text-right w-28 pr-0'>
                      <div>
                        <button className='button button-cta'>
                          <Link href={`/nfts/${nft.id}`}>
                            <a>View</a>
                          </Link>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>
    </>
  )
}

export default Nfts
