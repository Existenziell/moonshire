import { supabase } from '../../lib/supabase'
import { useState, useEffect } from 'react'
import { shortenAddress } from '../../lib/shortenAddress'
import { PulseLoader } from 'react-spinners'
import useApp from "../../context/App"
import Head from 'next/head'
import Link from 'next/link'
import Search from '../../components/Search'
import fromExponential from 'from-exponential'

const Collection = ({ collection, collectionNfts: nfts }) => {
  const { currentUser } = useApp()
  const [loading, setLoading] = useState(false)
  const [initialNfts, setInitialNfts] = useState()
  const [filteredNfts, setFilteredNfts] = useState()
  const [view, setView] = useState('all')
  const [display, setDisplay] = useState('grid')
  const [sortBy, setSortBy] = useState('name')
  const [sortAsc, setSortAsc] = useState(true)
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

  const manageDisplay = (display) => {
    setDisplay(display)
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

  const truncate = (input) => input.length > 28 ? `${input.substring(0, 28)}...` : input

  if (!filteredNfts) return <div className='flex items-center justify-center mt-32'>No result</div>

  return (
    <>
      <Head>
        <title>{collection.title} | Collection | Project Moonshire</title>
        <meta name='description' content={`${collection.title} | Collection | Project Moonshire`} />
      </Head>

      <div className='px-[20px] md:px-[40px] w-full min-h-[calc(100vh-100px)]'>

        <div className='mb-10 flex justify-between w-full border-b-2 border-detail dark:border-detail-dark'>
          <ul className='text-[20px] flex gap-12 transition-colors'>
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

          <div className='flex items-center gap-8 relative bottom-2'>
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

        {nfts.length > 0 ?
          <div className="flex flex-wrap justify-between gap-20 mb-20">

            {loading ?
              <div className='flex items-center justify-center w-full mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
              :
              display === 'grid' ?
                filteredNfts?.length > 0 ?
                  <div className="flex flex-wrap justify-between gap-20 mt-20 w-full">
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
                          <div className="flex justify-between gap-8 items-center mt-6">
                            <h1 className="mb-0">{fromExponential(nft.price)} ETH</h1>
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
