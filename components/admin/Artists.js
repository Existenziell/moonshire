import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../lib/supabase'
import { AppContext } from '../../context/AppContext'
import Select from 'react-select'

const Artists = ({ artists, users }) => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [fetchedArtists, setFetchedArtists] = useState()
  const [formData, setFormData] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [ArtistToDelete, setArtistToDelete] = useState()

  useEffect(() => {
    setFetchedArtists(artists)
  }, [artists])

  function setData(e) {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  function setSelectData(e) {
    setFormData({ ...formData, ...{ user: e.value } })
  }

  const openAdd = () => {
    const panel = document.getElementById('addArtistForm')
    panel.classList.toggle('hidden')
  }

  const addArtist = async (e) => {
    e.preventDefault()
    console.log(formData);
    const { data, error } = await supabase
      .from('artists')
      .insert([{
        name: formData.name,
        headline: formData.headline,
        desc: formData.desc,
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
    closeBtn.style.display = "block"
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
    Array.from(inputs).forEach((el, i) => (el.disabled = true))
    setFormData({})
  }

  const editArtist = async (id) => {
    const artist = fetchedArtists.filter(c => c.id === id)[0]
    const { data, error } = await supabase
      .from('artists')
      .update({
        name: formData.name ? formData.name : artist.name,
        headline: formData.headline ? formData.headline : artist.headline,
        desc: formData.desc ? formData.desc : artist.desc,
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

  let ownerOptions = []
  users.forEach(u => {
    ownerOptions.push({ value: u.id, label: u.name ? u.name : u.username })
  })

  return (
    <div className='mt-12'>
      <h1 className='max-w-max px-6 py-3 mb-1 text-brand bg-brand-dark dark:text-brand-dark dark:bg-brand'>Artists</h1>

      <table className='shadow-lg bg-white text-brand-dark text-sm table-auto w-full' >
        <thead className='text-left'>
          <tr className='bg-brand text-brand-dark dark:text-brand-dark font-bold'>
            <th>ID</th>
            <th>Name</th>
            <th>Headline</th>
            <th>Description</th>
            <th>Origin</th>
            <th>Avatar</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>

          {!fetchedArtists?.length &&
            <tr className='p-4 dark:text-brand-dark'><td>No artists found.</td></tr>
          }

          {fetchedArtists?.map((artist, idx) => (
            <tr key={artist.id + artist.name} className={`relative anchor ${idx % 2 !== 0 && `bg-slate-100`}`}>
              <td>{artist.id}</td>
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
                  type='text' name='desc' id='desc'
                  onChange={setData} disabled required
                  defaultValue={artist.desc}
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
              <td>{artist.avatar_url}</td>

              <td className='text-center align-middle'>

                <div id={`${artist.id}-closeBtnArtist`} className='hidden'>
                  <button onClick={() => editArtist(artist.id)} aria-label='Edit Artist'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-green-700 hover:scale-110 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={() => closeEdit(artist)} aria-label='Close Edit Dialog'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer hover:text-red-700 pointer-events-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <button onClick={() => openEdit(artist.id)} id={`${artist.id}-openBtnArtist`} className='openBtn' aria-label='OpenEdit Dialog'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-slate-500 hover:scale-110 transition-all cursor-pointer pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>

              <td className='text-center align-middle'>
                <button onClick={() => toggleDeleteModal(artist.id)} aria-label='Toggle Delete Modal'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark hover:text-brand hover:scale-110 transition-all cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add artist */}
      <button onClick={openAdd} className='my-4 link flex items-center' aria-label='Open Add Artist Form'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add artist
      </button>

      <form onSubmit={addArtist} className='shadow-lg rounded-sm text-tiny dark:text-brand-dark max-w-max bg-brand p-4 hidden' id='addArtistForm' >
        Name <input type='text' name='name' id='name' placeholder='...' onChange={setData} required className='block mb-2 text-base' />
        Headline <input type='text' name='headline' id='headline' placeholder='...' onChange={setData} className='block mb-2 text-base' />
        Description <input type='text' name='desc' id='desc' placeholder='...' onChange={setData} className='block mb-2 text-base' />
        Origin <input type='text' name='origin' id='origin' placeholder='...' onChange={setData} className='block mb-2 text-base' />
        <input type='submit' className='button button-detail mt-6' value='Save' />
      </form>


      {/* Delete artist */}
      {
        showDelete &&
        <div className='fixed top-0 bottom-0 left-0 right-0 z-20 text-lg '>
          <div className='w-full h-full bg-black/80 flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center backdrop-blur-lg bg-white text-brand-dark rounded p-12'>
              <button
                onClick={() => setShowDelete(false)}
                className='absolute top-0 right-0 px-2 py-0 rounded-sm hover:text-brand text-2xl hover:bg-gray-100'
                aria-label='Close Delete Modal'
              >
                &times;
              </button>
              <p className='text-sm'>Deleting artist with ID {ArtistToDelete}</p>
              <p className='text-2xl mt-2'>Are you sure?</p>
              <div className='flex items-center gap-4 mt-6'>
                <button onClick={() => setShowDelete(false)} className='hover:text-brand hover:underline' aria-label='Cancel'>Cancel</button>
                <button onClick={deleteArtist} className='hover:text-brand hover:underline' aria-label='Delete Artist'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div >
  )
}

export default Artists
