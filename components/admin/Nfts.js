import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { shortenAddress } from '../../lib/shortenAddress'
import { PlusIcon, CheckIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import useApp from "../../context/App"
import Search from './Search'
import fromExponential from 'from-exponential'

const Nfts = ({ nfts }) => {
  const { notify } = useApp()

  const [fetchedNfts, setFetchedNfts] = useState()
  const [filteredNfts, setFilteredNfts] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [nftToDelete, setNftToDelete] = useState()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!nfts) {
      return
    }
    setFetchedNfts(nfts)
    setFilteredNfts(nfts)
  }, [nfts])

  const truncate = (input) => input.length > 30 ? `${input.substring(0, 30)}...` : input

  const toggleDeleteModal = (nft) => {
    setNftToDelete(nft)
    setShowDelete(true)
  }

  const deleteNft = async () => {
    const { error } = await supabase
      .from('nfts')
      .delete()
      .eq('id', nftToDelete.id)

    if (!error) {
      notify("NFT deleted successfully!")
      setShowDelete(false)
      const filtered = fetchedNfts.filter(c => { return c.id !== nftToDelete.id })
      setFetchedNfts(filtered)
      setFilteredNfts(filtered)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedNfts) {
      // if (search === '') resetSearch()
      let nfts = fetchedNfts.filter(n => (
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredNfts(nfts)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredNfts(fetchedNfts)
    setSearch('')
  }

  if (!fetchedNfts) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20 w-full'>

      <div className='flex justify-between items-center'>
        <h2 className='mb-6'>NFTs</h2>
        <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />
      </div>

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark'>
            <th>Media</th>
            <th>Name</th>
            <th>Description</th>
            <th>Artist</th>
            <th>Collection</th>
            <th>Price</th>
            <th>Wallet</th>
            <th className='text-right w-28'>Listed</th>
            <th className='text-right w-28'>Featured</th>
            <th className='text-right w-28'>Edit</th>
            <th className='text-right w-28'>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedNfts?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>
                No NFTs found.
                <Link href='/nfts/create/'>
                  <a className='link flex items-center gap-1 text-xs mt-6'>
                    <PlusIcon className='w-4' />Add NFT
                  </a>
                </Link>
              </td>
            </tr>
          }

          {!filteredNfts?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>
                No results
              </td>
            </tr>
          }

          {filteredNfts?.map((nft) => (
            <tr key={nft.id + nft.name} className='relative'>
              <td>
                <Link href={`/nfts/${nft.id}`}>
                  <a>
                    {nft.image_url ?
                      <img src={nft.image_url} alt='NFT Image' className='w-12 shadow aspect-square bg-cover' />
                      :
                      "n/a"
                    }
                  </a>
                </Link>
              </td>
              <td className='whitespace-nowrap'>{nft.name}</td>
              <td>{truncate(nft.description)}</td>
              <td className='whitespace-nowrap'>{nft.artists?.name}</td>
              <td className='whitespace-nowrap'>{truncate(nft.collections?.title)}</td>
              <td className='whitespace-nowrap text-cta'>{fromExponential(nft.price)} ETH</td>
              <td className='whitespace-nowrap'>
                {nft.walletAddress ?
                  shortenAddress(nft.walletAddress)
                  :
                  `n/a`
                }
              </td>
              <td className='whitespace-nowrap text-right w-28'>
                {nft.listed ?
                  <CheckIcon className='w-6 ml-auto' />
                  :
                  `No`
                }
              </td>
              <td className='whitespace-nowrap text-right w-28'>
                {nft.featured ?
                  <CheckIcon className='w-6 ml-auto' />
                  :
                  `No`
                }
              </td>

              <td className='text-right align-middle pr-0'>
                <Link href={`/admin/nfts/${nft.id}`}>
                  <a>
                    <button className='button-admin'>
                      Edit
                    </button>
                  </a>
                </Link>
              </td>

              <td className='text-right pr-0'>
                <div>
                  <button onClick={() => toggleDeleteModal(nft)} aria-label='Toggle Delete Modal' className='button-admin'>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {fetchedNfts.length > 0 &&
        <div className='mt-8 w-max'>
          <Link href='/nfts/create/'>
            <a className='link flex items-center gap-1 text-xs'>
              <PlusIcon className='w-4' />Add NFT
            </a>
          </Link>
        </div>
      }

      {/* Delete nft */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 pb-1 rounded-sm hover:text-cta text-2xl'
                aria-label='Close Delete Dialog'
              >
                &times;
              </button>
              <p className='text-sm mb-4'>Deleting NFT {nftToDelete.name}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteNft} className='button button-detail' aria-label='Delete NFT'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Nfts
