import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/router'
import Head from 'next/head'
import UploadImage from '../../components/UploadImage'
import useApp from "../../context/App"

const CreateCollection = () => {
  const { address, signer, currentUser, notify } = useApp()

  const [imageUrl, setImageUrl] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const saveCollection = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!signer || !address) {
      notify("Please connect your wallet to proceed")
      return
    }

    const { error } = await supabase
      .from('collections')
      .insert([{
        ...formData,
        user: currentUser.id,
      }])

    if (!error) {
      notify("Collection created successfully!")
      setFormData(null)
      setLoading(false)
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    }
  }

  return (
    <>
      <Head>
        <title>Create Collection | Project Moonshire</title>
        <meta name='description' content="Create Collection | Project Moonshire" />
      </Head>

      <form onSubmit={saveCollection} className='create-collection flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mx-auto'>Create Collection</h1>

        <h1 className='mb-2'>Cover Image</h1>
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
          <h1 className='mb-2'>Title</h1>
          <input
            type='text' name='title' id='title'
            onChange={setData} required
            placeholder='Collection Title'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='headline' className='mt-12 w-full'>
          <h1 className='mb-2'>Headline</h1>
          <input
            type='text' name='headline' id='headline'
            onChange={setData} required
            placeholder='Collection Headline'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='description' className='mt-12 w-full'>
          <h1 className='mb-2'>Description</h1>
          <span className='block text-tiny mt-1'>The description will be included on the collection&apos;s detail page.</span>
          <textarea
            name='description' id='description' rows={10}
            onChange={setData} required
            placeholder="Provide a detailed description of your collection."
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='year' className='mt-12 w-full'>
          <h1 className='mb-2'>Year</h1>
          <input
            type='text' name='year' id='year'
            onChange={setData} required
            placeholder='Year of Appearance'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <input type='submit' className='button button-cta mt-12' value='Create' disabled={loading} />
      </form>
    </>
  )
}

export default CreateCollection
