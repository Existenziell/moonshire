import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/router'
import { getPublicUrl } from '../../../lib/supabase/getPublicUrl'
import { PulseLoader } from 'react-spinners'
import useApp from "../../../context/App"
import SupaAuth from '../../../components/SupaAuth'
import UploadImage from '../../../components/UploadImage'
import BackBtn from '../../../components/admin/BackBtn'

const Collection = ({ collection }) => {
  const { id, title, headline, description, year, featured, image_url } = collection
  const { notify, currentUser } = useApp()

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const [isFeatured, setIsFeatured] = useState()
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
    setImageUrl(image_url)
    setIsFeatured(featured)
  }, [image_url])

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
        featured: isFeatured,
      })
      .eq('id', id)

    if (!error) {
      notify("Collection updated successfully!")
      setLoading(false)
      setFormData(null)
      router.push('/admin?view=collections')
    }
  }

  if (initializing) return <div className='flex items-center justify-center mt-32'><PulseLoader color={'var(--color-cta)'} size={20} /></div>
  if (!session) return <SupaAuth />

  return (
    <div className='mb-20 w-full relative'>
      <form onSubmit={saveCollection} className='edit-collection flex flex-col md:flex-row items-center justify-center gap-[40px] px-[40px]'>
        <div className='md:w-1/2 h-full'>
          <UploadImage
            bucket='collections'
            url={imageUrl}
            // size={200}
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
              className='block mt-2 w-full text-[20px] md:text-[30px]'
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

          <label htmlFor='featured' className='mt-12 w-full flex items-center ml-4'>
            <input id="featured" type="checkbox" defaultChecked={featured} onChange={() => setIsFeatured(!featured)} className="w-4 h-4 text-cta bg-gray-100 rounded border-gray-300 focus:ring-cta dark:focus:ring-cta dark:ring-offset-gray-800 focus:ring-2 dark:bg-brand-dark dark:border-gray-600" disabled={loading} />
            <label htmlFor="featured" className="ml-2">Featured</label>
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

export async function getServerSideProps(context) {
  const id = context.params.id

  let { data: collection } = await supabase.from('collections').select(`*`).eq('id', id).single()
  let { data: nfts } = await supabase.from('nfts').select(`*, collections(*), artists(*)`).order('id', { ascending: true })

  if (!collection) {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
      props: {}
    }
  }

  if (collection.image_url) {
    const url = await getPublicUrl('collections', collection.image_url)
    collection.public_url = url
  }

  // Set Number of NFTs in collection
  const collectionNfts = nfts.filter((n => n.collection === collection.id))
  collection.numberOfNfts = collectionNfts.length

  if (collectionNfts.length > 0) {

    // Collect artists that have NFTs in this collection
    let collectionArtists = []
    for (let nft of collectionNfts) {
      collectionArtists.push(nft.artists.name)
    }

    /* eslint-disable no-undef */
    const uniqueCollectionArtists = [...new Set(collectionArtists)]
    /* eslint-enable no-undef */
    collection.artists = uniqueCollectionArtists

    // Set floor and highest price
    let floorPrice = 1000000
    let highestPrice = 0

    for (let nft of collectionNfts) {
      if (highestPrice < nft.price) {
        highestPrice = nft.price
      }
      if (floorPrice > nft.price) {
        floorPrice = nft.price
      }
    }
    collection.floorPrice = floorPrice
    collection.highestPrice = highestPrice
  }

  return {
    props: { collection, collectionNfts },
  }
}

export default Collection
