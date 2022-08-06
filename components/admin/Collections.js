import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { PlusIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import useApp from "../../context/App"
import Search from './Search'

const Collections = ({ collections }) => {
  const { notify } = useApp()
  const [fetchedCollections, setFetchedCollections] = useState()
  const [filteredCollections, setFilteredCollections] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFetchedCollections(collections)
    setFilteredCollections(collections)
  }, [collections])

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
      const filtered = fetchedCollections.filter(c => { return c.id !== collectionToDelete.id })
      setFetchedCollections(filtered)
      setFilteredCollections(filtered)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedCollections) {
      let collections = fetchedCollections.filter(c => (
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.headline.toLowerCase().includes(search.toLowerCase()) ||
        c.year.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredCollections(collections)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredCollections(fetchedCollections)
    setSearch('')
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

  const truncate = (input) => input.length > 30 ? `${input.substring(0, 30)}...` : input

  if (!fetchedCollections) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20 w-full relative'>
      <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark'>
            <th>Cover</th>
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

          {!fetchedCollections?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>
                No collections found.
                <Link href='/collections/create/'>
                  <a className='link flex items-center gap-1 text-xs mt-6'>
                    <PlusIcon className='w-4' />Add Collection
                  </a>
                </Link>
              </td>
            </tr>
          }

          {!filteredCollections?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>
                No results
              </td>
            </tr>
          }

          {filteredCollections?.map((collection) => (
            <tr key={collection.id + collection.title} className='relative'>
              <td>
                <Link href={`/collections/${collection.id}`}>
                  <a>
                    {collection.public_url ?
                      <img src={collection.public_url} alt='Collection Image' className='w-[60px] shadow aspect-square bg-cover' />
                      :
                      "n/a"
                    }
                  </a>
                </Link>
              </td>

              <td className='whitespace-nowrap'>{collection.title}</td>
              <td>{truncate(collection.headline)}</td>
              <td>{truncate(collection.description)}</td>
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
                    className="text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
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

      {fetchedCollections.length > 0 &&
        <div className='mt-8 w-max'>
          <Link href='/collections/create/'>
            <a className='link flex items-center gap-1 text-xs'>
              <PlusIcon className='w-4' />Add Collection
            </a>
          </Link>
        </div>
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
