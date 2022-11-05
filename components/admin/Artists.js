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

const Artists = () => {
  const { notify } = useApp()
  const [showDelete, setShowDelete] = useState(false)
  const [artistToDelete, setArtistToDelete] = useState()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function fetchApi(...args) {
    let { data: artists } = await supabase
      .from('artists')
      .select(`*`)
      .ilike('name', `%${search}%`)
      .order('created_at', { ascending: false })

    let { data: nfts } = await supabase.from('nfts').select(`*, artists(*), collections(*)`).order('created_at', { ascending: false })

    for (let artist of artists) {
      let collections = []
      for (let nft of nfts) {
        if (nft.artist === artist.id) collections.push(nft.collections)
      }
      const uniqueCollections = [...new Map(collections.map((item) => [item['id'], item])).values()]

      artist.collections = uniqueCollections
      artist.numberOfCollections = uniqueCollections.length

      const filteredNfts = nfts.filter(n => n.artist === artist.id)
      artist.nfts = filteredNfts
      artist.numberOfNfts = filteredNfts.length
    }
    return artists
  }

  const { status, data: artists } = useQuery(["artists", search], () => fetchApi())

  const toggleDeleteModal = (artist) => {
    setArtistToDelete(artist)
    setShowDelete(true)
  }

  const deleteArtist = async () => {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', artistToDelete.id)

    if (error) {
      notify(error.message)
    } else {
      notify("Artist deleted successfully!", 1500)
      setShowDelete(false)
      router.reload()
    }
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

  if (status === "error") return <p>{status}</p>
  if (status === 'success' & !artists) return <h1 className="mb-4 text-3xl">No artists found</h1>

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
                <th className='relative -left-2'>Avatar</th>
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
              {artists.length <= 0 ?
                <tr className="flex flex-col items-start"><td>No results</td></tr>
                :
                artists?.map((artist) => (
                  <tr key={artist.id + artist.name} className='relative'>
                    <td className='px-0 w-[80px]'>
                      <Link href={`/artists/${artist.id}`}>
                        <a>
                          {artist.avatar_url ?
                            <Image
                              width={60}
                              height={60}
                              placeholder="blur"
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}artists/${artist.avatar_url}`}
                              blurDataURL={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}artists/${artist.avatar_url}`}
                              alt='Artist Image'
                              className='w-[60px] aspect-square bg-cover'
                            />
                            :
                            "n/a"
                          }
                        </a>
                      </Link>
                    </td>
                    <td>{artist.name}</td>
                    <td className='max-w-[150px] truncate'>{artist.headline}</td>
                    <td className='max-w-[150px] truncate'>{artist.description}</td>
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

          <Link href='/admin/artists/create'>
            <a className='mt-6 link flex items-center gap-1 text-xs'>
              <PlusIcon className='w-4' />Add artist
            </a>
          </Link>
        </>
      }

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
              <p className='text-sm'>Deleting artist {artistToDelete.name}</p>
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
