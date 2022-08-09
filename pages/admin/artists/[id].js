import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { getPublicUrl } from '../../../lib/supabase/getPublicUrl'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import SupaAuth from '../../../components/SupaAuth'
import UploadImage from '../../../components/UploadImage'
import BackBtn from '../../../components/admin/BackBtn'

const Artist = ({ artist }) => {
  const { id, name, headline, description, origin, avatar_url } = artist
  const { notify, currentUser } = useApp()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState()
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

  useEffect(() => {
    setAvatarUrl(avatar_url)
  }, [avatar_url])

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

  if (initializing) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  if (!session) return <SupaAuth />

  return (
    <div className='mb-20 w-full relative'>
      <form onSubmit={saveArtist} autoComplete='off' autoCorrect='off' spellCheck='false' autoCapitalize='false' className='edit-artist flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
        <div className='md:w-1/2 h-full'>
          <UploadImage
            bucket='artists'
            url={avatarUrl}
            // size={200}
            onUpload={(url) => {
              setFormData({ ...formData, avatar_url: url })
              setAvatarUrl(url)
            }}
          />
        </div>

        <div className='md:w-1/2'>
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
          <hr className='my-8' />

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
              name='description' id='description' rows={10}
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

          <div className='flex items-center gap-2 mt-12'>
            <input type='submit' className='button button-cta ml-4' value='Save' disabled={loading} />
            <BackBtn href='/admin?view=artists' />
          </div>

        </div>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const { data: artist } = await supabase.from('artists').select(`*`).eq('id', id).single()
  const { data: artistNfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).eq('artist', id).order('created_at', { ascending: false })

  artist.numberOfNfts = artistNfts.length
  const url = await getPublicUrl('artists', artist.avatar_url)
  artist.public_url = url

  return {
    props: { artist },
  }
}

export default Artist
