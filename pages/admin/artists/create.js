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
    <form onSubmit={addArtist} className='create-artist flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
      <div className='md:w-1/2 h-full'>
        <UploadImage
          bucket='artists'
          url={fileUrl}
          // size={200}
          onUpload={(url) => {
            setFormData({ ...formData, image_url: url })
            setFileUrl(url)
          }}
        />
      </div>

      <div className='md:w-1/2'>
        <label htmlFor='name' className='mt-12 w-full'>
          <input
            type='text' name='name' id='name'
            onChange={setData} required
            placeholder='Name'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='headline' className='mt-12 w-full'>
          <input
            type='text' name='headline' id='headline'
            onChange={setData} required
            placeholder='Headline'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='description' className='mt-12 w-full'>
          <textarea
            name='description' id='description' rows={10}
            onChange={setData} required
            placeholder="Description"
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='origin' className='mt-12 w-full'>
          <input
            type='text' name='origin' id='origin'
            onChange={setData} required
            placeholder='Origin'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <div className='flex items-center gap-2 mt-8'>
          <input type='submit' className='button button-admin' value='Create' disabled={!formIsReady || loading} />
        </div>
      </div>
    </form>
  )
}

export default Create
