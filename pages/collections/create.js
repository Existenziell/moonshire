import { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import Head from 'next/head'
import UploadImage from '../../components/UploadImage'

const CreateCollection = () => {
  const appCtx = useContext(AppContext)
  const { notify } = appCtx

  const [imageUrl, setImageUrl] = useState(null)
  const [formData, setFormData] = useState({})

  const router = useRouter()

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const saveCollection = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('collections')
      .insert([{
        ...formData
      }])

    if (!error) {
      notify("Collection created successfully!")
      setFormData(null)
      router.reload(window.location.pathname)
    }
  }

  return (
    <>
      <Head>
        <title>Create Collection | Project Moonshire</title>
        <meta name='description' content="Create Collection | Project Moonshire" />
      </Head>

      <form onSubmit={saveCollection} className='create-collection flex flex-col items-start max-w-2xl mx-auto pb-24'>
        <h1 className='mx-auto'>Create Collection</h1>

        <p>Cover Image</p>
        <p className='text-tiny mb-4'>File types supported: JPG, PNG, GIF, SVG. Max size: 50 MB</p>
        <UploadImage
          bucket='collections'
          url={imageUrl}
          size={250}
          onUpload={(url) => {
            setFormData({ ...formData, image_url: url })
            setImageUrl(url)
          }}
        />

        <label htmlFor='title' className='mt-12 w-full'>
          Title
          <input
            type='text' name='title' id='title'
            onChange={setData} required
            placeholder='Collection Title'
            className='block mt-2 w-full'
          />
        </label>

        <label htmlFor='headline' className='mt-12 w-full'>
          Headline
          <input
            type='text' name='headline' id='headline'
            onChange={setData} required
            placeholder='Collection Headline'
            className='block mt-2 w-full'
          />
        </label>

        <label htmlFor='description' className='mt-12 w-full'>
          Description
          <span className='block text-tiny mt-1'>The description will be included on the collection&apos;s detail page.</span>
          <textarea
            name='description' id='description' rows={10}
            onChange={setData} required
            placeholder="Provide a detailed description of your collection."
            className='block mt-2 w-full'
          />
        </label>

        <label htmlFor='year' className='mt-12 w-full'>
          Year
          <input
            type='text' name='year' id='year'
            onChange={setData} required
            placeholder='Year of Appearance'
            className='block mt-2 w-full'
          />
        </label>

        <input type='submit' className='button button-cta mt-12' value='Create' />
      </form>
    </>
  )
}

export default CreateCollection
