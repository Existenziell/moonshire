import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import { getPublicUrl } from '../../lib/getPublicUrl'
import { PulseLoader } from 'react-spinners'

const Nfts = ({ nfts }) => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [fetchedNfts, setFetchedNfts] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [nftToDelete, setNftToDelete] = useState()

  useEffect(() => {
    enrichNfts(nfts)
  }, [nfts])

  const enrichNfts = async () => {
    for (let nft of nfts) {
      if (nft.image_url) {
        const url = await getPublicUrl('nfts', nft.image_url)
        nft.public_url = url
      }
    }
    setFetchedNfts(nfts)
  }

  const toggleDeleteModal = (id) => {
    setNftToDelete(id)
    setShowDelete(true)
  }

  const deleteNft = async () => {
    const { error } = await supabase
      .from('nfts')
      .delete()
      .eq('id', nftToDelete)

    if (!error) {
      notify("NFT deleted successfully!")
      setShowDelete(false)
      const filteredNfts = fetchedNfts.filter(c => { return c.id !== nftToDelete })
      setFetchedNfts(filteredNfts)
    }
  }

  if (!fetchedNfts) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20'>
      <h2 className='mb-1'>NFTs</h2>

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b-2 border-lines dark:border-lines-dark'>
            <th>Media</th>
            <th>Name</th>
            <th>Description</th>
            <th>Artist</th>
            <th>Collection</th>
            <th>Price</th>
            <th>Created</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedNfts?.length &&
            <tr className='p-4 dark:text-brand'><td>No NFTs found.</td></tr>
          }

          {fetchedNfts?.map((nft) => (
            <tr key={nft.id + nft.name} className='relative'>
              <td>
                {nft.public_url ?
                  <img src={nft.public_url} alt='NFT Image' className='w-12' />
                  :
                  "n/a"
                }
              </td>
              <td className='whitespace-nowrap'>{nft.name}</td>
              <td className=''>{nft.desc}</td>
              <td className='whitespace-nowrap'>{nft.artists?.name}</td>
              <td className='whitespace-nowrap'>{nft.collections?.title}</td>
              <td className='whitespace-nowrap text-admin-green'>{nft.price} ETH</td>
              <td className='whitespace-nowrap'>{nft.created_at.slice(0, 10)}</td>
              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(nft.id)} aria-label='Toggle Delete Modal' className='button-admin'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete nft */}
      {showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 pb-1 rounded-sm hover:text-cta text-2xl hover:bg-gray-100'
                aria-label='Close Delete Dialog'
              >
                &times;
              </button>
              <p className='text-sm'>Deleting nft with ID {nftToDelete}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteNft} className='button button-detail' aria-label='Delete NFT'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div >
  )
}

export default Nfts
