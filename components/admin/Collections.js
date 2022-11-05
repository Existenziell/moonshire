import { useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { PlusIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import useApp from "../../context/App"
import Search from './Search'
import Image from 'next/image'

const Collections = () => {
  const { notify } = useApp()
  const [showDelete, setShowDelete] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function fetchApi(...args) {
    let { data: collections } = await supabase
      .from('collections')
      .select(`*`)
      .ilike('title', `%${search}%`)
      .order('created_at', { ascending: false })

    let { data: nfts } = await supabase
      .from('nfts')
      .select(`*, artists(*), collections(*)`)
      .order('created_at', { ascending: false })

    for (let collection of collections) {
      let collectionPrice = 0.0

      if (nfts) {
        const collectionNfts = nfts.filter(n => n.collection === collection.id)
        if (collectionNfts.length > 0) {
          collection.numberOfNfts = collectionNfts.length
          const collectionArtists = []
          for (let nft of collectionNfts) {
            collectionArtists.push(nft.artists)
            // Prevent JS floating point madness...
            collectionPrice = +(collectionPrice + nft.price).toFixed(12)
          }
          // Filter deep inside the array of objects for artist.name
          const uniqueCollectionArtists = collectionArtists.filter((artist, index, array) => array.findIndex(a => a.name === artist.name) === index)
          collection.uniqueArtists = uniqueCollectionArtists
        } else {
          collection.numberOfNfts = 0
        }
      } else {
        collection.numberOfNfts = 0
      }
      collection.price = collectionPrice
    }
    return collections
  }

  const { status, data: collections } = useQuery(["collections", search], () =>
    fetchApi()
  )

  const toggleDeleteModal = (collection) => {
    setCollectionToDelete(collection)
    setShowDelete(true)
  }

  const deleteCollection = async () => {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionToDelete.id)

    if (error) {
      notify(error.message)
    } else {
      notify("Collection deleted successfully!", 1500)
      setShowDelete(false)
      router.reload()
    }
  }

  const saveState = async (id, value) => {
    setLoading(true)
    const { error } = await supabase
      .from('collections')
      .update({
        featured: value
      })
      .eq('id', id)

    if (!error) {
      notify("Collection updated successfully!", 1500)
      setLoading(false)
    }
  }

  if (status === "error") return <p>{status}</p>
  if (status === 'success' & !collections) return <h1 className="mb-4 text-3xl">No collections found</h1>

  return (
    <div className='mb-20 w-full relative'>
      <Search search={search} setSearch={setSearch} resetSearch={() => setSearch('')} />

      {status === 'loading' ?
        <div className='flex items-center justify-center min-w-max h-[calc(100vh-420px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
        :
        <>
          <table className='table-auto w-full'>
            <thead className='text-left'>
              <tr className='font-bold border-b-2 border-lines dark:border-lines-dark'>
                <th className='relative -left-2'>Cover</th>
                <th>Title</th>
                <th>Headline</th>
                <th>Description</th>
                <th>Year</th>
                <th className='text-right'>NFTs</th>
                <th className='text-right'>Featured</th>
                <th className='text-right'>Edit</th>
                <th className='text-right w-28'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {collections?.length <= 0 ?
                <tr className="flex flex-col items-start"><td>No results</td></tr>
                :
                collections?.map((collection) => (
                  <tr key={collection.id + collection.title} className='relative'>
                    <td className='px-0 w-[80px]'>
                      <Link href={`/collections/${collection.id}`}>
                        <a>
                          {collection.image_url ?
                            <Image
                              width={60}
                              height={60}
                              placeholder="blur"
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}collections/${collection.image_url}`}
                              blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}collections/${collection.image_url}`}
                              alt='Collection Image'
                              className='w-[60px] shadow aspect-square bg-cover'
                            />
                            :
                            "n/a"
                          }
                        </a>
                      </Link>
                    </td>

                    <td className='max-w-[150px] truncate whitespace-nowrap'>{collection.title}</td>
                    <td className='max-w-[150px] truncate'>{collection.headline}</td>
                    <td className='max-w-[150px] truncate'>{collection.description}</td>
                    <td>{collection.year}</td>
                    <td className='text-right'>{collection.numberOfNfts}</td>

                    <td className='whitespace-nowrap text-right'>
                      <label htmlFor="featured" className="cursor-pointer flex items-center justify-end">
                        <input
                          type="checkbox"
                          id="featured"
                          defaultChecked={collection.featured}
                          onChange={(e) => saveState(collection.id, e.target.checked)}
                          disabled={loading}
                        />
                      </label>
                    </td>

                    <td className='text-right align-middle pr-0'>
                      <Link href={`/admin/collections/${collection.id}`}>
                        <a>
                          <button className='button-admin'>
                            Edit
                          </button>
                        </a>
                      </Link>
                    </td>

                    <td className='text-right align-middle w-28 pr-0'>
                      <button onClick={() => toggleDeleteModal(collection)} aria-label='Toggle Delete Modal' className='button-admin'>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className='mt-8 w-max'>
            <Link href='/collections/create/'>
              <a className='link flex items-center gap-1 text-xs'>
                <PlusIcon className='w-4' />Add Collection
              </a>
            </Link>
          </div>
        </>
      }

      {/* Delete collection */}
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
              <p className='text-sm mb-4'>Deleting collection {collectionToDelete.title}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteCollection} className='button button-detail' aria-label='Delete Collection'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Collections
