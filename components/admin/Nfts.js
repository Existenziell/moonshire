import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
// import { shortenAddress } from '../../lib/shortenAddress'
import { PlusIcon, CheckIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import useApp from "../../context/App"
import Search from './Search'
import Image from 'next/image'

const Nfts = ({ nfts }) => {
  const { notify } = useApp()

  const [fetchedNfts, setFetchedNfts] = useState()
  const [filteredNfts, setFilteredNfts] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [nftToDelete, setNftToDelete] = useState()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!nfts) {
      return
    }
    setFetchedNfts(nfts)
    setFilteredNfts(nfts)
  }, [nfts])

  const truncate = (input) => input?.length > 30 ? `${input?.substring(0, 30)}...` : input

  const toggleDeleteModal = (nft) => {
    setNftToDelete(nft)
    setShowDelete(true)
  }

  const deleteNft = async () => {
    const { error: eventsError } = await supabase
      .from('events')
      .delete()
      .eq('nft', nftToDelete.id)

    if (eventsError) {
      notify(eventsError.message)
      return
    }

    const { error } = await supabase
      .from('nfts')
      .delete()
      .eq('id', nftToDelete.id)

    if (!error) {
      notify("NFT deleted successfully!", 1500)
      setShowDelete(false)
      const filtered = fetchedNfts.filter(c => { return c.id !== nftToDelete.id })
      setFetchedNfts(filtered)
      setFilteredNfts(filtered)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedNfts) {
      const nfts = fetchedNfts.filter(n => (
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
    setFilteredNfts(fetchedNfts)
    setSearch('')
  }

  const saveState = async (id, value) => {
    setLoading(true)
    const { error } = await supabase
      .from('nfts')
      .update({
        featured: value
      })
      .eq('id', id)

    if (!error) {
      notify("NFT updated successfully!", 1500)
      setLoading(false)
    }
  }

  if (!fetchedNfts) return <div className='flex justify-center items-center w-full h-[calc(100vh-300px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>

  return (
    <div className='mb-20 w-full relative'>
      <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />

      <table className='table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold border-b-2 border-lines dark:border-lines-dark'>
            <th className='relative -left-2'>Media</th>
            <th className='relative left-4'>Name</th>
            <th>Description</th>
            <th>Artist</th>
            <th>Collection</th>
            <th>TokenId</th>
            <th>Price</th>
            {/* <th>Wallet</th> */}
            <th className='text-right'>Listed</th>
            <th className='text-right'>Featured</th>
            <th className='text-right'>Edit</th>
            <th className='text-right w-28'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {!filteredNfts?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={11} className='px-0'>
                No results
              </td>
            </tr>
          }

          {filteredNfts?.map((nft) => (
            <tr key={nft.id + nft.name} className='relative'>
              <td className='px-0 w-[80px]'>
                <Link href={`/nfts/${nft.id}`}>
                  <a>
                    {nft.image_url ?
                      <Image
                        width={60}
                        height={60}
                        placeholder="blur"
                        src={nft.image_url}
                        blurDataURL={nft.image_url}
                        alt='NFT Image'
                        className='w-[60px] shadow aspect-square bg-cover'
                      />
                      :
                      "n/a"
                    }
                  </a>
                </Link>
              </td>
              <td className='pl-6'>{nft.name}</td>
              <td>{truncate(nft.description)}</td>
              <td className='whitespace-nowrap'>{nft.artists?.name}</td>
              <td className='whitespace-nowrap'>{truncate(nft.collections?.title)}</td>
              <td>{nft.tokenId}</td>
              <td className='whitespace-nowrap text-cta'>{nft.price} ETH</td>
              {/* <td className='whitespace-nowrap'>
                {nft.walletAddress ?
                  shortenAddress(nft.walletAddress)
                  :
                  `n/a`
                }
              </td> */}
              <td className='whitespace-nowrap text-right'>
                {nft.listed ?
                  <CheckIcon className='w-6 ml-auto' />
                  :
                  `No`
                }
              </td>
              <td className='whitespace-nowrap text-right'>
                <label htmlFor="featured" className="cursor-pointer flex items-center justify-end">
                  <input
                    type="checkbox"
                    id="featured"
                    defaultChecked={nft.featured}
                    onChange={(e) => saveState(nft.id, e.target.checked)}
                    disabled={loading || !nft.listed}
                    className="text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
                  />
                </label>
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

              <td className='text-right w-28 pr-0'>
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

      <div className='mt-8 w-max'>
        <Link href='/nfts/create/'>
          <a className='link flex items-center gap-1 text-xs'>
            <PlusIcon className='w-4' />Add NFT
          </a>
        </Link>
      </div>

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
