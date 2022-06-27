import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { getPublicUrl } from '../../../lib/supabase/getPublicUrl'
import useApp from "../../../context/App"
import UploadImage from '../../../components/UploadImage'
import { useRouter } from 'next/router'
import BackBtn from '../../../components/admin/BackBtn'

const Artist = ({ artist }) => {
  const { id, name, headline, description, origin, featured, avatar_url } = artist
  const { notify } = useApp()
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState()
  const [isFeatured, setIsFeatured] = useState()
  const router = useRouter()

  useEffect(() => {
    setAvatarUrl(avatar_url)
    setIsFeatured(featured)
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
        featured: isFeatured,
      })
      .eq('id', id)

    if (!error) {
      notify("Artist updated successfully!")
      setLoading(false)
      setFormData(null)
      router.push('/admin')
    }
  }

  return (
    <div className='mb-20 w-full relative'>
      <BackBtn href='/admin' />

      <form onSubmit={saveArtist} className='edit-artist flex flex-col items-start max-w-2xl mx-auto px-[40px]'>
        <h1 className='mb-10'>Edit Artist</h1>

        <h2 className='mb-2'>Picture</h2>
        <UploadImage
          bucket='artists'
          url={avatarUrl}
          size={200}
          onUpload={(url) => {
            setFormData({ ...formData, avatar_url: url })
            setAvatarUrl(url)
          }}
        />

        <label htmlFor='name' className='mt-12 w-full'>
          <h2 className='mb-2'>Name</h2>
          <input
            type='text' name='name' id='name'
            onChange={setData} required
            defaultValue={name}
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
            defaultValue={headline}
            placeholder='Artist headline'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='description' className='mt-12 w-full'>
          <h2 className='mb-2'>Description</h2>
          <textarea
            name='description' id='description' rows={10}
            onChange={setData} required
            defaultValue={description}
            placeholder="Description"
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='origin' className='mt-12 w-full'>
          <h2 className='mb-2'>Origin</h2>
          <input
            type='text' name='origin' id='origin'
            onChange={setData} required
            defaultValue={origin}
            placeholder='Artist origin'
            className='block mt-2 w-full'
            disabled={loading}
          />
        </label>

        <label htmlFor='featured' className='mt-12 w-full'>
          <h2 className='mb-2'>Featured</h2>
          <div className="flex items-center mr-4">
            <input id="featured" type="checkbox" defaultChecked={featured} onChange={() => setIsFeatured(!featured)} className="w-4 h-4 text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600" disabled={loading} />
            <label htmlFor="featured" className="ml-2">Featured on Startpage</label>
          </div>
        </label>

        <input type='submit' className='button button-cta mt-12' value='Save' disabled={loading} />
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
