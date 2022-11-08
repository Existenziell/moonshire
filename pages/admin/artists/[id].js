import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import SupaAuth from '../../../components/SupaAuth'
import UploadImage from '../../../components/UploadImage'
import BackBtn from '../../../components/admin/BackBtn'

const Artist = () => {
  const router = useRouter()
  const { id: queryId } = router.query
  const { notify, currentUser } = useApp()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState()
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)

  async function fetchApi(...args) {
    if (!queryId) return
    let { data: artist } = await supabase.from('artists').select(`*`).eq('id', queryId).single()
    let { nftCount } = await supabase.from('nfts').select(`*`, { count: 'exact' }).eq('artist', artist.id)
    artist.numberOfNfts = nftCount
    return artist
  }
  const { status, data: artist } = useQuery(["artist", queryId], () => fetchApi())

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
    setAvatarUrl(artist?.avatar_url)
  }, [artist?.avatar_url])

  const setData = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, ...{ [name]: value } })
  }

  const saveArtist = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('artists')
      .update({
        avatar_url: avatarUrl,
        name: formData.name ? formData.name : name,
        headline: formData.headline ? formData.headline : headline,
        description: formData.description ? formData.description : description,
        origin: formData.origin ? formData.origin : origin,
      })
      .eq('id', id)

    if (!error) {
      notify("Artist updated successfully!")
      setLoading(false)
      setFormData(null)
      router.push('/admin?view=artists')
    }
  }

  if (status === "error") return <p>{status}</p>
  if (initializing || !artist) return <div className='fullscreen-wrapper'><PulseLoader color={'var(--color-cta)'} size={10} /></div>
  if (!session) return <SupaAuth />

  const { id, name, headline, description, origin } = artist

  return (
    <form onSubmit={saveArtist} className='edit-artist sized-page-wrapper' autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false'>
      <div className='sized-image-wrapper'>
        <UploadImage
          bucket='artists'
          url={avatarUrl}
          onUpload={(url) => {
            setFormData({ ...formData, avatar_url: url })
            setAvatarUrl(url)
          }}
        />
      </div>

      <div className='w-full md:w-1/2'>
        <label htmlFor='name' className='mt-4 w-full block'>
          <input
            type='text' name='name' id='name'
            onChange={setData} required
            defaultValue={name}
            placeholder='Name'
            className='w-full text-[20px]'
            disabled={loading}
          />
        </label>
        <hr className='my-8 ml-4' />

        <label htmlFor='headline' className='mt-4 w-full block'>
          <input
            type='text' name='headline' id='headline'
            onChange={setData} required
            defaultValue={headline}
            placeholder='Headline'
            className='w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='description' className='mt-4 w-full block'>
          <textarea
            name='description' id='description' rows={5}
            onChange={setData} required
            defaultValue={description}
            placeholder="Description"
            className='w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='origin' className='mt-4 w-full block'>
          <input
            type='text' name='origin' id='origin'
            onChange={setData} required
            defaultValue={origin}
            placeholder='Origin'
            className='w-full'
            disabled={loading}
          />
        </label>
        <hr className='my-8 ml-4' />

        <div className='flex items-center gap-2 mt-12'>
          <input type='submit' className='button button-cta ml-4' value='Save' disabled={loading} />
          <BackBtn href='/admin?view=artists' />
        </div>

      </div>
    </form>
  )
}

export default Artist
