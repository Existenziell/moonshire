import { useEffect, useState } from 'react'
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
  const [formIsReady, setFormIsReady] = useState(false)
  const router = useRouter()

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const checkForm = () => {
    (imageUrl && formData?.title && formData?.headline && formData?.description && formData?.year)
      ?
      setFormIsReady(true)
      :
      setFormIsReady(false)
  }

  const handleUpload = async (url) => {
    setFormData({ ...formData, image_url: url })
    setImageUrl(url)
  }

  useEffect(() => {
    checkForm()
  }, [formData, imageUrl])

  const saveCollection = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!signer || !address) {
      notify("Please connect your wallet to proceed")
      return
    }

    const { data, error } = await supabase
      .from('collections')
      .insert([{
        ...formData,
        user: currentUser.id,
      }])

    if (!error) {
      const id = data.at(0).id
      notify("Collection created successfully!")
      setFormData(null)
      setLoading(false)
      router.push(`/success-collection?id=${id}&title=${formData.title}&image_url=${imageUrl}`)
    }
  }

  return (
    <>
      <Head>
        <title>Create Collection | Project Moonshire</title>
        <meta name='description' content="Create Collection | Project Moonshire" />
      </Head>

      <form onSubmit={saveCollection} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='create-collection flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
        <div className='md:w-1/2 h-full'>
          <UploadImage
            bucket='collections'
            url={imageUrl}
            // size={200}
            onUpload={(url) => handleUpload(url)}
          />
          {/* <img src={public_url} alt='Cover Image' className='aspect-square shadow-2xl md:max-h-[calc(100vh-260px)]' /> */}
        </div>

        <div className='md:w-1/2'>
          <label htmlFor='title' className='mt-12 w-full'>
            <input
              type='text' name='title' id='title'
              onChange={setData} required
              placeholder='Title'
              className='block mt-2 w-full text-[20px] md:text-[30px]'
              disabled={loading}
            />
          </label>
          <hr className='my-8' />

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

          <label htmlFor='year' className='mt-12 w-full'>
            <input
              type='number' name='year' id='year'
              onChange={setData} required
              placeholder='Year of Appearance'
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <input type='submit' className='button button-cta mt-12 ml-4' value='Create' disabled={!formIsReady || loading} />
        </div>
      </form>
    </>
  )
}

export default CreateCollection
