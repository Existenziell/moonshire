import { supabase } from '../../../lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import UploadImage from '../../../components/UploadImage'
import SupaAuth from '../../../components/SupaAuth'

const Create = () => {
  const { notify, currentUser } = useApp()
  const [formData, setFormData] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formIsReady, setFormIsReady] = useState(false)
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setSession(supabase.auth.session())
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.roles?.name === 'Admin') {
        setInitializing(false)
      } else {
        router.push('/')
      }
    }
  }, [currentUser?.roles?.name])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const handleUpload = async (url) => {
    setFormData({ ...formData, image_url: url })
    setFileUrl(url)
  }

  const checkForm = () => {
    (fileUrl && formData?.name && formData?.headline && formData?.description)
      ?
      setFormIsReady(true)
      :
      setFormIsReady(false)
  }

  useEffect(() => {
    checkForm()
  }, [formData, fileUrl])

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
      router.push('/admin?view=artists')
    }
  }

  if (initializing) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!session) return <SupaAuth />

  return (
    <form onSubmit={addArtist} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='create-artist flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
      <div className='md:w-1/2 h-full'>
        <UploadImage
          bucket='artists'
          url={fileUrl}
          // size={200}
          onUpload={(url) => handleUpload(url)}
        />
      </div>

      <div className='md:w-1/2'>
        <label htmlFor='name' className='mt-12 w-full'>
          <input
            type='text' name='name' id='name'
            onChange={setData} required
            placeholder='Name'
            className='block mt-2 w-full text-[20px]'
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

        <label htmlFor='origin' className='mt-12 w-full'>
          <input
            type='text' name='origin' id='origin'
            onChange={setData} required
            placeholder='Origin'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <input type='submit' className='button button-cta mt-10' value='Create' disabled={!formIsReady || loading} />
      </div>
    </form>
  )
}

export default Create
