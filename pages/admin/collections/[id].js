import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import SupaAuth from '../../../components/SupaAuth'
import UploadImage from '../../../components/UploadImage'
import BackBtn from '../../../components/admin/BackBtn'

const Collection = () => {
  const router = useRouter()
  const { id: queryId } = router.query
  const { notify, currentUser } = useApp()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(false)

  async function fetchApi(...args) {
    if (!queryId) return
    let { data: collection } = await supabase.from('collections').select(`*`).eq('id', queryId).single()
    let { nftCount } = await supabase.from('nfts').select(`*`, { count: 'exact' }).eq('collection', collection.id)
    collection.numberOfNfts = nftCount
    return collection
  }

  const { status, data: collection } = useQuery(["collection", queryId], () => fetchApi())

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

  useEffect(() => {
    setImageUrl(collection?.image_url)
  }, [collection?.image_url])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const saveCollection = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('collections')
      .update({
        image_url: imageUrl,
        title: formData.title ? formData.title : title,
        headline: formData.headline ? formData.headline : headline,
        description: formData.description ? formData.description : description,
        year: formData.year ? formData.year : year,
      })
      .eq('id', id)

    if (!error) {
      notify("Collection updated successfully!")
      setLoading(false)
      setFormData(null)
      router.push('/admin?view=collections')
    }
  }

  if (status === "error") return <p>{status}</p>
  if (initializing || !collection) return <div className='flex justify-center items-center w-full h-[calc(100vh-260px)]'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!session) return <SupaAuth />

  const { id, title, headline, description, year } = collection

  return (
    <div className='mb-20 w-full relative'>
      <form onSubmit={saveCollection} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='edit-collection flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
        <div className='md:w-1/2 h-full'>
          <UploadImage
            bucket='collections'
            url={imageUrl}
            onUpload={(url) => {
              setFormData({ ...formData, image_url: url })
              setImageUrl(url)
            }}
          />
        </div>
        <div className='md:w-1/2'>
          <label htmlFor='title' className='mt-12 w-full'>
            <input
              type='text' name='title' id='title'
              onChange={setData} required
              defaultValue={title}
              placeholder='Title'
              className='block mt-2 w-full text-[20px]'
              disabled={loading}
            />
          </label>
          <hr className='my-8' />

          <label htmlFor='headline' className='mt-12 w-full'>
            <input
              type='text' name='headline' id='headline'
              onChange={setData} required
              defaultValue={headline}
              placeholder='Headline'
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <label htmlFor='description' className='mt-12 w-full'>
            <textarea
              name='description' id='description' rows={10}
              onChange={setData} required
              defaultValue={description}
              placeholder="Description"
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <label htmlFor='year' className='mt-12 w-full'>
            <input
              type='number' name='year' id='year'
              onChange={setData} required
              defaultValue={year}
              placeholder='Year of Appearance'
              className='block mt-2 w-full'
              disabled={loading}
            />
          </label>

          <div className='flex items-center gap-2 mt-12'>
            <input type='submit' className='button button-cta ml-4' value='Save' disabled={loading} />
            <BackBtn href='/admin?view=collections' />
          </div>

        </div>
      </form>
    </div>
  )
}

export default Collection
