import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import { PulseLoader } from 'react-spinners'

const Artists = ({ artists }) => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [fetchedArtists, setFetchedArtists] = useState()
  const [formData, setFormData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [ArtistToDelete, setArtistToDelete] = useState()

  useEffect(() => {
    setFetchedArtists(artists)
  }, [artists])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const toggleNewArtistForm = () => {
    const panel = document.getElementById('addArtistForm')
    panel.classList.toggle('hidden')
  }

  const addArtist = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('artists')
      .insert([{
        name: formData.name,
        headline: formData.headline,
        description: formData.description,
        origin: formData.origin
      }])

    if (!error) {
      notify("Artist added successfully!")
      const panel = document.getElementById('addArtistForm')
      panel.classList.toggle('hidden')
      setFormData({})
      const newEntry = data[0]
      setFetchedArtists([...fetchedArtists, newEntry])
    }
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
    <div className='mb-20'>
      <h2 className='mb-1'>Artists</h2>

      <table className='text-sm table-auto w-full'>
        <thead className='text-left'>
          <tr className='font-bold text-xs border-b-2 border-lines dark:border-lines-dark'>
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
        <tbody className='bg-detail dark:bg-detail-dark rounded'>

          {!fetchedArtists?.length &&
            <tr className='p-4 dark:text-brand'><td>No artists found.</td></tr>
          }

          {fetchedArtists?.map((artist) => (
            <tr key={artist.id + artist.name} className='relative'>

              <td>
                {artist.public_url ?
                  <img src={artist.public_url} alt='Artist Picture' className='w-12' />
                  :
                  "n/a"
                }
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
                <div id={`${artist.id}-closeBtnArtist`} className='hidden items-center justify-center gap-2'>
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
      <button onClick={toggleNewArtistForm} className='my-4 link flex items-center gap-1 text-xs' aria-label='Open Add Artist Form'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add artist
      </button>

      <form onSubmit={addArtist} className='shadow-lg rounded-sm dark:text-brand-dark max-w-max bg-brand p-4 hidden' id='addArtistForm' >
        <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='block mb-2 text-sm' />
        <input type='text' name='headline' id='headline' placeholder='Headline' onChange={setData} className='block mb-2 text-sm' />
        <input type='text' name='description' id='description' placeholder='Description' onChange={setData} className='block mb-2 text-sm' />
        <input type='text' name='origin' id='origin' placeholder='Origin' onChange={setData} className='block mb-2 text-sm' />
        <div className='flex items-center gap-2 mt-4'>
          <input type='submit' className='button button-admin' value='Save' />
          <button onClick={toggleNewArtistForm} className='button button-admin'>Cancel</button>
        </div>
      </form>

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
