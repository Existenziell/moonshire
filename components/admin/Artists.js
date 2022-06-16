import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'
import useApp from "../../context/App"
import AddArtist from './AddArtist'
import { PlusIcon, XIcon } from '@heroicons/react/solid'

const Artists = ({ artists }) => {
  const { notify } = useApp()

  const [fetchedArtists, setFetchedArtists] = useState()
  const [formData, setFormData] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [ArtistToDelete, setArtistToDelete] = useState()
  const [showAdd, setShowAdd] = useState(false)
  useEffect(() => {
    setFetchedArtists(artists)
  }, [artists])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const openEdit = (id) => {
    const openBtn = document.getElementById(`${id}-openBtnArtist`)
    const closeBtn = document.getElementById(`${id}-closeBtnArtist`)
    const inputs = document.getElementsByClassName(`${id}-inputArtist`)
    const openEditBtns = document.getElementsByClassName('openBtnArtist')
    openBtn.style.display = "none"
    closeBtn.style.display = "flex"
    Array.from(openEditBtns).forEach(el => (el.disabled = true))
    Array.from(inputs).forEach(el => (el.disabled = false))
  }

  const closeEdit = (artist) => {
    const openBtn = document.getElementById(`${artist.id}-openBtnArtist`)
    const closeBtn = document.getElementById(`${artist.id}-closeBtnArtist`)
    const inputs = document.getElementsByClassName(`${artist.id}-inputArtist`)
    const openEditBtns = document.getElementsByClassName('openBtnArtist')

    openBtn.style.display = "block"
    closeBtn.style.display = "none"
    Array.from(openEditBtns).forEach(el => (el.disabled = false))
    Array.from(inputs).forEach(el => (el.disabled = true))
    setFormData({})
  }

  const editArtist = async (id) => {
    const artist = fetchedArtists.filter(c => c.id === id)[0]
    const { error } = await supabase
      .from('artists')
      .update({
        name: formData.name ? formData.name : artist.name,
        headline: formData.headline ? formData.headline : artist.headline,
        description: formData.description ? formData.description : artist.description,
        origin: formData.origin ? formData.origin : artist.origin,
      })
      .eq('id', id)

    if (!error) {
      notify("Artist updated successfully!")
      const openBtn = document.getElementById(`${id}-openBtnArtist`)
      const closeBtn = document.getElementById(`${id}-closeBtnArtist`)
      const inputs = document.getElementsByClassName(`${id}-inputArtist`)
      const openEditBtns = document.getElementsByClassName('openBtnArtist')

      openBtn.style.display = "block"
      closeBtn.style.display = "none"
      Array.from(openEditBtns).forEach(el => (el.disabled = false))
      Array.from(inputs).forEach(el => (el.disabled = true))
      setFormData({})
    }
  }

  const toggleDeleteModal = (id) => {
    setArtistToDelete(id)
    setShowDelete(true)
  }

  const deleteArtist = async () => {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', ArtistToDelete)

    if (!error) {
      notify("Artist deleted successfully!")
      setShowDelete(false)
      const filteredArtists = fetchedArtists.filter(c => { return c.id !== ArtistToDelete })
      setFetchedArtists(filteredArtists)
    }
  }

  if (!fetchedArtists) return <div className='flex items-center justify-center'><PulseLoader color={'var(--color-cta)'} size={20} /></div>

  return (
    <div className='mb-20 w-full'>
      <h2 className='mb-6'>Artists</h2>

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b border-lines dark:border-lines-dark'>
            <th>Avatar</th>
            <th>Name</th>
            <th>Headline</th>
            <th>Description</th>
            <th>Origin</th>
            <th className='whitespace-nowrap'># NFTs</th>
            <th>Created</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedArtists?.length &&
            <tr className='p-4 dark:text-brand'>
              <td colSpan={9}>No artists found.</td>
            </tr>
          }

          {fetchedArtists?.map((artist) => (
            <tr key={artist.id + artist.name} className='relative'>
              <td>
                <Link href={`/artists/${artist.id}`}>
                  <a>
                    {artist.avatar_url ?
                      <img src={artist.avatar_url} alt='Artist Image' className='w-12' />
                      :
                      "n/a"
                    }
                  </a>
                </Link>
              </td>
              <td>
                <input
                  type='text' name='name' id='name'
                  onChange={setData} disabled required
                  defaultValue={artist.name}
                  className={`${artist.id}-inputArtist`}
                />
              </td>
              <td>
                <input
                  type='text' name='headline' id='headline'
                  onChange={setData} disabled
                  defaultValue={artist.headline}
                  className={`${artist.id}-inputArtist`}
                />
              </td>
              <td>
                <input
                  type='text' name='description' id='description'
                  onChange={setData} disabled required
                  defaultValue={artist.description}
                  className={`${artist.id}-inputArtist`}
                />
              </td>
              <td>
                <input
                  type='text' name='origin' id='origin'
                  onChange={setData} disabled required
                  defaultValue={artist.origin}
                  className={`${artist.id}-inputArtist`}
                />
              </td>

              <td>
                {artist.numberOfNfts}
              </td>

              <td className='whitespace-nowrap'>{artist.created_at.slice(0, 10)}</td>

              <td className='text-center align-middle'>
                <div id={`${artist.id}-closeBtnArtist`} className='hidden items-center justify-between gap-2'>
                  <button onClick={() => editArtist(artist.id)} aria-label='Edit Artist' className='button-admin'>
                    Save
                  </button>
                  <button onClick={() => closeEdit(artist)} aria-label='Close Edit Dialog' className='button-admin'>
                    Cancel
                  </button>
                </div>
                <button onClick={() => openEdit(artist.id)} id={`${artist.id}-openBtnArtist`} className='openBtn button-admin' aria-label='OpenEdit Dialog'>
                  Edit
                </button>
              </td>

              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(artist.id)} aria-label='Toggle Delete Modal' className='button-admin'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Add artist */}
      <button onClick={() => setShowAdd(!showAdd)} className='my-4 link flex items-center gap-1 text-xs' aria-label='Open Add Artist Form'>
        {showAdd ?
          <>
            <XIcon className='w-4' />Close
          </>
          :
          <>
            <PlusIcon className='w-4' />Add artist
          </>
        }
      </button>
      {showAdd &&
        <AddArtist showAdd={showAdd} setShowAdd={setShowAdd} fetchedArtists={fetchedArtists} setFetchedArtists={setFetchedArtists} />
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
              <p className='text-sm'>Deleting artist with ID {ArtistToDelete}</p>
              <h1>Are you sure?</h1>
              <div className='flex items-center gap-4'>
                <button onClick={() => setShowDelete(false)} className='button button-detail' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteArtist} className='button button-detail' aria-label='Delete Artist'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div >
  )
}

export default Artists
