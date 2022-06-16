import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import FilePicker from '../market/FilePicker'
import useApp from "../../context/App"
import uploadFileToIpfs from '../../lib/uploadFileToIpfs'

const AddArtist = ({ showAdd, setShowAdd, fetchedArtists, setFetchedArtists }) => {
  const { notify } = useApp()
  const [formData, setFormData] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const handleUpload = async (e) => {
    const url = await uploadFileToIpfs(e)
    setFileUrl(url)
  }

  const addArtist = async (e) => {
    e.preventDefault()
    if (!fileUrl) {
      notify("Please choose a picture for the artist")
      return
    }

    const { data, error } = await supabase
      .from('artists')
      .insert([{
        name: formData.name,
        headline: formData.headline,
        description: formData.description,
        origin: formData.origin,
        avatar_url: fileUrl,
      }])

    if (!error) {
      notify("Artist added successfully!")
      setFormData(null)
      const panel = document.getElementById('addArtistForm')
      panel.classList.toggle('hidden')
      const newEntry = data[0]
      setFetchedArtists([...fetchedArtists, newEntry])
    }
  }

  return (
    <form onSubmit={addArtist} className='shadow-md p-4 max-w-max' id='addArtistForm' >
      <FilePicker onChange={(e) => handleUpload(e)} size={200} url={fileUrl} />

      <input type='text' name='name' id='name' placeholder='Name' onChange={setData} required className='block mb-2 w-full mt-8' />
      <input type='text' name='headline' id='headline' placeholder='Headline' required onChange={setData} className='block mb-2 w-full' />
      <input type='text' name='description' id='description' placeholder='Description' required onChange={setData} className='block mb-2 w-full' />
      <input type='text' name='origin' id='origin' placeholder='Origin' required onChange={setData} className='block mb-2 w-full' />
      <div className='flex items-center gap-2 mt-8'>
        <input type='submit' className='button button-admin' value='Save' />
        <button onClick={() => setShowAdd(!showAdd)} className='button button-admin'>Cancel</button>
      </div>
    </form>
  )
}

export default AddArtist
