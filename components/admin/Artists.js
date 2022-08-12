import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
import { PlusIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import useApp from "../../context/App"
import Search from './Search'

const Artists = ({ artists }) => {
  const { notify } = useApp()

  const [fetchedArtists, setFetchedArtists] = useState()
  const [filteredArtists, setFilteredArtists] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const [ArtistToDelete, setArtistToDelete] = useState()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFetchedArtists(artists)
    setFilteredArtists(artists)
  }, [artists])

  const toggleDeleteModal = (artist) => {
    setArtistToDelete(artist)
    setShowDelete(true)
  }

  const deleteArtist = async () => {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', ArtistToDelete.id)

    if (error) {
      notify(error.message)
    } else {
      notify("Artist deleted successfully!", 1500)
      setShowDelete(false)
      const filtered = fetchedArtists.filter(c => { return c.id !== ArtistToDelete.id })
      setFetchedArtists(filtered)
      setFilteredArtists(filtered)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fetchedArtists) {
      let artists = fetchedArtists.filter(c => (
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.headline.toLowerCase().includes(search.toLowerCase()) ||
        c.origin.toLowerCase().includes(search.toLowerCase())
      ))
      setFilteredArtists(artists)
    }
  }, [search])
  /* eslint-enable react-hooks/exhaustive-deps */

  const resetSearch = () => {
    setFilteredArtists(fetchedArtists)
    setSearch('')
  }

  const saveState = async (id, value) => {
    setLoading(true)
    const { error } = await supabase
      .from('artists')
      .update({
        featured: value
      })
      .eq('id', id)

    if (!error) {
      notify("Artist updated successfully!", 1500)
      setLoading(false)
    }
  }
  const truncate = (input) => input.length > 30 ? `${input.substring(0, 30)}...` : input

  if (!fetchedArtists) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20 w-full relative'>
      <Search search={search} setSearch={setSearch} resetSearch={resetSearch} />

      <table className='table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold border-b-2 border-lines dark:border-lines-dark'>
            <th>Avatar</th>
            <th>Name</th>
            <th>Headline</th>
            <th>Description</th>
            <th>Origin</th>
            <th className='text-right'>NFTs</th>
            <th className='text-right'>Featured</th>
            <th className='text-right'>Edit</th>
            <th className='text-right w-28'>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedArtists?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>No artists found.</td>
            </tr>
          }

          {!filteredArtists?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>
                No results
              </td>
            </tr>
          }

          {filteredArtists?.map((artist) => (
            <tr key={artist.id + artist.name} className='relative'>
              <td className='px-0'>
                <Link href={`/artists/${artist.id}`}>
                  <a>
                    {artist.avatar_url ?
                      <img src={artist.public_url} alt='Artist Image' className='w-[60px] shadow aspect-square bg-cover' />
                      :
                      "n/a"
                    }
                  </a>
                </Link>
              </td>
              <td>{artist.name}</td>
              <td>{truncate(artist.headline)}</td>
              <td>{truncate(artist.description)}</td>
              <td>{artist.origin}</td>
              <td className='text-right'>{artist.numberOfNfts}</td>

              <td className='whitespace-nowrap text-right'>
                <label htmlFor="featured" className="cursor-pointer flex items-center justify-end">
                  <input
                    type="checkbox"
                    id="featured"
                    defaultChecked={artist.featured}
                    onChange={(e) => saveState(artist.id, e.target.checked)}
                    disabled={loading}
                    className="text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600"
                  />
                </label>
              </td>

              <td className='text-right align-middle pr-0'>
                <Link href={`/admin/artists/${artist.id}`}>
                  <a>
                    <button className='button-admin ml-auto'>
                      Edit
                    </button>
                  </a>
                </Link>
              </td>

              <td className='text-right align-middle w-28 pr-0'>
                <button onClick={() => toggleDeleteModal(artist)} aria-label='Toggle Delete Modal' className='button-admin'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add artist */}
      <Link href='/admin/artists/create'>
        <a className='mt-6 link flex items-center gap-1 text-xs'>
          <PlusIcon className='w-4' />Add artist
        </a>
      </Link>

      {/* Delete artist */}
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
              <p className='text-sm'>Deleting artist {ArtistToDelete.name}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteArtist} className='button button-detail' aria-label='Delete Artist'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  )
}

export default Artists
