import { supabase } from '../../../lib/supabase'
import { useState } from 'react'
import useApp from "../../../context/App"
import { useRouter } from 'next/router'
import UploadImage from '../../../components/UploadImage'

const Create = () => {

  const { notify } = useApp()
  const [formData, setFormData] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formIsReady, setFormIsReady] = useState(false)
  const router = useRouter()

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
    if (fileUrl && formData.name && formData.headline && formData.description) setFormIsReady(true)
  }

  const addArtist = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
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
      setLoading(false)
      router.push('/artists')
    }
  }

  return (
    <form onSubmit={addArtist} className='create-artist flex flex-col items-start max-w-2xl mx-auto px-[40px]' id='addArtistForm'>
      <h1 className='mx-auto'>Create Artist</h1>

      <h2 className='mb-2'>Artist Picture</h2>
      <UploadImage
        bucket='artists'
        url={fileUrl}
        size={200}
        onUpload={(url) => {
          setFormData({ ...formData, image_url: url })
          setFileUrl(url)
        }}
      />
      <label htmlFor='name' className='mt-12 w-full'>
        <h2 className='mb-2'>Name</h2>
        <input
          type='text' name='name' id='name'
          onChange={setData} required
          placeholder='Artist name'
          className='block mt-2 w-full'
          disabled={loading}
        />
      </label>

      <label htmlFor='headline' className='mt-12 w-full'>
        <h2 className='mb-2'>Headline</h2>
        <input
          type='text' name='headline' id='headline'
          onChange={setData} required
          placeholder='Artist Headline'
          className='block mt-2 w-full'
          disabled={loading}
        />
      </label>

      <label htmlFor='description' className='mt-12 w-full'>
        <h2 className='mb-2'>Description</h2>
        <span className='block text-tiny mt-1'>The description will be included on the artist&apos;s detail page.</span>
        <textarea
          name='description' id='description' rows={10}
          onChange={setData} required
          placeholder="Provide background information of the featured artist."
          className='block mt-2 w-full'
          disabled={loading}
        />
      </label>

      <label htmlFor='origin' className='mt-12 w-full'>
        <h2 className='mb-2'>Origin</h2>
        <input
          type='text' name='origin' id='origin'
          onChange={setData} required
          placeholder='Origin of artist'
          className='block mt-2 w-full'
          disabled={loading}
        />
      </label>

      <div className='flex items-center gap-2 mt-8'>
        <input type='submit' className='button button-admin' value='Create' disabled={!formIsReady || loading} />
      </div>
    </form>
  )
}

export default Create
